namespace NodeJS {
  interface ProcessEnv {
    // --- From .env ---
    NEXT_PUBLIC_APP_TITLE: string;
    NEXT_PUBLIC_APP_SHORT_NAME: string;
    NEXT_PUBLIC_APP_DESCRIPTION: string;
    // --- From .env.{environment} ---
    NEXT_PUBLIC_APP_DOMAIN: string;
  }
}
