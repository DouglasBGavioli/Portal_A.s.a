import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { supabase } from "../../config/supabaseClient";

interface Store {
    id: string;
    value?: number;
    contact: string;
    text: string;
    url: string;
}

type StoreContextProvider = {
    store: Store[];
    collections: string;
    setCollections: React.Dispatch<React.SetStateAction<string>>;
    getStore: () => Promise<void>;
};

type StoreProviderProps = {
    children: ReactNode;
};

const StoreContext = createContext<StoreContextProvider | undefined>(
    undefined
);

export const useStore = () => {
    const context = useContext(StoreContext);

    if (!context) {
        throw new Error("useStore must be used inside StoreProvider");
    }

    return context;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
    const [store, setStore] = useState<Store[]>([]);
    const [collections, setCollections] = useState("");

    const getStore = useCallback(async () => {
        const { data, error } = await supabase
            .from("store")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching store:", error);
            setStore([]);
            return;
        }

        if (!data) {
            setStore([]);
            return;
        }

        // normaliza os dados para evitar undefined
        const normalized: Store[] = data
            .filter((item) => item && item.url)
            .map((item) => ({
                id: item.id,
                value: item.value ?? undefined,
                contact: item.contact ?? "",
                text: item.text ?? "",
                url: item.url ?? "",
            }));

        setStore(normalized);
    }, []);

    const value = useMemo(
        () => ({
            store,
            collections,
            setCollections,
            getStore,
        }),
        [store, collections, getStore]
    );

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
};