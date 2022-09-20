import Foundation
import JWT
import Swiftgger
import Vapor

/// Controls authentication endpoints
struct AuthController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        
        let auth = routes.grouped("auth")
        var actions = [APIAction]()

        // GET /auth/token
        auth.get("token") { req -> ClientTokenResponse in
            let user = try req.auth.require(User.self)
            
            let payload = SessionToken(
                subject: "vapor",
                username: user.name
            )
            
            return try ClientTokenResponse(token: req.jwt.sign(payload))
        }
        actions.append(
            APIAction(
                method: .get,
                route: "/auth/token",
                summary: "Retrieve an authorization token",
                description: "A JWT authorization token for bearer authorization",
                responses: [
                    APIResponse(
                        code: "200",
                        description: "An authorization token",
                        object: ClientTokenResponse.self
                    ),
                    APIResponse(
                        code: "401",
                        description: "User not authorized"
                    )
                ],
                authorization: true
            )
        )
        
        openAPIBuilder.add(
            APIController(
                name: "Users",
                description: "Controller where we can manage users",
                actions: actions
            )
        ).add([
            APIObject(object: ClientTokenResponse(token: "your-auth-token")),
        ])
    }

    /// A response to a client that includes an authorization token
    struct ClientTokenResponse: Content {
        var token: String
    }
}
