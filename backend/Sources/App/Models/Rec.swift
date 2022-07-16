import Foundation
import Fluent
import Vapor

final class Rec: Model, Content {
    static let schema = "rec"

    @ID(key: .id)
    var id: UUID?
    
    @Field(key: "dis")
    var dis: String
    
    @Field(key: "unit")
    var unit: String?
    
    // JSON column - since we only filter for a field (and that filter is string-based), this isn't really used.
    @Field(key: "tags")
    var tags: Tags?
    
    struct Tags: Codable {
        let siteMeter: Bool?
        
        let particleDeviceId: String?
        let particleVariableName: String?
    }
    
    init() { }

    init(id: UUID? = nil, dis: String, unit: String?, tags: Tags?) {
        self.id = id
        self.dis = dis
        self.unit = unit
        self.tags = tags
    }
}
