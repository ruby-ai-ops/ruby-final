declare global {
  interface ImportMeta {
    env?: {
      VITE_BASE_PATH?: string;
      VITE_RUBY_API_URL?: string;
      VITE_RUBY_API_URL_EU?: string;
      VITE_RUBY_API_URL_US?: string;
      VITE_RUBY_API_URL_CELL_00002?: string;
      VITE_RUBY_CLIENT_FACING_URL?: string;
      VITE_RUBY_REGION?: string;
      VITE_RUBY_REGION_STORAGE_KEY?: string;
      VITE_RUBY_CELL?: string;
      VITE_RUBY_CELL_STORAGE_KEY?: string;
    };
  }
}

// Augment webextension-polyfill to include `data_collection`, a Firefox-specific
// field for built-in data consent permissions not yet in @types/webextension-polyfill.
// See: https://extensionworkshop.com/documentation/develop/firefox-builtin-data-consent/
declare module "webextension-polyfill" {
  namespace Permissions {
    interface AnyPermissions {
      data_collection?: string[];
    }
  }
}

export {};
