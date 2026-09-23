/**
 * system group:
 * Accessible by no-one other than our system API keys.
 * Has access to the system Space which holds the connected data sources.
 *
 * global group:
 * Contains all users from the workspace.
 * Has access to the global Space which holds all existing datasource created before spaces.
 *
 * regular group:
 * Contains specific users added by workspace admins.
 * Has access to the list of spaces configured by workspace admins.
 */

const RubyGroupIdsHeader = "X-Ruby-Group-Ids";

export function getHeaderFromGroupIds(groupIds: string[] | undefined) {
  if (!groupIds) {
    return undefined;
  }

  return {
    [RubyGroupIdsHeader]: groupIds.join(","),
  };
}

const RubyUserEmailHeader = "x-api-user-email";

export function getHeaderFromUserEmail(email: string | undefined) {
  if (!email) {
    return undefined;
  }

  // The email may exceed Latin-1 (internationalized addresses); RubyAPI
  // encodes extra header values on the wire (see @ruby-ai/client baseHeaders).
  return {
    [RubyUserEmailHeader]: email,
  };
}
