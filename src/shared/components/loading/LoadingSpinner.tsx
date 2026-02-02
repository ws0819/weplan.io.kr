import AirPlaneLoader from '@/shared/assets/lottie/plane.json'
import { lazy, Suspense } from 'react';

const Lottie = lazy(()=> import('lottie-react'))
function LoadingSpinner({ text }: { text?:string}) {
 
  return (
    <div className="flex-center flex-col">
      <Suspense
        fallback={
            <Lottie
              animationData={AirPlaneLoader}
              loop={true}
              style={{ height: 100, width: 100 }}
            />
        }
      ></Suspense>
      <p className="text-center">{text ? text : "Loading..."}</p>
    </div>
  );
}
export default LoadingSpinner