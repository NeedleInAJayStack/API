import Fluent
import FluentPostgresDriver
import JWT
import Vapor

// configures your application
public func configure(_ app: Application) throws {
    // uncomment to serve files from /Public folder
    // app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))

    // Database connection
    let hostname = try Environment.getOrThrow("DATABASE_HOST")
    let username = try Environment.getOrThrow("DATABASE_USERNAME")
    let password = try Environment.getOrThrow("DATABASE_PASSWORD")
    let database = try Environment.getOrThrow("DATABASE_NAME")
    app.databases.use(.postgres(hostname: hostname, username: username, password: password, database: database), as: .psql)
    // app.logger.logLevel = .debug
    
    // Migrations
    app.migrations.add(MigrationV1_0_0())
    
    // JWT config
    app.jwt.signers.use(.hs256(key: "V12XGSmdZzgg3N4zhUtz"))

    // register routes
    try routes(app)
}

enum ApiError: Error {
    case environmentInvalid(_ message: String)
}

extension Environment {
    static func getOrThrow(_ name: String) throws -> String {
        guard let value = Self.get(name) else {
            throw ApiError.environmentInvalid("\(name) must be set")
        }
        return value
    }
}
