import Foundation
import JWT
import PostgresKit
import SQLKit
import Vapor

/// Controls history endpoints 
struct HisController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {

        let his = routes.grouped("his", ":pointId")

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
    }

    struct DateRange: Content {
        let start: Date?
        let end: Date?
    }
}
