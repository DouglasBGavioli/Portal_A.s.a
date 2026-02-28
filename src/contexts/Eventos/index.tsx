import {
    collection,
    addDoc,
    onSnapshot,
    query,
    where,
    getDocs,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { db } from "../../config/firebaseClient";

/* ================= TYPES ================= */

export type Status = "active" | "future" | "past";

export type Team = {
    id: string;
    name: string;
    color: string;
};

export type Event = {
    id: string;
    title: string;
    date: string;
    location: string;
    price: string;
    image: string;
    status: Status;
    teams: Team[];
};

export type Registration = {
    id: string;
    name: string;
    teamId: string;
    teamName: string;
    createdAt?: any;
};

interface EventContextType {
    events: Event[];
    activeEvent: Event | null;
    registrations: Registration[];
    loading: boolean;

    createEvent: (event: Omit<Event, "id">) => Promise<void>;
    updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;

    listenRegistrations: (eventId: string) => () => void;
    registerPlayer: (
        eventId: string,
        data: {
            name: string;
            teamId: string;
            teamName: string;
        }
    ) => Promise<{ success: boolean; message?: string }>;
}

/* ================= CONTEXT ================= */

const EventContext = createContext<EventContextType>(
    {} as EventContextType
);

/* ================= PROVIDER ================= */

export function EventProvider({ children }: { children: ReactNode }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(false);

    /* ================= LISTEN EVENTS ================= */

    useEffect(() => {
        const eventsRef = collection(db, "events");

        const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Event, "id">),
            }));

            setEvents(data);
        });

        return unsubscribe;
    }, []);

    const activeEvent =
        events.find((event) => event.status === "active") || null;

    /* ================= CREATE EVENT ================= */

    async function createEvent(event: Omit<Event, "id">) {
        setLoading(true);
        await addDoc(collection(db, "events"), {
            ...event,
            createdAt: serverTimestamp(),
        });
        setLoading(false);
    }

    /* ================= UPDATE EVENT ================= */

    async function updateEvent(id: string, data: Partial<Event>) {
        const eventRef = doc(db, "events", id);
        await updateDoc(eventRef, data);
    }

    /* ================= DELETE EVENT ================= */

    async function deleteEvent(id: string) {
        const eventRef = doc(db, "events", id);
        await deleteDoc(eventRef);
    }

    /* ================= LISTEN REGISTRATIONS ================= */

    function listenRegistrations(eventId: string) {
        const registrationsRef = collection(
            db,
            "events",
            eventId,
            "registrations"
        );

        const unsubscribe = onSnapshot(registrationsRef, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Registration, "id">),
            }));

            setRegistrations(data);
        });

        return unsubscribe;
    }

    /* ================= REGISTER PLAYER ================= */

    async function registerPlayer(
        eventId: string,
        data: {
            name: string;
            teamId: string;
            teamName: string;
        }
    ) {
        if (!data.name.trim()) {
            return { success: false, message: "Nome obrigatório" };
        }

        setLoading(true);

        const registrationsRef = collection(
            db,
            "events",
            eventId,
            "registrations"
        );

        const duplicateQuery = query(
            registrationsRef,
            where("name", "==", data.name)
        );

        const duplicateSnapshot = await getDocs(duplicateQuery);

        if (!duplicateSnapshot.empty) {
            setLoading(false);
            return {
                success: false,
                message: "Você já está inscrito neste evento.",
            };
        }

        await addDoc(registrationsRef, {
            name: data.name,
            teamId: data.teamId,
            teamName: data.teamName,
            createdAt: serverTimestamp(),
        });

        setLoading(false);

        return { success: true };
    }

    return (
        <EventContext.Provider
            value={{
                events,
                activeEvent,
                registrations,
                loading,
                createEvent,
                updateEvent,
                deleteEvent,
                listenRegistrations,
                registerPlayer,
            }}
        >
            {children}
        </EventContext.Provider>
    );
}

/* ================= HOOK ================= */

export function useEvents() {
    return useContext(EventContext);
}