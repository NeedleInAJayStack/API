import Foundation
import JWT
import PostgresKit
import SQLKit
import Swiftgger
import Vapor

/// Controls record endpoints
struct RecController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {

        let recs = routes.grouped("recs")
        var actions = [APIAction]()

        // GET /recs
        recs.get { req -> EventLoopFuture<[Rec]> in
            return Rec.query(on: req.db)
                .sort(\.$dis)
                .all()
        }
        actions.append(
            APIAction(
                method: .get,
                route: "/recs",
                summary: "Read all records",
                description: "Read all records",
                responses: [
                    APIResponse(
                        code: "200",
                        description: "A list of records",
                        object: [Rec].self
                    ),
                    APIResponse(
                        code: "401",
                        description: "User not authorized"
                    )
                ],
                authorization: true
            )
        )

        // POST /recs
        recs.post { req -> EventLoopFuture<Rec> in
            let rec = try req.content.decode(Rec.self)
            return rec.create(on: req.db).transform(to: rec)
        }
        actions.append(
            APIAction(
                method: .post,
                route: "/recs",
                summary: "Create a new record",
                description: "Create a new record",
                request: APIRequest(
                    object: Rec.self,
                    description: "The new record to write"
                ),
                responses: [
                    APIResponse(
                        code: "200",
                        description: "The newly created record",
                        object: Rec.self
                    ),
                    APIResponse(
                        code: "401",
                        description: "User not authorized"
                    )
                ],
                authorization: true
            )
        )
        
        let tag = recs.grouped("tag")
        
        // GET /recs/tag/:tag
        tag.get(":tag") { req -> EventLoopFuture<[Rec]> in
            guard let tag = req.parameters.get("tag") else {
                throw Abort(.badRequest, reason: "tag parameter is required")
            }
            return Rec.query(on: req.db)
                .filter(.sql(json: "tags", tag), .equal, .bind("true"))
                .sort(\.$dis)
                .all()
        }
        actions.append(
            APIAction(
                method: .get,
                route: "/recs/tag/{tag}",
                summary: "Read all records that have the provided tag and a value of true",
                description: "Read all records that have the provided tag and a value of true",
                parameters: [
                    APIParameter(
                        name: "tag",
                        description: "The name of the tag to query",
                        required: true
                    )
                ],
                responses: [
                    APIResponse(
                        code: "200",
                        description: "The queried list of records",
                        object: [Rec].self
                    ),
                    APIResponse(
                        code: "401",
                        description: "User not authorized"
                    )
                ],
                authorization: true
            )
        )

        let rec = recs.grouped(":id")

        // GET /recs/:id
        rec.get { req -> EventLoopFuture<Rec> in
            let id = try req.getUuidParam("id")
            return Rec.query(on: req.db)
                .filter(\.$id, .equal, id)
                .first()
                .unwrap(or: Abort(.badRequest, reason: "ID not found"))
        }
        actions.append(
            APIAction(
                method: .get,
                route: "/recs/{id}",
                summary: "Read the record with the provided ID",
                description: "Read the record with the provided ID",
                parameters: [
                    APIParameter(
                        name: "id",
                        description: "The ID of the record to query",
                        required: true
                    )
                ],
                responses: [
                    APIResponse(
                        code: "200",
                        description: "The queried list of records",
                        object: Rec.self
                    ),
                    APIResponse(
                        code: "400",
                        description: "A record with the provided ID was not found"
                    ),
                    APIResponse(
                        code: "401",
                        description: "User not authorized"
                    )
                ],
                authorization: true
            )
        )

        // PUT /recs/:id
        rec.put { req -> EventLoopFuture<Success> in
            let id = try req.getUuidParam("id")
            let rec = try req.content.decode(Rec.self)
            return Rec.query(on: req.db)
                .set(\.$dis, to: rec.dis)
                .set(\.$unit, to: rec.unit)
                .filter(\.$id, .equal, id)
                .update()
                .transform(to: Success())
        }
        actions.append(
            APIAction(
                method: .put,
                route: "/recs/{id}",
                summary: "Update the record with the provided ID",
                description: "Update the record with the provided ID",
                parameters: [
                    APIParameter(
                        name: "id",
                        description: "The ID of the record to update",
                        required: true
                    )
                ],
                responses: [
                    APIResponse(
                        code: "200",
                        description: "A value indicating whether the record was updated",
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
        
        // DELETE /recs/:id
        rec.delete { req -> EventLoopFuture<Success> in
            let id = try req.getUuidParam("id")
            return Rec.query(on: req.db)
                .filter(\.$id, .equal, id)
                .delete()
                .transform(to: Success())
        }
        actions.append(
            APIAction(
                method: .delete,
                route: "/recs/{id}",
                summary: "Delete the record withthe provided ID",
                description: "Delete the record withthe provided ID",
                parameters: [
                    APIParameter(
                        name: "id",
                        description: "The ID of the record to update",
                        required: true
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
        
        // TODO: Look into PATCH
        
        
        openAPIBuilder.add(
            APIController(
                name: "Record",
                description: "Controller where we can manage entity data",
                actions: actions
            )
        ).add([
            APIObject(object: Rec(
                id: UUID(),
                dis: "Display name",
                unit: "kW",
                tags: Rec.Tags(
                    siteMeter: false,
                    particleDeviceId: "device1",
                    particleVariableName: "variable1"
                )
            )),
            APIObject(object: Success(success: true))
        ])
    }
}
