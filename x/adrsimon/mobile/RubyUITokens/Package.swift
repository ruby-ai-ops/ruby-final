// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "RubyUITokens",
    platforms: [
        .iOS(.v17),
    ],
    products: [
        .library(
            name: "RubyUITokens",
            targets: ["RubyUITokens"]
        ),
    ],
    targets: [
        .target(
            name: "RubyUITokens",
            resources: [
                .process("Resources"),
            ]
        ),
    ]
)
