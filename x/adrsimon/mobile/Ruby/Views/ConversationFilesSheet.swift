import RubyUITokens
import SwiftUI

struct ConversationFilesSheet: View {
    let workspaceId: String
    let conversationId: String
    let tokenProvider: TokenProvider

    @Environment(\.dismiss) private var dismiss
    @State private var attachments: [ConversationAttachment] = []
    @State private var isLoading = true
    @State private var errorMessage: String?
    @State private var selectedAttachment: ConversationAttachment?

    var body: some View {
        NavigationStack {
            ZStack {
                Color.rubyBackground.ignoresSafeArea()

                if isLoading {
                    ProgressView()
                } else if let errorMessage {
                    VStack(spacing: 12) {
                        Text(errorMessage)
                            .uiCopySm()
                            .foregroundStyle(Color.rubyFaint)
                        Button("Retry") {
                            Task { await loadAttachments() }
                        }
                    }
                } else if attachments.isEmpty {
                    Text("No files in this conversation")
                        .uiCopySm()
                        .foregroundStyle(Color.rubyFaint)
                } else {
                    filesList
                }
            }
            .navigationTitle("Conversation Files")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { dismiss() } label: {
                        RubyUIIcon.xMark.image
                            .resizable()
                            .frame(width: 16, height: 16)
                            .foregroundStyle(Color.rubyForeground)
                    }
                }
            }
        }
        .task {
            await loadAttachments()
        }
        .fullScreenCover(item: $selectedAttachment) { attachment in
            if let fileId = attachment.fileId {
                AttachmentViewerView(
                    title: attachment.title,
                    contentType: attachment.contentType,
                    fileId: fileId,
                    workspaceId: workspaceId,
                    tokenProvider: tokenProvider,
                    sourceUrl: attachment.sourceUrl
                )
            }
        }
    }

    // MARK: - Files List

    private var filesList: some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 0) {
                ForEach(groupedCategories, id: \.0) { category, items in
                    Section {
                        ForEach(items) { attachment in
                            fileRow(attachment)
                        }
                    } header: {
                        Text(category.rawValue)
                            .uiLabelXs()
                            .foregroundStyle(Color.rubyFaint)
                            .padding(.horizontal, 16)
                            .padding(.top, 16)
                            .padding(.bottom, 4)
                    }
                }
            }
            .padding(.bottom, 16)
        }
    }

    private func fileRow(_ attachment: ConversationAttachment) -> some View {
        Button {
            guard attachment.fileId != nil else { return }
            selectedAttachment = attachment
        } label: {
            HStack(spacing: 12) {
                Image(systemName: Attachment.sfSymbol(for: attachment.contentType))
                    .font(.system(size: 18))
                    .foregroundStyle(attachment.isFrame ? Color.highlight : Color.rubyFaint)
                    .frame(width: 28, height: 28)

                VStack(alignment: .leading, spacing: 2) {
                    Text(attachment.title)
                        .uiCopySm()
                        .foregroundStyle(Color.rubyForeground)
                        .lineLimit(1)

                    if let source = attachment.source {
                        Text("by \(source)")
                            .uiCopyXs()
                            .foregroundStyle(Color.rubyFaint)
                    }
                }

                Spacer()

                if attachment.isFrame {
                    RubyUIIcon.chevronRight.image
                        .resizable()
                        .frame(width: 12, height: 12)
                        .foregroundStyle(Color.rubyFaint)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
        }
        .buttonStyle(.plain)
    }

    // MARK: - Grouping

    private var groupedCategories: [(AttachmentCategory, [ConversationAttachment])] {
        let grouped = Dictionary(grouping: attachments, by: \.category)
        return AttachmentCategory.allCases
            .compactMap { category in
                guard let items = grouped[category], !items.isEmpty else { return nil }
                return (category, items)
            }
    }

    // MARK: - Loading

    private func loadAttachments() async {
        isLoading = true
        errorMessage = nil
        do {
            attachments = try await FileContentService.fetchConversationAttachments(
                workspaceId: workspaceId,
                conversationId: conversationId,
                tokenProvider: tokenProvider
            )
            isLoading = false
        } catch {
            errorMessage = error.localizedDescription
            isLoading = false
        }
    }
}
