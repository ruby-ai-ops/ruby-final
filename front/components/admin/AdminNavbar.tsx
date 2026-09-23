import { AdminCellDropdown } from "@app/components/admin/AdminCellDropdown";
import {
  AdminFavoriteButton,
  AdminFavoritesCommandGroups,
} from "@app/components/admin/AdminFavorites";
import { AdminThemeSelector } from "@app/components/admin/AdminThemeSelector";
import {
  AdminCommandDialog,
  AdminCommandInput,
  AdminCommandItem,
  AdminCommandList,
} from "@app/components/admin/shadcn/ui/command";
import { useCellContext } from "@app/lib/auth/CellContext";
import { getCellChipColor, getCellDisplay } from "@app/lib/admin/cells";
import { classNames } from "@app/lib/utils";
import { useAdminSearchAllCells } from "@app/admin-app/swr/search";
import type { CellInfo } from "@app/types/cell";
import type { AdminItemBase } from "@app/types/admin";
import { isDevelopment } from "@app/types/shared/env";
import {
  Button,
  ChevronRight,
  Chip,
  LinkWrapper,
  Logo,
} from "@ruby-ai/ui";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useState } from "react";

const MIN_SEARCH_CHARACTERS = 2;

interface AdminNavbarProps {
  cells?: CellInfo[];
  showCellPicker?: boolean;
}

function getAdminItemChipColor(
  item: AdminItemBase
): ComponentProps<typeof Chip>["color"] {
  switch (item.type) {
    case "Workspace":
      return "highlight";
    case "Data Source":
      return "info";
    case "Data Source View":
      return "warning";
    case "Connector":
      return "success";
    case "Frame":
    case "File":
      return "highlight";
    case "Space":
    case "Group":
      return "info";
    case "Skill":
    case "Webhook Source":
      return "warning";
    default:
      return "primary";
  }
}

function AdminNavbar({ showCellPicker = false }: AdminNavbarProps) {
  const { cells } = useCellContext();
  return (
    <nav
      className={classNames(
        "flex items-center justify-between px-4 py-6 pr-8",
        isDevelopment() ? "bg-brand" : "bg-red-500"
      )}
    >
      <div className="flex items-center">
        <LinkWrapper href="/admin">
          <Logo type="colored-grey" className="-mr-5 h-4 w-32 p-0" />
        </LinkWrapper>
        <div className="flex flex-row gap-4">
          <Button href="/admin/plans" variant="ghost" label="Plans" />
          <Button href="/admin/coupons" variant="ghost" label="Coupons" />
          <Button href="/admin/templates" variant="ghost" label="Templates" />
          <Button href="/admin/plugins" variant="ghost" label="Plugins" />
          <Button
            href="/admin/feature-flags"
            variant="ghost"
            label="Feature Flags"
          />
          <Button href="/admin/kill" variant="ghost" label="Kill Switches" />
          <Button href="/admin/cache" variant="ghost" label="Cache" />
          <Button href="/admin/adminify" variant="ghost" label="Adminify URL" />
          <Button
            href="/admin/production-checks"
            variant="ghost"
            label="Production Checks"
          />
          <Button
            href="/admin/global-agent-feedbacks"
            variant="ghost"
            label="Agent Feedback"
          />
        </div>
      </div>
      <div className="items-right flex items-center gap-4">
        <AdminThemeSelector />
        <AdminFavoriteButton />
        {showCellPicker && <AdminCellDropdown cells={cells} />}
        <AdminSearchCommand />
      </div>
    </nav>
  );
}

export default AdminNavbar;

function AdminSearchCommand() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { cells, cellInfo, setCellInfo } = useCellContext();

  const { isError, isLoading, results } = useAdminSearchAllCells({
    disabled: searchTerm.length < MIN_SEARCH_CHARACTERS,
    search: searchTerm,
    cells,
  });

  const handleItemClick = useCallback(
    (item: AdminItemBase) => {
      const targetCell = cells?.find((cell) => cell.name === item.cell);
      if (targetCell && targetCell.name !== cellInfo.name) {
        setCellInfo(targetCell);
      }
      setOpen(false);
    },
    [cellInfo, setCellInfo, cells]
  );

  return (
    <AdminSearchCommandUI
      open={open}
      onOpenChange={setOpen}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      results={results}
      isLoading={isLoading}
      isError={isError}
      onItemClick={handleItemClick}
      showCell
    />
  );
}

