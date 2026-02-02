// eslint-disable-next-line @typescript-eslint/no-explicit-any
let kakaoMapsPromise: Promise<any> | null = null;


export function loadKakaoMap() {
  if (kakaoMapsPromise) {
    return kakaoMapsPromise;
  }

  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  kakaoMapsPromise = new Promise((res, rej) => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=1826bbc6f6a499f8e878143ad953226c&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          res(window.kakao);
        });
      } else {
        rej(new Error("카카오맵 불러오기 실패"));
      }
    };
    script.onerror = () => rej(new Error("스크립트 불러오기 실패"));
    document.head.appendChild(script);
  });
  return kakaoMapsPromise;
}

