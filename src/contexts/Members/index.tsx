import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { supabase } from "../../config/supabaseClient";

interface Members {
    id: string; xp: number, name: string, insta: string, level: number, file: string
}

type MembersContextProvider = {
    getMembers: () => Promise<void>,
    members: Members[] | null,
}

type MembersProviderProps = {
    children: ReactNode;
};

export const MembersContext = createContext({} as MembersContextProvider);
export const useMembers = () => useContext(MembersContext);

export const MembersProvider = (props: MembersProviderProps) => {
    const [members, setMembers] = useState<Members[] | null>([]);

    const getMembers = useCallback(async () => {
        const { data, error } = await supabase.from("members").select("*");
        if (error) {
            console.error("Error fetching members:", error);
            setMembers([]);
            return;
        }
        setMembers((data || []) as Members[]);
    }, []);

    return (
        <MembersContext.Provider value={{
            members,
            getMembers,
        }}>
            {props.children}
        </MembersContext.Provider>
    )

}
