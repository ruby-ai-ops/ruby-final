import RubyUITokens
import SwiftUI

@main
struct RubyMobileApp: App {
    @StateObject private var authViewModel = AuthViewModel()

    init() {
        RubyUIFonts.registerFonts()
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .background(Color.rubyBackground.ignoresSafeArea())
                .environmentObject(authViewModel)
                .onOpenURL { url in
                    authViewModel.handleCallbackURL(url)
                }
        }
    }
}
