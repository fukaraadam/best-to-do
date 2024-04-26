namespace NodeJS {
  interface ProcessEnv {
    // --- From .env ---
    NEXT_PUBLIC_APP_TITLE: string;
    NEXT_PUBLIC_APP_SHORT_NAME: string;
    NEXT_PUBLIC_APP_DESCRIPTION: string;
    // --- From .env.{environment} ---
    NEXT_PUBLIC_APP_DOMAIN: string;
    // --- From .env.local ---
    AUTH_SECRET: string;
    // EMAIL_SERVER_USER: string;
    // EMAIL_SERVER_PASSWORD: string;
    // EMAIL_SERVER_HOST: string;
    // EMAIL_SERVER_PORT: number;
    EMAIL_SERVER: string;
    EMAIL_FROM: string;
    AUTH_GITHUB_ID: string;
    AUTH_GITHUB_SECRET: string;
    DATABASE_URL: string;
  }
}
