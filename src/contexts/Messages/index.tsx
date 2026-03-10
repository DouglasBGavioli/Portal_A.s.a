import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "../../config/supabaseClient";
import { useLoader } from "../Loader";

interface FormData {
    email: string;
    mensagem: string;
    nome: string;
    telefone: string;
    tempoPratica: string;
}

const INITIAL_DATA: FormData = {
    email: "",
    mensagem: "",
    nome: "",
    telefone: "",
    tempoPratica: "",
};

type MessageContextType = {
    data: FormData;
    setData: React.Dispatch<React.SetStateAction<FormData>>;
    sendMessage: () => Promise<boolean>;
};

const MessageContext = createContext({} as MessageContextType);

export const useMessages = () => useContext(MessageContext);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const { handleLoader } = useLoader();

    const [data, setData] = useState<FormData>(INITIAL_DATA);

    const sendMessage = useCallback(async () => {
        handleLoader(true);

        try {
            const { error } = await supabase.from("messages").insert([
                {
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    mensagem: data.mensagem,
                    tempo_pratica: data.tempoPratica,
                },
            ]);

            if (error) throw error;

            setData(INITIAL_DATA);

            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            handleLoader(false);
        }
    }, [data, handleLoader]);

    return (
        <MessageContext.Provider
            value={{
                data,
                setData,
                sendMessage,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};