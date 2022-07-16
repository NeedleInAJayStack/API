import Foundation
import JWT
import PostgresKit
import SQLKit
import Vapor

/// Controls record endpoints
struct RecController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {

        let recs = routes.grouped("recs")

        // GET /recs
        recs.get { req -> EventLoopFuture<[Rec]> in
            return Rec.query(on: req.db)
                .filter(.sql(json: "tags", "siteMeter"), .equal, .bind("true"))
                .sort(\.$dis)
                .all()
        }

        // POST /recs
        recs.post { req -> EventLoopFuture<Rec> in
            let rec = try req.content.decode(Rec.self)
            return rec.create(on: req.db).transform(to: rec)
        }


        let rec = recs.grouped(":id")

        // GET /recs/:id
        rec.get { req -> EventLoopFuture<Rec> in
            let id = try req.getUuidParam("id")
            return Rec.query(on: req.db)
                .filter(\.$id, .equal, id)
                .first()
                .unwrap(or: Abort(.badRequest, reason: "ID not found"))
        }

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
        
        // DELETE /recs/:id
        rec.delete { req -> EventLoopFuture<Success> in
            let id = try req.getUuidParam("id")
            return Rec.query(on: req.db)
                .filter(\.$id, .equal, id)
                .delete()
                .transform(to: Success())
        }
        
        // TODO: Look into PATCH
    }
}
