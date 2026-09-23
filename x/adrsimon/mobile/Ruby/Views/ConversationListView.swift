import RubyUITokens
import SwiftUI

struct ConversationListView: View {
    @Binding var searchText: String
    let groupedConversations: [(String, [Conversation])]
    let pods: [Space]
    @Binding var isPodsExpanded: Bool
    let user: User
    let currentWorkspace: Workspace?
    let workspaces: [Workspace]
    let isLoading: Bool
    let onNewConversation: () -> Void
    let onSelectConversation: (Conversation) -> Void
    let onSelectPod: (Space) -> Void
    let onSwitchWorkspace: (Workspace) -> Void
    let onToggleReadStatus: (Conversation) -> Void
    let onDelete: (Conversation) -> Void
    let onLogout: () -> Void
    var onCatchUp: (() -> Void)?
    var onRefresh: (() async -> Void)?

    @State private var conversationToDelete: Conversation?

    var body: some View {
        VStack(spacing: 0) {
            profileSection
            conversationListSection
        }
        .background(Color.rubyBackground)
        .safeAreaInset(edge: .bottom) {
            ConversationListBottomBar(
                searchText: $searchText,
                onNewConversation: onNewConversation
            )
        }
    }

    // MARK: - Top: Profile + Catch Up

    private var profileSection: some View {
        VStack(spacing: 8) {
            HStack(spacing: 10) {
                Avatar(url: user.profilePictureUrl, size: 32)

                Text(user.displayName)
                    .uiCopySm()
                    .foregroundStyle(Color.rubyForeground)
                    .lineLimit(1)

                Spacer()

                workspaceMenu
            }

            if let onCatchUp {
                Button(action: onCatchUp) {
                    HStack(spacing: 6) {
                        RubyUIIcon.inbox.image
                            .resizable()
                            .frame(width: 14, height: 14)
                        Text("Catch Up")
                            .uiLabelSm()
                    }
                    .foregroundStyle(Color.rubyForeground)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(Color.rubyMutedBackground)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    private var workspaceMenu: some View {
        Menu {
            if workspaces.count > 1 {
                ForEach(workspaces) { workspace in
                    Button {
                        onSwitchWorkspace(workspace)
                    } label: {
                        Label {
                            Text(workspace.name)
                        } icon: {
                            (workspace.sId == currentWorkspace?.sId
                                ? RubyUIIcon.checkCircle : RubyUIIcon.circle).image
                        }
                    }
                }

                Divider()
            }

            Button(role: .destructive, action: onLogout) {
                Label("Logout", systemImage: "rectangle.portrait.and.arrow.right")
            }
        } label: {
            HStack(spacing: 4) {
                Text(currentWorkspace?.name ?? "Workspace")
                    .uiLabelSm()
                    .lineLimit(1)
                RubyUIIcon.chevronDown.image
                    .resizable()
                    .frame(width: 10, height: 10)
            }
            .foregroundStyle(Color.rubyForeground)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
        }
        .liquidGlassCapsule()
    }

    // MARK: - Pods

    private var podsSection: some View {
        Section {
            if isPodsExpanded {
                ForEach(pods) { pod in
                    Button {
                        onSelectPod(pod)
                    } label: {
                        HStack(spacing: 8) {
                            (pod.isRestricted ? RubyUIIcon.spaceClosed : RubyUIIcon.spaceOpen).image
                                .resizable()
                                .frame(width: 14, height: 14)
                                .foregroundStyle(Color.rubyFaint)
                            Text(pod.name)
                                .uiCopySm()
                                .foregroundStyle(Color.rubyForeground)
                                .lineLimit(1)
                                .truncationMode(.tail)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                    }
                }
            }
        } header: {
            Button {
                withAnimation(.easeInOut(duration: 0.2)) {
                    isPodsExpanded.toggle()
                }
            } label: {
                HStack(spacing: 4) {
                    Text("Pods")
                        .uiLabelXs()
                        .textCase(.uppercase)

                    RubyUIIcon.chevronDown.image
                        .resizable()
                        .frame(width: 8, height: 8)
                        .rotationEffect(.degrees(isPodsExpanded ? 0 : -90))

                    Spacer()
                }
                .foregroundStyle(Color.rubyFaint)
                .padding(.horizontal, 12)
                .padding(.top, 16)
                .padding(.bottom, 4)
            }
        }
    }

    // MARK: - Middle: Conversation List

    private var conversationListSection: some View {
        Group {
            if isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .padding(.top, 32)
            } else if groupedConversations.isEmpty {
                if searchText.isEmpty {
                    ContentUnavailableView(
                        "No conversations yet",
                        systemImage: "bubble.left.and.bubble.right"
                    )
                } else {
                    ContentUnavailableView.search(text: searchText)
                }
            } else {
                conversationList
                    .refreshable {
                        await onRefresh?()
                    }
            }
        }
        .confirmationDialog(
            "Delete conversation?",
            isPresented: Binding(
                get: { conversationToDelete != nil },
                set: { if !$0 { conversationToDelete = nil } }
            ),
            titleVisibility: .visible
        ) {
            Button("Delete", role: .destructive) {
                if let conversation = conversationToDelete {
                    onDelete(conversation)
                    conversationToDelete = nil
                }
            }
        } message: {
            Text("This action cannot be undone.")
        }
    }

    private var conversationList: some View {
        List {
            if !pods.isEmpty {
                podsSection
                    .listRowInsets(EdgeInsets())
                    .listRowBackground(Color.clear)
                    .listRowSeparator(.hidden)
            }

            ForEach(groupedConversations, id: \.0) { group, conversations in
                Section {
                    ForEach(conversations) { conversation in
                        Button {
                            onSelectConversation(conversation)
                        } label: {
                            ConversationRowView(conversation: conversation)
                        }
                        .swipeActions(edge: .leading, allowsFullSwipe: true) {
                            Button {
                                onToggleReadStatus(conversation)
                            } label: {
                                if conversation.unread || conversation.actionRequired {
                                    RubyUIIcon.eye.image
                                } else {
                                    RubyUIIcon.inbox.image
                                }
                            }
                            .tint(.blue)
                            .accessibilityLabel(
                                conversation.unread || conversation.actionRequired ? "Mark as read" : "Mark as unread"
                            )
                        }
                        .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                            Button(role: .destructive) {
                                conversationToDelete = conversation
                            } label: {
                                RubyUIIcon.trash.image
                            }
                            .accessibilityLabel("Delete")
                        }
                        .listRowInsets(EdgeInsets())
                        .listRowBackground(Color.rubyBackground)
                        .listRowSeparator(.hidden)
                    }
                } header: {
                    Text(group)
                        .uiLabelXs()
                        .textCase(.uppercase)
                        .foregroundStyle(Color.rubyFaint)
                        .padding(.horizontal, 12)
                        .padding(.top, 16)
                        .padding(.bottom, 4)
                }
                .listSectionSeparator(.hidden)
            }
        }
        .listStyle(.plain)
        .scrollContentBackground(.hidden)
        .listSectionSpacing(0)
        .environment(\.defaultMinListRowHeight, 0)
    }
}
