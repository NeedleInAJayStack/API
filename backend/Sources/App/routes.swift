import Foundation
import JWT
import PostgresKit
import SQLKit
import Vapor

func routes(_ app: Application) throws {
    app.get("openapi") { request in
        guard let openApiDocument = document else {
            throw Abort(.internalServerError)
        }
        let encoder = JSONEncoder()
        let data = try encoder.encode(openApiDocument)
        
        var headers = HTTPHeaders()
        headers.add(name: .contentType, value: "application/json")
        return Response(
            status: .ok,
            headers: headers,
            body: .init(data: data)
        )
    }
    
    let basicAuth = app.grouped(UserBasicAuthenticator(), User.guardMiddleware())
    try basicAuth.register(collection: AuthController())
    
    let tokenAuth = app.grouped(SessionToken.authenticator(), SessionToken.guardMiddleware())
    try tokenAuth.register(collection: RecController())
    try tokenAuth.register(collection: HisController())

    // Fallthrough - non-matched requests go directly to index.html
    let defaultFile = app.directory.publicDirectory + "index.html"
    app.get("*") { req -> EventLoopFuture<Response> in
        let res = req.fileio.streamFile(at: defaultFile)
        return req.eventLoop.makeSucceededFuture(res)
    }
}
