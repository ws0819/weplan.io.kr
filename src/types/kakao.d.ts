// src/types/kakao.d.ts
interface Window {
  Kakao: {
    init: (key: string) => void;
    isInitialized: () => boolean;
    Auth: {
      // ✅ OIDC 방식
      authorize: (options: {
        redirectUri: string;
        scope?: string;
        prompt?: string;
      }) => void;
      getAccessToken: () => string | null;
      logout: (callback?: () => void) => void;
    };
  };
}
