import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { supabase } from "../../config/supabaseClient";
import { sanitizeFileName } from "../../utils/sanitizeFileName";

interface Store {
    id: string;
    value?: number;
    contact: string;
    text: string;
    url: string;
    approved: boolean;
}

type StoreContextProvider = {
    store: Store[];

    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;

    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;

    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;

    contact: string;
    setContact: React.Dispatch<React.SetStateAction<string>>;

    collections: string;
    setCollections: React.Dispatch<React.SetStateAction<string>>;

    createAnnouncement: () => Promise<void>;
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

    const [files, setFiles] = useState<File[]>([]);
    const [text, setText] = useState("");
    const [value, setValue] = useState("");
    const [contact, setContact] = useState("");

    const getStore = useCallback(async () => {
        const { data, error } = await supabase
            .from("store")
            .select("*")
            .eq("approved", true)
            .gt("expires_at", new Date().toISOString())
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

        const normalized: Store[] = data
            .filter((item) => item && item.url)
            .map((item) => ({
                id: item.id,
                value: item.value ?? undefined,
                contact: item.contact ?? "",
                text: item.text ?? "",
                url: item.url ?? "",
                approved: item.approved ?? false,
            }));

        setStore(normalized);
    }, []);

    const createAnnouncement = useCallback(async () => {
        if (!files.length) return;

        try {
            const file = files[0];
            const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;

            const { error: uploadError } = await supabase.storage
                .from("store")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from("store")
                .getPublicUrl(fileName);

            if (!data?.publicUrl) throw new Error("Erro ao gerar URL pública");

            const { error } = await supabase.from("store").insert([
                {
                    text,
                    value: value ? Number(value) : null,
                    contact,
                    url: data.publicUrl,
                    approved: false,
                },
            ]);

            if (error) throw error;

            setFiles([]);
            setText("");
            setValue("");
            setContact("");

        } catch (err) {
            console.error("Erro ao criar anúncio:", err);
        }
    }, [files, text, value, contact]);

    const valueContext = useMemo(
        () => ({
            store,
            files,
            setFiles,
            text,
            setText,
            value,
            setValue,
            contact,
            setContact,
            collections,
            setCollections,
            createAnnouncement,
            getStore,
        }),
        [store, files, text, value, contact, collections, createAnnouncement, getStore]
    );

    return (
        <StoreContext.Provider value={valueContext}>
            {children}
        </StoreContext.Provider>
    );
};