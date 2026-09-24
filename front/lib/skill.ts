import { RubyBrandIcon as RubyLogoSquare } from "@app/components/brand/RubyBrand";
import {
  getIcon,
  isCustomResourceIconType,
  isInternalAllowedIcon,
  ResourceAvatar,
  ResourceAvatarWithBadge,
} from "@app/components/resources/resources_icons";
import type {
  SkillListItemType,
  SkillRelations,
  SkillType,
  SkillWithoutInstructionsAndToolsType,
  SkillWithRelationsType,
} from "@app/types/assistant/skill_configuration";
import { cn, PuzzlePiece01 } from "@ruby-ai/ui";
import type { AvatarSizeType } from "@ruby-ai/ui/dist/esm/components/Avatar";
import React from "react";

export const SKILL_ICON = PuzzlePiece01;
export const RUBY_PROVIDED_SKILL_LABEL = "Ruby-provided skill";

export const SKILL_AVATAR_BACKGROUND_COLOR = "bg-highlight-50";
export const SKILL_AVATAR_ICON_COLOR = "text-highlight";

interface SkillAvatarIconProps {
  className?: string;
  size?: AvatarSizeType;
  name?: string;
}

type SkillAvatarIconInput =
  | string
  | null
  | Pick<
      SkillListItemType | SkillWithoutInstructionsAndToolsType,
      "editedBy" | "icon"
    >;

export function isRubyProvidedSkill(
  skill: Pick<
    SkillListItemType | SkillWithoutInstructionsAndToolsType,
    "editedBy"
  >
) {
  return skill.editedBy === null;
}

function isSkillAvatarIconSkill(
  input: SkillAvatarIconInput
): input is Pick<
  SkillListItemType | SkillWithoutInstructionsAndToolsType,
  "editedBy" | "icon"
> {
  return input !== null && typeof input === "object";
}

export function getSkillAvatarIcon(
  input: SkillAvatarIconInput
): React.ComponentType<SkillAvatarIconProps> {
  let iconString: string | null;
  let isRubyProvided = false;

  if (isSkillAvatarIconSkill(input)) {
    iconString = input.icon;
    isRubyProvided = isRubyProvidedSkill(input);
  } else {
    iconString = input;
  }

  let SkillAvatar: React.ComponentType<SkillAvatarIconProps>;
  let skillIcon: React.ComponentType<{ className?: string }> = SKILL_ICON;

  if (
    iconString &&
    (isCustomResourceIconType(iconString) || isInternalAllowedIcon(iconString))
  ) {
    const icon = getIcon(iconString);
    skillIcon = icon;
    SkillAvatar = (props) =>
      React.createElement(ResourceAvatar, {
        icon,
        size: "sm",
        backgroundColor: SKILL_AVATAR_BACKGROUND_COLOR,
        iconColor: SKILL_AVATAR_ICON_COLOR,
        ...props,
      });
  } else {
    SkillAvatar = (props) =>
      React.createElement(ResourceAvatar, {
        icon: SKILL_ICON,
        size: "sm",
        backgroundColor: SKILL_AVATAR_BACKGROUND_COLOR,
        iconColor: SKILL_AVATAR_ICON_COLOR,
        ...props,
      });
  }

  if (!isRubyProvided) {
    return SkillAvatar;
  }

  return ({ className, size, ...props }) => {
    const avatarSize = size ?? "sm";
    // Size is relative to avatar, not equal to avatar size.
    const relativeBadgeSize = size ?? "sm";

    return React.createElement(ResourceAvatarWithBadge, {
      badgeIcon: RubyLogoSquare,
      badgeSize: relativeBadgeSize,
      className: size ? className : undefined,
      icon: skillIcon,
      size: avatarSize,
      backgroundColor: SKILL_AVATAR_BACKGROUND_COLOR,
      iconColor: SKILL_AVATAR_ICON_COLOR,
      ...props,
    });
  };
}

export function getSkillIcon(
  iconString: string | null
): React.ComponentType<{ className?: string }> {
  const Icon =
    iconString &&
    (isCustomResourceIconType(iconString) || isInternalAllowedIcon(iconString))
      ? getIcon(iconString)
      : SKILL_ICON;

  return ({ className }) =>
    React.createElement(Icon, {
      className: cn(SKILL_AVATAR_ICON_COLOR, className),
    });
}

export function hasRelations(
  skill: SkillType & { relations?: SkillRelations }
): skill is SkillWithRelationsType {
  return skill.relations !== undefined;
}
