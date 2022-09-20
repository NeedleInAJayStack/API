import Foundation
import JWT
import PostgresKit
import SQLKit
import Swiftgger
import Vapor

/// Controls history endpoints 
struct HisController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        
        let his = routes.grouped("his", ":pointId")
        var actions = [APIAction]()

        // GET /his/:pointId?start=...&end=...
        // Note that start and end are in seconds since epoch (1970-01-01T00:00:00Z)
        his.get { req -> EventLoopFuture<[His]> in
            let pointId = try req.getUuidParam("pointId")
            let dateRange = try req.query.decode(DateRange.self)
            let pDb = req.db as! PostgresDatabase

            return pDb.sql()
                .select()
                .column("*")
                .from(His.schema)
                .where("pointId", .equal, pointId)
                .where { groupQuery in
                    if let rangeStart = dateRange.start {
                        groupQuery.where("ts", .greaterThanOrEqual, rangeStart)
                    }
                    if let rangeEnd = dateRange.end {
                        groupQuery.where("ts", .lessThan, rangeEnd)
                    }
                    return groupQuery
                }
                .orderBy("ts", .ascending)
                .all(decoding: His.self)
        }
        actions.append(
            APIAction(
                method: .get,
                route: "/his/{pointId}",
                summary: "Retrieve historical data for a point",
                description: "Retrieve historical data for a point",
                parameters: [
                    APIParameter(
                        name: "pointId",
                        description: "The ID of the point",
                        required: true
                    ),
                    APIParameter(
                        name: "start",
                        description: "The seconds since epoch to start the data at",
                        required: false
                    ),
                    APIParameter(
                        name: "end",
                        description: "The seconds since epoch to end the data at",
                        required: false
                    )
                ],
                responses: [
                    APIResponse(
                        code: "200",
                        description: "A list of historical values",
                        object: [His].self
                    ),
                    APIResponse(
                        code: "401",
                        description: "User not authorized"
                    )
                ],
                authorization: true
            )
        )

        // POST /his/:pointId
        his.post { req -> EventLoopFuture<Success> in
            let pointId = try req.getUuidParam("pointId")
            let hisItem = try req.content.decode(HisItem.self)
            let his = His(pointId: pointId, ts: hisItem.ts, value: hisItem.value)
            let pDb = req.db as! PostgresDatabase

            return try pDb.sql()
                .insert(into: His.schema)
                .model(his)
                .onConflict(with: ["pointId", "ts"]) {
                    $0.set("value", to: his.value)
                }
                .run()
                .transform(to: Success())
        }
        actions.append(
            APIAction(
                method: .post,
                route: "/his/{pointId}",
                summary: "Write a new historical value for a point",
                description: "Write a new historical value for a point",
                parameters: [
                    APIParameter(
                        name: "pointId",
                        description: "The ID of the point",
                        required: true
                    )
                ],
                request: APIRequest(
                    object: HisItem.self,
                    description: "The new historical value to write"
                ),
                responses: [
                    APIResponse(
                        code: "200",
                        description: "A value indicating the write was successful",
                        object: Success.self
                    ),
                    APIResponse(
                        code: "401",
                        description: "User not authorized"
                    )
                ],
                authorization: true
            )
        )

        // DELETE /his/:pointId?start=...&end=...
        // Note that start and end are in seconds since epoch (1970-01-01T00:00:00Z)
        his.delete { req -> EventLoopFuture<Success> in
            let pointId = try req.getUuidParam("pointId")
            let dateRange = try req.query.decode(DateRange.self)
            let pDb = req.db as! PostgresDatabase

            return pDb.sql()
                .delete(from: His.schema)
                .where("pointId", .equal, pointId)
                .where { groupQuery in
                    if let rangeStart = dateRange.start {
                        groupQuery.where("ts", .greaterThanOrEqual, rangeStart)
                    }
                    if let rangeEnd = dateRange.end {
                        groupQuery.where("ts", .lessThan, rangeEnd)
                    }
                    return groupQuery
                }
                .run()
                .transform(to: Success())
        }
        actions.append(
            APIAction(
                method: .delete,
                route: "/his/{pointId}",
                summary: "Delete historical data from a point",
                description: "Delete historical data from a point",
                parameters: [
                    APIParameter(
                        name: "pointId",
                        description: "The ID of the point",
                        required: true
                    ),
                    APIParameter(
                        name: "start",
                        description: "The seconds since epoch to start the deletion at",
                        required: false
                    ),
                    APIParameter(
                        name: "end",
                        description: "The seconds since epoch to end the deletion at",
                        required: false
                    )
                ],
                responses: [
                    APIResponse(
                        code: "200",
                        description: "A value indicating the delete was successful",
                        object: Success.self
                    ),
                    APIResponse(
                        code: "401",
                        description: "User not authorized"
                    )
                ],
                authorization: true
            )
        )
        
        openAPIBuilder.add(
            APIController(
                name: "History",
                description: "Controller where we can manage historical data",
                actions: actions
            )
        ).add([
            APIObject(object: His(pointId: UUID(), ts: Date(), value: 5.2))
        ])
    }

    struct DateRange: Content {
        let start: Date?
        let end: Date?
    }
}
