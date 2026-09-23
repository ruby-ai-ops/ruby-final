import RubyUITokens
import SwiftUI

struct RemovableChipView: View {
    let icon: RubyUIIcon
    let iconColor: Color
    let text: String
    let onRemove: () -> Void

    var body: some View {
        HStack(spacing: 6) {
            icon.image
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 10, height: 10)
                .foregroundStyle(iconColor)

            Text(text)
                .uiCopyXs()
                .foregroundStyle(Color.rubyForeground)
                .lineLimit(1)

            Button {
                onRemove()
            } label: {
                RubyUIIcon.xMark.image
                    .resizable()
                    .frame(width: 8, height: 8)
                    .foregroundStyle(Color.rubyFaint)
            }
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(Color.rubyFaint.opacity(0.12))
        .clipShape(Capsule())
    }
}
