import Foundation
import JWT
import Vapor

/// Controls authentication endpoints
struct AuthController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let auth = routes.grouped("auth")

        // GET /auth/token
        auth.get("token") { req -> BearerTokenReponse in
            let user = try req.auth.require(User.self)
            
            let payload = BearerToken(
                subject: "vapor",
                username: user.name
            )
            
            return try BearerTokenReponse(token: req.jwt.sign(payload))
        }
    }

    /// A response to a client that includes an authorization token
    struct BearerTokenReponse: Content {
        var token: String
    }
}
