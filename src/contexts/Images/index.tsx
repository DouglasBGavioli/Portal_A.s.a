import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { supabase } from "../../config/supabaseClient";

export interface GalleryImage {
    url: string;
    order: number;
}

export interface Gallery {
    id: string;
    data: string;
    description: string;
    images: GalleryImage[];
}

type GalleryRow = Omit<Gallery, "images"> & {
    images?: GalleryImage[] | null;
};

type MidiasContextProvider = {
    getMidias: () => Promise<void>;
    gallery: Gallery[];
};

type MidiasProviderProps = {
    children: ReactNode;
};

export const MidiasContext = createContext({} as MidiasContextProvider);

export const useImages = () => useContext(MidiasContext);

export const MidiasProvider = ({ children }: MidiasProviderProps) => {
    const [gallery, setGallery] = useState<Gallery[]>([]);

    const getMidias = useCallback(async () => {
        const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .order("data", { ascending: false });

        if (error) {
            console.error("Erro ao buscar galerias:", error);
            setGallery([]);
            return;
        }

        const formatted = ((data as GalleryRow[] | null) ?? []).map((item) => ({
            ...item,
            images: item.images ?? [],
        }));

        setGallery(formatted);
    }, []);

    return (
        <MidiasContext.Provider
            value={{
                getMidias,
                gallery,
            }}
        >
            {children}
        </MidiasContext.Provider>
    );
};
