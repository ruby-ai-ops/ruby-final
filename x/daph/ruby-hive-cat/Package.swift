// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "RubyHiveCat",
    platforms: [
        .macOS(.v13)
    ],
    targets: [
        .executableTarget(
            name: "RubyHiveCat",
            path: "RubyHiveCat",
            resources: [
                .copy("Resources")
            ]
        )
    ]
)
