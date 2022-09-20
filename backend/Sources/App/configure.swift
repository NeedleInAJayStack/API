import Fluent
import FluentPostgresDriver
import JWT
import Vapor

// configures your application
public func configure(_ app: Application) throws {
    app.http.server.configuration.hostname = "0.0.0.0"
    app.http.server.configuration.port = 8079

    // Change to encode/decode dates as ISO strings
    let encoder: JSONEncoder = .custom(dates: .iso8601)
    ContentConfiguration.global.use(encoder: encoder, for: .json)
    let decoder: JSONDecoder = .custom(dates: .iso8601)
    ContentConfiguration.global.use(decoder: decoder, for: .json)

    // CORS middleware so that browser can hit API correctly
    let corsConfiguration = CORSMiddleware.Configuration(
        allowedOrigin: .all,
        allowedMethods: [.GET, .POST, .PUT, .OPTIONS, .DELETE, .PATCH],
        allowedHeaders: [.accept, .authorization, .contentType, .origin, .xRequestedWith, .userAgent, .accessControlAllowOrigin]
    )
    app.middleware.use(CORSMiddleware(configuration: corsConfiguration), at: .beginning)
    
    // Sessions middleware
    app.middleware.use(app.sessions.middleware)
    
    // File middleware to serve public files
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory, defaultFile: "index.html"))
    

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
    document = openAPIBuilder.built()
}
