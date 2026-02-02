
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let googleOAuthPromise: Promise<any> | null = null;

export function loadGoogle() {
  if (googleOAuthPromise) {
    return googleOAuthPromise;
  }

  // 이미 로드 완료
  if (window.google?.accounts) {
    return Promise.resolve(window.google);
  }

  // 새로 로드
  googleOAuthPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.accounts) {
        console.log("✅ Google OAuth 로드 완료");
        resolve(window.google);
      } else {
        reject(new Error("Google OAuth 로드 실패"));
      }
    };

    script.onerror = () => reject(new Error("Google OAuth 스크립트 로드 실패"));

    document.head.appendChild(script);
  });

  return googleOAuthPromise;
}
