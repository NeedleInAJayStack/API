import Fluent
import Vapor


/// A "User" in the system. Users are not persisted or tied to the data in any way, but is only used for authentication.
/// Login is controlled by environment variables in a form that only supports a single user.
struct User: Authenticatable {
    var name: String
}

struct UserBasicAuthenticator: BasicAuthenticator {
    typealias User = App.User

    func authenticate(
        basic: BasicAuthorization,
        for request: Request
    ) -> EventLoopFuture<Void> {
        return request.eventLoop.tryFuture {
            let username = try Environment.getOrThrow("USERNAME")
            let password = try Environment.getOrThrow("PASSWORD")
            
            if basic.username == username && basic.password == password {
                request.auth.login(User(name: basic.username))
            }
        }
    }
}

extension User: SessionAuthenticatable {
    var sessionID: String {
        // User is identified uniquely by its name
        self.name
    }
}
