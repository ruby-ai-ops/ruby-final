import type { RubyMcpServerSettings } from "@app/lib/api/mcp_server/ruby_mcp_server_settings";
import {
  normalizeRubyMcpServerRedirectUri,
  validateRubyMcpServerRedirectUri,
} from "@app/lib/api/mcp_server/ruby_mcp_server_settings";
import { useAuth } from "@app/lib/auth/AuthContext";
import {
  Button,
  ContentMessage,
  Input,
  Page,
  Plus,
  RadioGroup,
  RadioGroupItem,
  Sheet,
  SheetContainer,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Trash01,
} from "@ruby-ai/ui";
import { useEffect, useMemo, useState } from "react";

interface RubyMcpServerSettingsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  settings: RubyMcpServerSettings;
  isSaving: boolean;
  onSave: (settings: RubyMcpServerSettings) => Promise<boolean>;
}

export function RubyMcpServerSettingsSheet({
  isOpen,
  onOpenChange,
  settings,
  isSaving,
  onSave,
}: RubyMcpServerSettingsSheetProps) {
  const { isAdmin } = useAuth();
  const [draftSettings, setDraftSettings] = useState(settings);
  const [redirectUriInput, setRedirectUriInput] = useState("");
  const [wasOpen, setWasOpen] = useState(isOpen);

  useEffect(() => {
    if (isOpen && !wasOpen) {
      setDraftSettings(settings);
      setRedirectUriInput("");
    }
    setWasOpen(isOpen);
  }, [isOpen, wasOpen, settings]);

  const redirectUriValidation = useMemo(() => {
    if (!redirectUriInput.trim()) {
      return null;
    }
    return validateRubyMcpServerRedirectUri(redirectUriInput);
  }, [redirectUriInput]);

  const normalizedRedirectUri =
    redirectUriValidation?.isOk() === true ? redirectUriValidation.value : null;
  const isDuplicateRedirectUri =
    normalizedRedirectUri !== null &&
    draftSettings.allowedRedirectUris.includes(normalizedRedirectUri);
  const redirectUriInputMessage =
    redirectUriValidation?.isErr() === true
      ? redirectUriValidation.error.message
      : isDuplicateRedirectUri
        ? "This redirect URI is already in the list."
        : normalizedRedirectUri
          ? `Will be saved as ${normalizedRedirectUri}.`
          : "Use a full redirect URI such as https://example.com/oauth/callback.";
  const isRedirectUriInputInvalid =
    redirectUriValidation?.isErr() === true || isDuplicateRedirectUri;
  const canAddRedirectUri =
    normalizedRedirectUri !== null &&
    !isDuplicateRedirectUri &&
    !isSaving &&
    isAdmin;

  const isDirty =
    draftSettings.acceptAllRedirectUris !== settings.acceptAllRedirectUris ||
    draftSettings.allowedRedirectUris.join("\n") !==
      settings.allowedRedirectUris.join("\n");

  const handleAddRedirectUri = () => {
    if (!canAddRedirectUri || normalizedRedirectUri === null) {
      return;
    }

    setDraftSettings((current) => ({
      ...current,
      allowedRedirectUris: [
        ...current.allowedRedirectUris,
        normalizedRedirectUri,
      ],
    }));
    setRedirectUriInput("");
  };

  const handleRemoveRedirectUri = (uri: string) => {
    setDraftSettings((current) => ({
      ...current,
      allowedRedirectUris: current.allowedRedirectUris.filter(
        (existingUri) => existingUri !== uri
      ),
    }));
  };

  const handleSave = async () => {
    if (!isAdmin) {
      return;
    }

    if (
      !draftSettings.acceptAllRedirectUris &&
      draftSettings.allowedRedirectUris.length === 0
    ) {
      return;
    }

    const success = await onSave({
      ...settings,
      acceptAllRedirectUris: draftSettings.acceptAllRedirectUris,
      allowedRedirectUris: draftSettings.allowedRedirectUris,
    });
    if (success) {
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }
    onOpenChange(false);
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <SheetContent size="lg">
        <SheetHeader>
          <SheetTitle>Redirect URIs</SheetTitle>
        </SheetHeader>
        <SheetContainer>
          <Page.Vertical align="stretch" gap="lg">
            {!isAdmin && (
              <ContentMessage variant="info" size="lg">
                Only workspace admins can manage MCP server settings.
              </ContentMessage>
            )}

            <RadioGroup
              value={draftSettings.acceptAllRedirectUris ? "all" : "allowlist"}
              onValueChange={(value) => {
                setDraftSettings((current) => ({
                  ...current,
                  acceptAllRedirectUris: value === "all",
                }));
              }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <RadioGroupItem
                  value="all"
                  id="ruby-mcp-redirect-uri-policy-all"
                  label="Accept all redirect URIs"
                  disabled={!isAdmin || isSaving}
                />
                <Page.P variant="secondary">
                  Any redirect URI requested during OAuth will be allowed.
                </Page.P>
              </div>
              <div className="flex flex-col gap-1">
                <RadioGroupItem
                  value="allowlist"
                  id="ruby-mcp-redirect-uri-policy-allowlist"
                  label="Allowlisted redirect URIs only"
                  disabled={!isAdmin || isSaving}
                />
                <Page.P variant="secondary">
                  Only the redirect URIs listed below will be accepted.
                </Page.P>
              </div>
            </RadioGroup>

            {!draftSettings.acceptAllRedirectUris && (
              <Page.Vertical align="stretch" gap="md">
                <form
                  className="flex flex-col gap-3 sm:flex-row sm:items-start"
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleAddRedirectUri();
                  }}
                >
                  <div className="grow">
                    <Input
                      label="Redirect URI"
                      name="redirectUri"
                      placeholder="https://example.com/oauth/callback"
                      value={redirectUriInput}
                      message={redirectUriInputMessage}
                      messageStatus={
                        isRedirectUriInputInvalid ? "error" : "info"
                      }
                      onChange={(event) =>
                        setRedirectUriInput(
                          normalizeRubyMcpServerRedirectUri(event.target.value)
                        )
                      }
                      disabled={!isAdmin || isSaving}
                    />
                  </div>
                  <Button
                    type="submit"
                    label="Add URI"
                    icon={Plus}
                    disabled={!canAddRedirectUri}
                    isLoading={isSaving}
                    className="mt-0 sm:mt-7"
                  />
                </form>

                {draftSettings.allowedRedirectUris.length === 0 ? (
                  <ContentMessage variant="outline" size="lg">
                    Add at least one redirect URI before saving.
                  </ContentMessage>
                ) : (
                  <div className="flex w-full flex-col divide-y divide-separator">
                    {draftSettings.allowedRedirectUris.map((uri) => (
                      <div key={uri} className="flex items-center gap-3 py-3">
                        <pre
                          title={uri}
                          className="min-w-0 grow overflow-x-auto whitespace-nowrap rounded bg-muted-background p-2 text-sm text-foreground"
                        >
                          {uri}
                        </pre>
                        <Button
                          variant="warning"
                          size="mini"
                          icon={Trash01}
                          tooltip={`Remove ${uri}`}
                          disabled={!isAdmin || isSaving}
                          onClick={() => handleRemoveRedirectUri(uri)}
                          className="shrink-0"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Page.Vertical>
            )}
          </Page.Vertical>
        </SheetContainer>
        <SheetFooter
          leftButtonProps={{
            label: "Cancel",
            variant: "outline",
            onClick: handleClose,
            disabled: isSaving,
          }}
          rightButtonProps={{
            label: isSaving ? "Saving..." : "Save",
            onClick: () => {
              void handleSave();
            },
            disabled:
              !isAdmin ||
              isSaving ||
              !isDirty ||
              (!draftSettings.acceptAllRedirectUris &&
                draftSettings.allowedRedirectUris.length === 0),
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
