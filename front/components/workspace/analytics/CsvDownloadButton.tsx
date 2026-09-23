import type { ButtonProps } from "@ruby-ai/ui";
import { Button, Download01 } from "@ruby-ai/ui";

interface CsvDownloadButtonProps {
  isDownloading: boolean;
  disabled: boolean;
  handleDownload: () => void;
  label?: string;
  size?: ButtonProps["size"];
}

export function CsvDownloadButton({
  isDownloading,
  disabled,
  handleDownload,
  label,
  size,
}: CsvDownloadButtonProps) {
  return (
    <Button
      icon={label ? undefined : Download01}
      iconRight={label ? Download01 : undefined}
      label={label}
      variant="outline"
      size={size ?? (label ? "sm" : "xs")}
      tooltip={label ? undefined : "Download CSV"}
      onClick={handleDownload}
      disabled={disabled}
      isLoading={isDownloading}
    />
  );
}
