import Foundation
import Swiftgger

let openAPIBuilder = OpenAPIBuilder(
    title: "Jay's API",
    version: "0.0.1",
    description: "This manages Jay's historical datasets.",
    termsOfService: "http://example.com/terms/",
    contact: APIContact(
        name: "Jay Herron",
        email: "jay@jayherron.org",
        url: URL(string: "http://www.jayherron.org")
    ),
    license: APILicense(
        name: "MIT",
        url: URL(string: "http://mit.license")
    ),
    authorizations: [
        .jwt(description: "You can get token from `token` action from `Auth` controller.")
    ]
)

var document: OpenAPIDocument? = nil
