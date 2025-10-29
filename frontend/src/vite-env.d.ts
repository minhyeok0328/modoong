/// <reference types="vite/client" />

// Extend this interface with your custom env variables if needed.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // add other variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
