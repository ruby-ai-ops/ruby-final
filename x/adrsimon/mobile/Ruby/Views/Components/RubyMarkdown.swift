import Foundation
import MarkdownUI
import RubyUITokens
import SwiftUI

// MARK: - Directive Preprocessing

// Transforms Ruby custom markdown directives into standard markdown
// before passing to MarkdownUI which only supports GFM.
// swiftlint:disable:next force_try
private let mentionRegex = try! NSRegularExpression(pattern: #":mention(?:_user)?\[([^\]]*)\]\{[^}]*\}"#)
// swiftlint:disable:next force_try
private let citeRegex = try! NSRegularExpression(pattern: #":cite\[([^\]]*)\](?:\{[^}]*\})?"#)

func preprocessDirectives(_ markdown: String) -> String {
    var result = markdown
    let range = NSRange(result.startIndex..., in: result)

    // :mention[Name]{sId=xxx} / :mention_user[Name]{sId=xxx} → [@Name](ruby://mention)
    result = mentionRegex.stringByReplacingMatches(in: result, range: range, withTemplate: "[@$1](ruby://mention)")

    // :cite[ref1,ref2]{} → ¹² (unicode superscript numbers)
    result = processCiteDirectives(result).text

    return result
}

/// Single-pass processing of :cite directives. Returns both the transformed markdown
/// and the ordered mapping of ref keys to sequential numbers.
func processCiteDirectives(_ markdown: String) -> (text: String, mapping: [CiteEntry]) {
    var counter = 0
    var seen: [String: Int] = [:]
    var ordered: [CiteEntry] = []
    var result = ""
    var lastEnd = markdown.startIndex
    let matches = citeRegex.matches(in: markdown, range: NSRange(location: 0, length: (markdown as NSString).length))

    for match in matches {
        guard let matchRange = Range(match.range, in: markdown),
              let refsRange = Range(match.range(at: 1), in: markdown)
        else { continue }

        result += markdown[lastEnd ..< matchRange.lowerBound]

        let markers = markdown[refsRange].split(separator: ",").compactMap { part -> String? in
            let ref = part.trimmingCharacters(in: .whitespaces)
            guard !ref.isEmpty else { return nil }
            if seen[ref] == nil {
                counter += 1
                seen[ref] = counter
                ordered.append(CiteEntry(ref: ref, number: counter))
            }
            return superscript(seen[ref]!)
        }
        result += markers.joined(separator: "\u{2009}")
        lastEnd = matchRange.upperBound
    }
    result += markdown[lastEnd...]
    return (result, ordered)
}

private let superscriptDigits: [Character] = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"]

private func superscript(_ number: Int) -> String {
    String(String(number).map { superscriptDigits[Int(String($0))!] })
}

struct CiteEntry: Equatable {
    let ref: String
    let number: Int
}

/// An agent message's content run through the directive pipeline once: the
/// display markdown and the citation mapping both come from a single cite pass,
/// so consumers never re-scan the content.
struct RenderedAgentMessage: Equatable {
    let displayMarkdown: String
    let citeMapping: [CiteEntry]

    static let empty = RenderedAgentMessage(displayMarkdown: "", citeMapping: [])

    init(content: String) {
        let range = NSRange(content.startIndex..., in: content)
        let mentioned = mentionRegex.stringByReplacingMatches(
            in: content, range: range, withTemplate: "[@$1](ruby://mention)"
        )
        let cited = processCiteDirectives(mentioned)
        self.displayMarkdown = cited.text
        self.citeMapping = cited.mapping
    }

    private init(displayMarkdown: String, citeMapping: [CiteEntry]) {
        self.displayMarkdown = displayMarkdown
        self.citeMapping = citeMapping
    }
}

// MARK: - Markdown Theme

extension MarkdownUI.Theme {
    static let ruby = Theme()
        .text {
            ForegroundColor(Color.rubyForeground)
            FontSize(RubyUIFont.smSize)
            FontFamily(.custom("Geist"))
        }
        .link {
            ForegroundColor(Color.primary800)
            FontWeight(.semibold)
        }
        .strong {
            FontWeight(.semibold)
        }
        .thematicBreak {
            Divider()
                .markdownMargin(top: 16, bottom: 16)
        }
        .code {
            FontFamily(.custom("Geist Mono"))
            FontSize(RubyUIFont.xsSize)
            ForegroundColor(Color.rubyForeground)
            BackgroundColor(Color.rubyFaint.opacity(0.15))
        }
        .codeBlock { configuration in
            ScrollView(.horizontal) {
                configuration.label
                    .markdownTextStyle {
                        FontFamily(.custom("Geist Mono"))
                        FontSize(RubyUIFont.xsSize)
                        ForegroundColor(Color.rubyForeground)
                    }
                    .padding(12)
            }
            .background(Color.rubyFaint.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .heading1 { configuration in
            configuration.label
                .markdownTextStyle {
                    FontFamily(.custom("Geist"))
                    FontWeight(.semibold)
                    FontSize(RubyUIFont.xlSize)
                    ForegroundColor(Color.rubyForeground)
                }
                .markdownMargin(top: 16, bottom: 8)
        }
        .heading2 { configuration in
            configuration.label
                .markdownTextStyle {
                    FontFamily(.custom("Geist"))
                    FontWeight(.semibold)
                    FontSize(RubyUIFont.lgSize)
                    ForegroundColor(Color.rubyForeground)
                }
                .markdownMargin(top: 12, bottom: 6)
        }
        .heading3 { configuration in
            configuration.label
                .markdownTextStyle {
                    FontFamily(.custom("Geist"))
                    FontWeight(.semibold)
                    FontSize(RubyUIFont.baseSize)
                    ForegroundColor(Color.rubyForeground)
                }
                .markdownMargin(top: 10, bottom: 4)
        }
        .blockquote { configuration in
            HStack(spacing: 0) {
                Rectangle()
                    .fill(Color.rubyFaint.opacity(0.4))
                    .frame(width: 3)
                configuration.label
                    .markdownTextStyle {
                        ForegroundColor(Color.rubyFaint)
                        FontSize(RubyUIFont.smSize)
                    }
                    .padding(.leading, 10)
            }
        }
        .listItem { configuration in
            configuration.label
                .markdownMargin(top: 2, bottom: 2)
        }
}
