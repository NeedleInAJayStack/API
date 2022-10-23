import Foundation
import Vapor

final class His: Content {
    static let schema = "his"

    var pointId: UUID
    var ts: Date
    var value: Double?

    init(pointId: UUID, ts: Date, value: Double?) {
        self.pointId = pointId
        self.ts = ts
        self.value = value
    }
}

final class HisItem: Content {
    var ts: Date
    var value: Double?

    init(ts: Date, value: Double?) {
        self.ts = ts
        self.value = value
    }
}
