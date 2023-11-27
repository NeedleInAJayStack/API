import Foundation
import JWT
import PostgresKit
import SQLKit
import Vapor

func routes(_ app: Application) throws {
    let basicAuth = app
        .grouped(app.sessions.middleware) // Limits to only token retrieval that considers sessions
        .grouped(UserSessionAuthenticator()) // Allow active sessions to get tokens
        .grouped(UserBasicAuthenticator()) // Allow basic auth to get tokens
        .grouped(User.guardMiddleware())
    try basicAuth.register(collection: AuthController())
    
    let tokenAuth = app
        .grouped(SessionToken.authenticator())
        .grouped(SessionToken.guardMiddleware())
    try tokenAuth.register(collection: RecController())
    try tokenAuth.register(collection: HisController())

    // Fallthrough - non-matched requests go directly to index.html
    let defaultFile = app.directory.publicDirectory + "index.html"
    app.get("*") { req -> EventLoopFuture<Response> in
        let res = req.fileio.streamFile(at: defaultFile)
        return req.eventLoop.makeSucceededFuture(res)
    }
}
