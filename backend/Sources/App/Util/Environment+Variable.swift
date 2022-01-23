import Vapor

extension Environment {
    /// Get the environment variable or throw if not set
    static func getOrThrow(_ name: String) throws -> String {
        guard let value = Self.get(name) else {
            throw ApiError.environmentInvalid("\(name) must be set")
        }
        return value
    }
}