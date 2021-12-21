import JWT
import Vapor

struct SessionToken: Content, Authenticatable, JWTPayload {
    
    let expirationTime = 15 * 60 // 15 minutes
    
    enum CodingKeys: String, CodingKey {
        case subject = "sub"
        case username = "username"
        case expiration = "exp"
    }
    
    var subject: SubjectClaim
    var username: String
    var expiration: ExpirationClaim
    
    
    init(subject: SubjectClaim, username: String) {
        self.subject = subject
        self.username = username
        self.expiration = ExpirationClaim(value: Date().addingTimeInterval(TimeInterval(expirationTime)))
    }
    
    func verify(using signer: JWTSigner) throws {
        try self.expiration.verifyNotExpired()
    }
}
