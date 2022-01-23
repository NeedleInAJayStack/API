import Foundation
import JWT
import Vapor

/// Controls authentication endpoints
struct AuthController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let auth = routes.grouped("auth")

        // GET /auth/token
        auth.get("token") { req -> ClientTokenReponse in
            let user = try req.auth.require(User.self)
            
            let payload = SessionToken(
                subject: "vapor",
                username: user.name
            )
            
            return try ClientTokenReponse(token: req.jwt.sign(payload))
        }
    }

    /// A response to a client that includes an authorization token
    struct ClientTokenReponse: Content {
        var token: String
    }
}