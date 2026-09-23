import { Hoverable, Page } from "@ruby-ai/ui";

interface LinkedSectionNoticeProps {
  description: string;
  linkLabel: string;
  onLinkClick: () => void;
}

export function LinkedSectionNotice({
  description,
  linkLabel,
  onLinkClick,
}: LinkedSectionNoticeProps) {
  return (
    <div className="w-full rounded-xl bg-muted-background px-4 py-3">
      <Page.P variant="secondary" size="sm">
        {description}{" "}
        <Hoverable variant="primary" onClick={onLinkClick}>
          {linkLabel}
        </Hoverable>
      </Page.P>
    </div>
  );
}
