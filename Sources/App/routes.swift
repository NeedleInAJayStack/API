import Vapor
import SQLKit

func routes(_ app: Application) throws {
    
    // MARK: Rec
    
    app.group("recs") { recs in
        // GET /recs
        recs.get { req -> EventLoopFuture<[Rec]> in
            return Rec.query(on: req.db).all()
        }
        // POST /recs
        recs.post { req -> EventLoopFuture<Rec> in
            let rec = try req.content.decode(Rec.self)
            return rec.create(on: req.db).transform(to: rec)
        }

        recs.group(":id") { rec in
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
}

struct Success: Content {
    let success = true
}

extension Request {
    func getUuidParam(_ name: String) throws -> UUID {
        guard let valueStr = self.parameters.get(name) else {
            throw Abort(.badRequest, reason: "\(name) parameter is required")
        }
        guard let value = UUID.init(uuidString: valueStr) else {
            throw Abort(.badRequest, reason: "\(name) parameter is not valid UUID")
        }
        return value
    }
}
