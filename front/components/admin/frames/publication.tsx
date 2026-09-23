import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableRow,
} from "@app/components/admin/shadcn/ui/table";
import type { AdminFrameDetails } from "@app/lib/api/admin/frames";
import { CodeBlock, File02, Folder, Tree } from "@ruby-ai/ui";

interface FramePublicationSectionProps {
  publication: AdminFrameDetails["publication"];
  publicationError: string | null;
}

export function FramePublicationSection({
  publication,
  publicationError,
}: FramePublicationSectionProps) {
  return (
    <div className="my-4 flex flex-col rounded-lg border p-4">
      <h2 className="text-md pb-4 font-bold">Active publication</h2>
      {publicationError ? (
        <div className="text-sm text-warning">
          Could not load the publication descriptor: {publicationError}
        </div>
      ) : !publication ? (
        <div className="text-sm text-muted-foreground">
          This Frame has never been published.
        </div>
      ) : (
        <>
          <AdminTable>
            <AdminTableBody>
              <AdminTableRow>
                <AdminTableHead>Publication ID</AdminTableHead>
                <AdminTableCell>{publication.publicationId}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Published at</AdminTableHead>
                <AdminTableCell>{publication.publishedAt}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>Publisher</AdminTableHead>
                <AdminTableCell>{publication.publisher ?? "—"}</AdminTableCell>
              </AdminTableRow>
              <AdminTableRow>
                <AdminTableHead>UI bundle sha256</AdminTableHead>
                <AdminTableCell className="font-mono text-xs">
                  {publication.uiBundleSha256}
                </AdminTableCell>
              </AdminTableRow>
            </AdminTableBody>
          </AdminTable>

          <h3 className="pt-6 pb-2 font-medium">
            Source files ({publication.sourceFiles.length})
          </h3>
          <Tree isBoxed>
            {renderSourceFileTree(
              publication.sourceFiles.map((sourceFile) => sourceFile.path)
            )}
          </Tree>

          {publication.databases.length > 0 && (
            <>
              <h3 className="pt-6 pb-2 font-medium">
                Declared databases ({publication.databases.length})
              </h3>
              {publication.databases.map((database) => (
                <div key={database.name} className="pb-4">
                  <div className="pb-1 text-sm font-medium">
                    {database.name}
                  </div>
                  {/*
                    CodeBlock's `className` is only used to derive the syntax-highlighting
                    language (via a `language-(\w+)` regex match); the wrapper div and the
                    SyntaxHighlighter it renders both use hardcoded classNames, so a height
                    clamp passed to CodeBlock itself is silently discarded. Apply the clamp on
                    an outer wrapper instead so it actually takes effect.
                  */}
                  <div className="max-h-64 overflow-auto">
                    <CodeBlock wrapLongLines className="language-ts">
                      {database.schemaSource}
                    </CodeBlock>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

// Directories first, then files, each alphabetically.
function renderSourceFileTree(paths: string[]): React.ReactNode {
  const directories = new Map<string, string[]>();
  const files: string[] = [];
  for (const path of paths) {
    const slashIndex = path.indexOf("/");
    if (slashIndex === -1) {
      files.push(path);
    } else {
      const directory = path.slice(0, slashIndex);
      const rest = path.slice(slashIndex + 1);
      directories.set(directory, [...(directories.get(directory) ?? []), rest]);
    }
  }

  return [
    ...[...directories]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, children]) => (
        <Tree.Item key={name} label={name} visual={Folder} type="node">
          {renderSourceFileTree(children)}
        </Tree.Item>
      )),
    ...files
      .sort((a, b) => a.localeCompare(b))
      .map((name) => (
        <Tree.Item key={name} label={name} visual={File02} type="leaf" />
      )),
  ];
}
