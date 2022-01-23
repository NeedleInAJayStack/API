import Foundation
import JWT
import PostgresKit
import SQLKit
import Vapor

func routes(_ app: Application) throws {
    let basicAuth = app.grouped(UserBasicAuthenticator(), User.guardMiddleware())
    try basicAuth.register(collection: AuthController())
    
    let tokenAuth = app.grouped(SessionToken.authenticator(), SessionToken.guardMiddleware())
    try tokenAuth.register(collection: RecController())
    try tokenAuth.register(collection: HisController())
}
