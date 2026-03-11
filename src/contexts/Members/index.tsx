import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { supabase } from "../../config/supabaseClient";

interface Member {
    id: string;
    name: string;
    insta: string;
    xp: number;
    level: number;
    file: string;
}

type MembersContextProvider = {
    members: Member[];
    getMembers: () => Promise<void>;
};

type MembersProviderProps = {
    children: ReactNode;
};

export const MembersContext = createContext({} as MembersContextProvider);

export const useMembers = () => useContext(MembersContext);

export const MembersProvider = ({ children }: MembersProviderProps) => {
    const [members, setMembers] = useState<Member[]>([]);

    const getMembers = useCallback(async () => {
        const { data, error } = await supabase
            .from("members")
            .select("*")
            .order("level", { ascending: false });

        if (error) {
            console.error("Error fetching members:", error);
            setMembers([]);
            return;
        }

        setMembers(data || []);
    }, []);

    return (
        <MembersContext.Provider
            value={{
                members,
                getMembers,
            }}
        >
            {children}
        </MembersContext.Provider>
    );
};