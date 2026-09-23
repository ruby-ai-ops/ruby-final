import RubyUITokens
import SwiftUI

struct ConversationRowView: View {
    let conversation: Conversation

    var body: some View {
        if let preview = conversation.preview {
            previewRow(preview)
        } else {
            titleRow
        }
    }

    @ViewBuilder
    private var statusDot: some View {
        if conversation.actionRequired {
            Circle()
                .fill(Color.golden400)
                .frame(width: 8, height: 8)
        } else if conversation.unread {
            Circle()
                .fill(Color.highlight500)
                .frame(width: 8, height: 8)
        }
    }

    private var titleRow: some View {
        HStack(spacing: 6) {
            statusDot

            Text(conversation.title ?? "New conversation")
                .uiCopySm()
                .foregroundStyle(Color.rubyForeground)
                .lineLimit(1)
                .truncationMode(.tail)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    private func previewRow(_ preview: ConversationPreview) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Avatar(url: preview.authorAvatarUrl, size: 32)

            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    statusDot

                    Text(conversation.title ?? "New conversation")
                        .uiCopySm()
                        .foregroundStyle(Color.rubyForeground)
                        .lineLimit(1)
                        .truncationMode(.tail)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }

                if let snippet = preview.snippet, !snippet.isEmpty {
                    Text(snippet)
                        .uiCopySm()
                        .foregroundStyle(Color.rubyFaint)
                        .lineLimit(1)
                        .truncationMode(.tail)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }

                if preview.replyCount > 0 {
                    Text("\(preview.replyCount) \(preview.replyCount == 1 ? "reply" : "replies")")
                        .uiLabelXs()
                        .foregroundStyle(Color.rubyFaint)
                }
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }
}
