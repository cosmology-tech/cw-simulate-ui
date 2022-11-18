import { DependencyList, useCallback, useEffect, useRef } from "react";

type Data<Args extends []> = {
  timer?: ReturnType<typeof setTimeout>;
  callback?(...args: Args): void;
  delay?: number;
}

export default function useDebounce<Args extends []>(
  callback: (...args: Args) => void,
  delay = 500,
  deps: DependencyList = [],
) {
  const data = useRef<Data<Args>>({});
  data.current.callback = callback;
  data.current.delay = delay;
  
  // Cleanup upon dismount
  useEffect(() => {
    return () => {
      data.current.timer && clearTimeout(data.current.timer);
    }
  }, []);
  
  return useCallback((...args: Args) => {
    data.current.timer && clearTimeout(data.current.timer);
    
    data.current.timer = setTimeout(() => {
      data.current.callback?.(...args);
    }, data.current.delay);
  }, [delay, ...deps]);
}
