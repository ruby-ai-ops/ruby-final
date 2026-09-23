import { useConversation } from "@app/hooks/conversations/useConversation";
import { parsePodConfigurationURI } from "@app/lib/actions/mcp_internal_actions/pod_configuration_uri";
import { useSpaceInfo } from "@app/lib/swr/spaces";
import type { LightWorkspaceType } from "@app/types/user";

import { useMemo } from "react";

export function usePodLabel({
  owner,
  rubyPodUri,
  conversationId,
}: {
  owner: LightWorkspaceType;
  rubyPodUri: string | undefined;
  conversationId: string | null | undefined;
}) {
  const { conversation, isConversationLoading } = useConversation({
    workspaceId: owner.sId,
    conversationId: conversationId ?? null,
    options: { disabled: !conversationId },
  });

  const podSpaceId = useMemo(() => {
    if (rubyPodUri) {
      const parsed = parsePodConfigurationURI(rubyPodUri);
      if (parsed.isOk()) {
        return parsed.value.podId;
      }
      return null;
    }
    return conversation?.spaceId ?? null;
  }, [conversation?.spaceId, rubyPodUri]);

  const isWaitingForConversationSpaceId =
    !rubyPodUri && !!conversationId && isConversationLoading;

  const { spaceInfo, isSpaceInfoLoading } = useSpaceInfo({
    workspaceId: owner.sId,
    spaceId: podSpaceId,
    disabled: !podSpaceId,
  });

  const isPodLabelLoading =
    isWaitingForConversationSpaceId ||
    (podSpaceId !== null && isSpaceInfoLoading && !spaceInfo);

  const podLabel = spaceInfo?.name ?? (isPodLabelLoading ? null : "this Pod");

  return { podLabel, isPodLabelLoading };
}
