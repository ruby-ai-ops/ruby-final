import RubyUITokens
import SwiftUI

struct FrameVisualizerView: View {
    let frameToken: String

    @Environment(\.dismiss) private var dismiss
    @State private var isLoading = true
    @State private var pageTitle = ""

    private var frameURL: URL {
        URL(string: "\(AppConfig.appURL)/share/frame/\(frameToken)")!
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Color.rubyBackground.ignoresSafeArea()

                FrameWebView(url: frameURL, isLoading: $isLoading, pageTitle: $pageTitle)

                if isLoading {
                    ProgressView()
                }
            }
            .ignoresSafeArea(edges: .bottom)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        dismiss()
                    } label: {
                        RubyUIIcon.xMark.image
                            .resizable()
                            .frame(width: 20, height: 20)
                            .foregroundStyle(Color.rubyForeground)
                    }
                }

                ToolbarItem(placement: .principal) {
                    Text(pageTitle.isEmpty ? "Frame" : pageTitle)
                        .uiCopyBase()
                        .foregroundStyle(Color.rubyForeground)
                        .lineLimit(1)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    ShareLink(item: frameURL) {
                        RubyUIIcon.arrowUpOnSquare.image
                            .resizable()
                            .frame(width: 20, height: 20)
                            .foregroundStyle(Color.rubyForeground)
                    }
                }
            }
        }
    }
}
