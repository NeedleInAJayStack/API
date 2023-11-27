import Fluent
import Vapor


struct User: Authenticatable {
    var name: String
}

struct UserBasicAuthenticator: BasicAuthenticator {
    typealias User = App.User

    func authenticate(
        basic: BasicAuthorization,
        for request: Request
    ) -> EventLoopFuture<Void> {
        do {
            let username = try Environment.getOrThrow("USERNAME")
            let password = try Environment.getOrThrow("PASSWORD")
            
            if basic.username == username && basic.password == password {
                request.auth.login(User(name: basic.username))
            }
        } catch {
            return request.eventLoop.makeFailedFuture(error)
        }
        
        return request.eventLoop.makeSucceededVoidFuture()
   }
}

extension User: SessionAuthenticatable {
    var sessionID: String {
        // User is identified uniquely by its name
        self.name
    }
}
