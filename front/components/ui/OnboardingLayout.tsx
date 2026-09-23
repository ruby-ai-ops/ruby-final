import { useAppHeadSetup } from "@app/hooks/useAppHeadSetup";
import { useDocumentTitle } from "@app/hooks/useDocumentTitle";
import type { LightWorkspaceType } from "@app/types/user";
import { Page } from "@ruby-ai/ui";
import type React from "react";

export default function OnboardingLayout({
  owner,
  children,
}: {
  owner: LightWorkspaceType;
  children: React.ReactNode;
}) {
  useDocumentTitle(`Ruby - ${owner.name || "Onboarding"}`);
  useAppHeadSetup();

  return <Page>{children}</Page>;
}
