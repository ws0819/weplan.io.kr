// eslint-disable-next-line @typescript-eslint/no-explicit-any
let kakaoOAuthPromise: Promise<any> | null = null;

export function loadKakao() {
  if (kakaoOAuthPromise) {
    return kakaoOAuthPromise;
  }

  // 새로 로드
  kakaoOAuthPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js"
    script.integrity = "sha384-JpLApTkB8lPskhVMhT+m5Ln8aHlnS0bsIexhaak0jOhAkMYedQoVghPfSpjNi9K1"
    script.crossOrigin = "anonymous"
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.Kakao) {
        reject(new Error('Kakao SDK 로드 실패'))
        return
      }

      if (!window.Kakao.isInitialized()) {
        const jsKey = import.meta.env.VITE_KAKAO_JS_KEY;

        if (!jsKey) {
          reject(new Error('VITE_JS_KAKAO가 없습니다.'))
          return
        } 

        window.Kakao.init(jsKey)
      }
      resolve(window.Kakao)
    }

    script.onerror = () => reject(new Error("kakao OAuth 스크립트 로드 실패"));

    document.head.appendChild(script);
  });

  return kakaoOAuthPromise;
}
