import RubyUITokens
import SwiftUI

struct LoginView: View {
    let onLogin: () -> Void

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            VStack(spacing: 12) {
                RubyLogo.rubyLogo.image
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(height: 36)

                Text("The Operating System for AI Agents")
                    .uiCopy2xl()
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Color.rubyForeground)
            }
            .padding(.horizontal, 40)

            VStack(spacing: 12) {
                Button(action: onLogin) {
                    Text("Log In")
                        .uiLabelBase()
                        .foregroundStyle(Color.rubyBackground)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                }
                .background(Color.rubyForeground)
                .clipShape(RoundedRectangle(cornerRadius: 48))

                Link(destination: URL(string: AppConfig.apiBaseURL)!) {
                    Text("Sign Up")
                        .uiLabelBase()
                        .foregroundStyle(Color.rubyForeground)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                }
                .background(Color.rubyBackground)
                .clipShape(RoundedRectangle(cornerRadius: 48))
                .overlay(
                    RoundedRectangle(cornerRadius: 48)
                        .stroke(Color.rubyForeground.opacity(0.2), lineWidth: 1)
                )
            }
            .padding(.horizontal, 40)
            .padding(.bottom, 48)

            Spacer()
        }
        .background(Color.rubyBackground)
    }
}
