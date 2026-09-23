import RubyUITokens
import SwiftUI

struct CapabilitiesPickerSheet: View {
    let capabilities: [Capability]
    let selectedCapabilities: [Capability]
    let onSelect: (Capability) -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var searchText = ""

    var body: some View {
        NavigationStack {
            Group {
                if filteredCapabilities.isEmpty {
                    VStack {
                        Spacer()
                        Text(searchText.isEmpty ? "No capabilities available" : "No results")
                            .uiCopySm()
                            .foregroundStyle(Color.rubyFaint)
                        Spacer()
                    }
                } else {
                    List {
                        ForEach(filteredCapabilities) { capability in
                            Button {
                                onSelect(capability)
                                dismiss()
                            } label: {
                                capabilityRow(capability)
                            }
                        }
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Capabilities")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $searchText, placement: .navigationBarDrawer(displayMode: .always))
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    private func capabilityRow(_ capability: Capability) -> some View {
        HStack(spacing: 12) {
            capabilityIcon(capability)

            VStack(alignment: .leading, spacing: 2) {
                Text(capability.displayName)
                    .uiLabelSm()
                    .foregroundStyle(Color.rubyForeground)
                Text(capability.displayDescription)
                    .uiCopyXs()
                    .foregroundStyle(Color.rubyFaint)
                    .lineLimit(1)
            }

            Spacer()
        }
        .contentShape(Rectangle())
    }

    private var filteredCapabilities: [Capability] {
        let selectedIds = Set(selectedCapabilities.map(\.id))
        let unselected = capabilities.filter { !selectedIds.contains($0.id) }

        guard !searchText.isEmpty else { return unselected }
        let query = searchText.lowercased()
        return unselected.filter {
            $0.displayName.lowercased().contains(query) ||
                $0.displayDescription.lowercased().contains(query)
        }
    }

    private func capabilityIcon(_ capability: Capability) -> some View {
        capability.icon.image
            .resizable()
            .aspectRatio(contentMode: .fit)
            .frame(width: 16, height: 16)
            .foregroundStyle(capability.isSkill ? Color.highlight : Color.rubyForeground)
            .frame(width: 32, height: 32)
            .background(capability.isSkill ? Color.highlight.opacity(0.12) : Color.clear)
            .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}
