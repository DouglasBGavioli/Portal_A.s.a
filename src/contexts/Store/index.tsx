import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { supabase } from "../../config/supabaseClient";

interface Store {
    id: string,
    value?: string,
    contact: number,
    text: string,
    url: string[]
}

type StoreContextProvider = {
    getStore: () => Promise<void>,
    collections: string,
    setCollections: (collection: string) => void
    store: Store[] | null
}

type StoreProviderProps = {
    children: ReactNode;
};

export const StoreContext = createContext({} as StoreContextProvider);
export const useStore = () => useContext(StoreContext);

export const StoreProvider = (props: StoreProviderProps) => {
    const [store, setStore] = useState<Store[] | null>([]);
    const [collections, setCollections] = useState('');

    const getStore = useCallback(async () => {
        const { data, error } = await supabase.from("store").select("*");
        if (error) {
            console.error("Error fetching store:", error);
            setStore([]);
            return;
        }
        setStore((data || []) as Store[]);
    }, []);

    return (
        <StoreContext.Provider value={{
            getStore,
            collections,
            setCollections,
            store,
        }}>
            {props.children}
        </StoreContext.Provider>
    )

}
