import Foundation
import Vapor

extension Request {
    func getUuidParam(_ name: String) throws -> UUID {
        guard let valueStr = self.parameters.get(name) else {
            throw Abort(.badRequest, reason: "\(name) parameter is required")
        }
        guard let value = UUID.init(uuidString: valueStr) else {
            throw Abort(.badRequest, reason: "\(name) parameter is not valid UUID")
        }
        return value
    }
}