import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { supabase } from "../../config/supabaseClient";

export type Team = {
  id: string;
  name: string;
  event_id: string;
};

export type Player = {
  id: string;
  event_id: string;
  team_id: string;
  name: string;
  airsoft_team?: string;
};

export type Event = {
  id: string;
  name: string;
  location: string;
  description?: string;
  cover_image?: string;
  date: string;
  opening_time: string;
  briefing_time: string;
  game_start_time: string;
  end_time: string;
  price: number;
  max_players: number;
  slug: string;
  bandages: number;
};

type RegisterResult = {
  error?: string;
};

type EventsContextType = {
  events: Event[];
  selectedEvent: Event | null;
  teams: Team[];
  players: Player[];

  loading: boolean;

  selectEvent: (slug: string) => void;

  registerPlayer: (
    teamId: string,
    name: string,
    airsoftTeam?: string
  ) => Promise<RegisterResult>;
};

const EventsContext = createContext({} as EventsContextType);

export const useEvents = () => useContext(EventsContext);

export function EventsProvider({ children }: { children: ReactNode }) {

  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [loading, setLoading] = useState(false);

  /*
  CARREGAR TODOS OS DADOS
  */

  const loadData = useCallback(async () => {

    setLoading(true);

    try {

      const [eventsRes, teamsRes, playersRes] = await Promise.all([

        supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true }),

        supabase
          .from("teams")
          .select("*"),

        supabase
          .from("players")
          .select("*")

      ]);

      if (eventsRes.error) console.error(eventsRes.error);
      if (teamsRes.error) console.error(teamsRes.error);
      if (playersRes.error) console.error(playersRes.error);

      setEvents(eventsRes.data || []);
      setTeams(teamsRes.data || []);
      setPlayers(playersRes.data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }, []);

  /*
  SELECIONAR EVENTO
  */

  const selectEvent = useCallback((slug: string) => {

    const event = events.find((e) => e.slug === slug) || null;

    setSelectedEvent(event);

  }, [events]);

  /*
  REGISTRAR PLAYER
  */

  const registerPlayer = useCallback(async (

    teamId: string,
    name: string,
    airsoftTeam?: string

  ): Promise<RegisterResult> => {

    if (!selectedEvent) {
      return { error: "EVENT_NOT_FOUND" };
    }

    try {

      setLoading(true);

      const normalizedName = name.trim().toLowerCase();
      const normalizedTeam = (airsoftTeam || "").trim().toLowerCase();

      const existingPlayers = players.filter(
        (p) => p.event_id === selectedEvent.id
      );

      const alreadyRegistered = existingPlayers.find(
        (p) =>
          p.name.toLowerCase() === normalizedName &&
          (p.airsoft_team || "").toLowerCase() === normalizedTeam
      );

      if (alreadyRegistered) {
        return { error: "PLAYER_ALREADY_REGISTERED" };
      }

      if (existingPlayers.length >= selectedEvent.max_players) {
        return { error: "EVENT_FULL" };
      }

      const { data, error } = await supabase
        .from("players")
        .insert({
          event_id: selectedEvent.id,
          team_id: teamId,
          name,
          airsoft_team: airsoftTeam,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        return { error: "UNKNOWN_ERROR" };
      }

      setPlayers((prev) => [...prev, data]);

      return {};

    } catch (err) {

      console.error(err);
      return { error: "UNKNOWN_ERROR" };

    } finally {

      setLoading(false);

    }

  }, [players, selectedEvent]);

  /*
  CARREGAR AO INICIAR
  */

  useEffect(() => {
    loadData();
  }, [loadData]);

  const value = useMemo(() => ({

    events,
    teams,
    players,
    selectedEvent,
    loading,

    selectEvent,
    registerPlayer,

  }), [

    events,
    teams,
    players,
    selectedEvent,
    loading,
    selectEvent,
    registerPlayer,

  ]);

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}