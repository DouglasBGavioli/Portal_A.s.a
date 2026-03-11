import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

type LoaderContextProps = {
  handleLoader(load: boolean): void;
};

type LoaderProviderProps = {
  children: ReactNode;
};

export const LoaderContext = createContext({} as LoaderContextProps);

export const useLoader = () => useContext(LoaderContext);

export function LoaderProvider(props: LoaderProviderProps) {
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isLoad ? "hidden" : "initial";
  }, [isLoad]);

  const handleLoader = useCallback((load: boolean) => setIsLoad(load), []);

  const value = useMemo(() => ({ handleLoader }), [handleLoader]);

  return (
    <LoaderContext.Provider value={value}>
      <div className={`fixed left-0 top-0 z-[1001] h-full w-full items-center justify-center overflow-hidden bg-transparent ${isLoad ? "flex" : "hidden"}`}>
        <div className="h-20 w-20 animate-spin rounded-full border-8 border-brand-500 border-t-transparent" />
      </div>
      {props.children}
    </LoaderContext.Provider>
  );
}

