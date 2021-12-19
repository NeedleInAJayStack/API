import Foundation
import Fluent
import Vapor

final class Rec: Model, Content {
    static let schema = "rec"

    @ID(key: .id)
    var id: UUID?

    // TODO: Determine how (or whether) to use JSON data
//    @Field(key: "tags")
//    var tags: String
    
    @Field(key: "dis")
    var dis: String
    
    @Field(key: "unit")
    var unit: String?
    
    init() { }

    init(id: UUID? = nil, dis: String, unit: String?) {
        self.id = id
        self.dis = dis
        self.unit = unit
    }
}
