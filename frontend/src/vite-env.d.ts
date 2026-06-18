/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // se você usar VITE_NODE_API_URL
  readonly VITE_NODE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}