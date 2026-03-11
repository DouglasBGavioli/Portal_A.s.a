import {
  createContext,
  useContext,
  useState,
  useEffect,
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
};

type RegisterResult = {
  error?: string;
};

type EventsContextType = {
  events: Event[];
  selectedEvent: Event | null;
  teams: Team[];
  players: Player[];
  totalPlayers: number;
  remainingSlots: number;
  loading: boolean;

  selectEvent: (event: Event) => Promise<void>;

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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  const [loading, setLoading] = useState(false);

  const totalPlayers = players.length;

  const remainingSlots =
    selectedEvent?.max_players !== undefined
      ? selectedEvent.max_players - totalPlayers
      : 0;

  /*
  CARREGAR EVENTOS
  */

  async function loadEvents() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      setEvents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /*
  SELECIONAR EVENTO
  */

  async function selectEvent(event: Event) {
    setLoading(true);

    try {
      setSelectedEvent(event);

      const [teamsRes, playersRes] = await Promise.all([
        supabase
          .from("teams")
          .select("*")
          .eq("event_id", event.id)
          .order("name"),

        supabase
          .from("players")
          .select("*")
          .eq("event_id", event.id)
          .order("created_at"),
      ]);

      if (teamsRes.error) console.error(teamsRes.error);
      if (playersRes.error) console.error(playersRes.error);

      setTeams(teamsRes.data || []);
      setPlayers(playersRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /*
  REGISTRAR JOGADOR
  */

  async function registerPlayer(
    teamId: string,
    name: string,
    airsoftTeam?: string
  ): Promise<RegisterResult> {

    if (!selectedEvent) {
      return { error: "EVENT_NOT_FOUND" };
    }

    try {

      setLoading(true);

      const normalizedName = name.trim().toLowerCase();
      const normalizedTeam = (airsoftTeam || "").trim().toLowerCase();

      /*
      Buscar jogadores já inscritos no evento
      */

      const { data: existingPlayers, error: fetchError } = await supabase
        .from("players")
        .select("*")
        .eq("event_id", selectedEvent.id);

      if (fetchError) {
        console.error(fetchError);
        return { error: "UNKNOWN_ERROR" };
      }

      /*
      Jogador já inscrito neste time
      */

      const alreadyInSameTeam = existingPlayers?.find(
        (p) =>
          p.team_id === teamId &&
          p.name.toLowerCase() === normalizedName &&
          (p.airsoft_team || "").toLowerCase() === normalizedTeam
      );

      if (alreadyInSameTeam) {
        return { error: "PLAYER_ALREADY_REGISTERED" };
      }

      /*
      Jogador já inscrito em outro time
      */

      const alreadyInOtherTeam = existingPlayers?.find(
        (p) =>
          p.team_id !== teamId &&
          p.name.toLowerCase() === normalizedName &&
          (p.airsoft_team || "").toLowerCase() === normalizedTeam
      );

      if (alreadyInOtherTeam) {
        return { error: "PLAYER_IN_OTHER_TEAM" };
      }

      /*
      Verificar vagas do evento
      */

      if (existingPlayers && existingPlayers.length >= selectedEvent.max_players) {
        return { error: "EVENT_FULL" };
      }

      /*
      Inserir jogador
      */

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
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <EventsContext.Provider
      value={{
        events,
        selectedEvent,
        teams,
        players,
        totalPlayers,
        remainingSlots,
        loading,
        selectEvent,
        registerPlayer,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}