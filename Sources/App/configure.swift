import Fluent
import FluentPostgresDriver
import FluentSQLiteDriver
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
    
    // File middleware to serve public files
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory, defaultFile: "index.html"))
    

    // Database
    switch app.environment {
    case .testing:
        app.databases.use(.sqlite(.memory), as: .sqlite)
    default:
        try app.databases.use(
            .postgres(
                configuration: SQLPostgresConfiguration(
                    hostname: Environment.getOrThrow("DATABASE_HOST"),
                    username: Environment.getOrThrow("DATABASE_USERNAME"),
                    password: Environment.getOrThrow("DATABASE_PASSWORD"),
                    database: Environment.getOrThrow("DATABASE_NAME"),
                    tls: .disable
                )
            ),
            as: .psql
        )
    }
    
    // Migrations
    app.migrations.add(MigrationV1_0_0())
    
    // JWT config
    app.jwt.signers.use(.hs256(key: "V12XGSmdZzgg3N4zhUtz"))

    // register routes
    try routes(app)
}