interface AdminSearchCommandUIProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  results: AdminItemBase[];
  isLoading: boolean;
  isError: boolean;
  onItemClick: (item: AdminItemBase) => void;
  showCell: boolean;
}

/**
 * Shared UI component for the search command dialog.
 */
function AdminSearchCommandUI({
  open,
  onOpenChange,
  searchTerm,
  onSearchTermChange,
  results,
  isLoading,
  isError,
  onItemClick,
  showCell,
}: AdminSearchCommandUIProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        label="Search (⌘K)"
        onClick={() => onOpenChange(true)}
      />
      <AdminCommandDialog
        open={open}
        onOpenChange={onOpenChange}
        className="bg-muted-background sm:max-w-[600px]"
        shouldFilter={false}
      >
        <AdminCommandInput
          placeholder="Type a command or search..."
          onValueChange={(value) => onSearchTermChange(value.trim())}
          className="border-none focus:outline-hidden focus:ring-0"
        />
        <AdminCommandList>
          {isLoading && <div className="p-4 text-sm">Searching...</div>}
          {searchTerm &&
            searchTerm.length >= MIN_SEARCH_CHARACTERS &&
            !isError &&
            !isLoading &&
            results.length === 0 && (
              <div className="p-4 text-sm">No results found.</div>
            )}
          {isError && <div className="p-4 text-sm">Something went wrong.</div>}
          {searchTerm.length < MIN_SEARCH_CHARACTERS && (
            <AdminFavoritesCommandGroups
              onNavigate={() => onOpenChange(false)}
            />
          )}
          {searchTerm.length < MIN_SEARCH_CHARACTERS && (
            <div className="p-4 text-sm">
              <div className="mb-3 text-muted-foreground">
                Search for resources by:
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Workspace ID:</span>{" "}
                  <span className="font-mono">123456</span>
                </div>
                <div>
                  <span className="font-medium">WorkOS org ID:</span>{" "}
                  <span className="font-mono">org_01AB</span>
                </div>
                <div>
                  <span className="font-medium">Resource sId:</span>{" "}
                  <span className="font-mono">
                    vlt_ / grp_ / skl_ / msv_ / whs_ / fil_ / dsv_ / dts_
                  </span>
                </div>
                <div>
                  <span className="font-medium">Ruby API project ID:</span>{" "}
                  <span className="font-mono">123456</span>
                </div>
                <div>
                  <span className="font-medium">Connector ID:</span>{" "}
                  <span className="font-mono">78901</span>
                </div>
                <div>
                  <span className="font-medium">Frame token:</span>{" "}
                  <span className="font-mono">
                    a1b2c3d4-e5f6-7890-abcd-ef1234567890
                  </span>
                </div>
                <div>
                  <span className="font-medium">Phone number:</span>{" "}
                  <span className="font-mono">+33612345678</span>
                </div>
              </div>
            </div>
          )}

          {results.map((item, index) => {
            const CommandItemContent = () => (
              <AdminCommandItem value={item.name} index={index}>
                <div className="flex w-full items-center justify-between gap-3 px-2 text-foreground">
                  <div className="flex min-w-0 items-baseline gap-3">
                    <Chip size="xs" color={getAdminItemChipColor(item)}>
                      {item.type}
                    </Chip>
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      (id: {item.id})
                    </span>
                    {showCell && item.region && item.cell && (
                      <Chip size="xs" color={getCellChipColor(item.region)}>
                        {getCellDisplay({
                          name: item.cell,
                          region: item.region,
                        })}
                      </Chip>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                </div>
              </AdminCommandItem>
            );

            const key = `${item.cell ?? item.region ?? "default"}-${item.id}`;

            return item.link ? (
              <div key={key} onClick={() => onItemClick(item)}>
                <LinkWrapper href={item.link}>
                  <CommandItemContent />
                </LinkWrapper>
              </div>
            ) : (
              <CommandItemContent key={key} />
            );
          })}
        </AdminCommandList>
      </AdminCommandDialog>
    </>
  );
}
