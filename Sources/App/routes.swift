import Foundation
import PostgresKit
import SQLKit
import Vapor

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
    
    // MARK: His
    
    app.group("his", ":pointId") { his in
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
}

struct Success: Content {
    let success = true
}

struct DateRange: Content {
    let start: Date?
    let end: Date?
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
