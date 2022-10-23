import Fluent
import SQLKit

struct MigrationV1_0_0: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        return database.eventLoop.makeSucceededVoidFuture().flatMap { _ in
            database.schema("rec")
                .id()
                .field("dis", .string, .required)
                .field("tags", .json)
                .field("unit", .string)
                .create()
        }.flatMap { _ in
            database.schema("his")
                .field("pointId", .uuid, .required)
                .field("ts", .datetime, .required)
                .field("value", .double)
                .constraint(.sql(.primaryKey(columns: [SQLColumn("pointId"), SQLColumn("ts")])))
                .foreignKey("pointId", references: "rec", "id")
                .create()
        }.flatMap { _ in
            guard let sql = database as? SQLDatabase else {
                return database.eventLoop.makeSucceededVoidFuture()
            }
            return sql.select()
                .column(SQLFunction("create_hypertable", args: [SQLLiteral.string("his"), SQLLiteral.string("ts")]))
                .run()
        }
    }

    func revert(on database: Database) -> EventLoopFuture<Void> {
        return database.eventLoop.makeSucceededVoidFuture().flatMap { _ in
            database.schema("his").delete()
        }.flatMap { _ in
            database.schema("rec").delete()
        }
    }
}
