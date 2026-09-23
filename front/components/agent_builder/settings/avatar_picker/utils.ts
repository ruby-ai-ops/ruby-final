import type { SelectedEmojiType } from "@app/components/agent_builder/settings/avatar_picker/types";
import { EMOJI_AVATAR_BASE_URL } from "@app/components/agent_builder/settings/avatar_picker/types";
import type { EmojiMartData as EmojiData } from "@ruby-ai/ui";
import { avatarUtils, DataEmojiMart } from "@ruby-ai/ui";

export function makeUrlForEmojiAndBackground(
  emoji: SelectedEmojiType,
  backgroundColor: `bg-${string}`
) {
  const { id, unified } = emoji;

  const avatarUrlSuffix = avatarUtils.createEmojiAndBackgroundUrlSuffix({
    backgroundColor,
    id,
    unified,
  });

  return `${EMOJI_AVATAR_BASE_URL}${avatarUrlSuffix}`;
}

export function buildSelectedEmojiType(
  emojiString: string
): SelectedEmojiType | null {
  const emojiData: EmojiData = DataEmojiMart as EmojiData;

  const emoji = Object.values(emojiData.emojis).find(
    (e) => e.skins[0].native === emojiString
  );

  if (emoji) {
    return {
      id: emoji.id,
      native: emoji.skins[0].native,
      unified: emoji.skins[0].unified,
    };
  }

  return null;
}
