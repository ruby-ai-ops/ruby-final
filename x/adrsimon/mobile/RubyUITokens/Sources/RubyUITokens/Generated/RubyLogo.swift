// DO NOT EDIT — Generated from RubyUI (tailwind.config.js)
// Run: cd ui && node scripts/generate-swift.mjs


import SwiftUI

/// Type-safe access to Ruby logo variants bundled in RubyUITokens.
public enum RubyLogo: String, CaseIterable {
    case rubyLogo = "RubyLogo"
    case rubyLogoMono = "RubyLogoMono"
    case rubyLogoMonoWhite = "RubyLogoMonoWhite"
    case rubyLogoWhite = "RubyLogoWhite"
    case rubyLogoGray = "RubyLogoGray"
    case rubyLogoSquare = "RubyLogoSquare"
    case rubyLogoSquareMono = "RubyLogoSquareMono"
    case rubyLogoSquareMonoWhite = "RubyLogoSquareMonoWhite"
    case rubyLogoSquareWhite = "RubyLogoSquareWhite"
    case rubyLogoSquareGray = "RubyLogoSquareGray"

    public var image: Image {
        Image(rawValue, bundle: .module)
    }
}
