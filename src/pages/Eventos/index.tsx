import { useState, useMemo } from "react";
import { Modal } from "../../components/Modal";
import Button from "../../components/Button";
import { useEvents, Team, Player, Event } from "../../contexts/Eventos";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function Eventos() {
  const {
    events,
    teams,
    players,
    selectEvent,
    registerPlayer,
    loading,
  } = useEvents();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formMode, setFormMode] = useState(false);

  const [name, setName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const now = new Date();

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  /*
  EVENTOS FUTUROS
  */

  const upcomingEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= now;
    });
  }, [events]);

  /*
  EVENTOS PASSADOS
  */

  const pastEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate < now;
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 3);
  }, [events]);

  /*
  PLAYERS ORDENADOS
  */

  const playersSorted = useMemo(() => {
    return [...players].sort((a, b) => {
      const teamA = (a.airsoft_team || "").toLowerCase();
      const teamB = (b.airsoft_team || "").toLowerCase();

      if (teamA < teamB) return -1;
      if (teamA > teamB) return 1;

      return a.name.localeCompare(b.name);
    });
  }, [players]);

  /*
  PLAYERS POR TIME
  */

  const playersByTeam = useMemo<Record<string, Player[]>>(() => {
    return playersSorted.reduce((acc, player) => {
      if (!acc[player.team_id]) acc[player.team_id] = [];
      acc[player.team_id].push(player);
      return acc;
    }, {} as Record<string, Player[]>);
  }, [playersSorted]);

  /*
  LIMITE POR TIME
  */

  const maxPlayersPerTeam = useMemo(() => {
    if (!selectedEvent) return 0;
    if (teams.length === 0) return 0;

    return Math.floor(selectedEvent.max_players / teams.length);
  }, [selectedEvent, teams]);

  /*
  VERIFICAR SE TIMES ESTÃO CHEIOS
  */

  const allTeamsFull = useMemo(() => {
    return teams.every((team) => {
      const teamPlayers = playersByTeam[team.id] || [];
      return teamPlayers.length >= maxPlayersPerTeam;
    });
  }, [teams, playersByTeam, maxPlayersPerTeam]);

  async function handleRegister() {
    if (!teamId || !name.trim()) return;

    setErrorMessage(null);

    const result = await registerPlayer(
      teamId,
      name.trim(),
      teamName.trim() || undefined
    );

    if (result?.error) {

      if (result.error === "PLAYER_ALREADY_REGISTERED") {
        setErrorMessage("Você já está inscrito neste time.");
        return;
      }

      if (result.error === "PLAYER_IN_OTHER_TEAM") {
        setErrorMessage("Você já está inscrito em outro time neste evento.");
        return;
      }

      if (result.error === "EVENT_FULL") {
        setErrorMessage("As vagas para este evento já foram preenchidas.");
        return;
      }

      setErrorMessage("Não foi possível realizar sua inscrição.");
      return;
    }

    setName("");
    setTeamName("");
    setTeamId("");
    setFormMode(false);
  }

  function renderEventCard(event: Event, isPast = false) {
    return (
      <div
        key={event.id}
        onClick={() => {
          if (!isPast) {
            selectEvent(event);
            setSelectedEvent(event);
          }
        }}
        className={`group cursor-pointer overflow-hidden rounded-xl bg-white shadow transition hover:shadow-xl ${isPast ? "grayscale opacity-60 cursor-default" : ""
          }`}
      >
        {event.cover_image && (
          <img
            src={event.cover_image}
            alt={event.name}
            className="h-40 w-full object-cover transition group-hover:scale-105"
          />
        )}

        <div className="flex flex-col gap-2 p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {event.name}
          </h3>

          <span className="text-sm text-gray-600">
            {formatDate(event.date)} • {event.location}
          </span>

          <span className="text-sm text-gray-600">
            Valor: R$ {event.price}
          </span>

          {isPast && (
            <span className="text-xs font-semibold text-gray-500">
              Evento encerrado
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-10 md:px-8">

      {/* EVENTOS FUTUROS */}

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Próximos Eventos
        </h2>

        {upcomingEvents.length === 0 && (
          <p className="text-gray-500">
            Nenhum evento futuro disponível
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => renderEventCard(event))}
        </div>
      </div>

      {/* EVENTOS PASSADOS */}

      {pastEvents.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Eventos Passados
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => renderEventCard(event, true))}
          </div>
        </div>
      )}

      {/* MODAL */}

      <Modal
        isOpen={!!selectedEvent}
        onRequestClose={() => {
          setSelectedEvent(null);
          setFormMode(false);
        }}
      >
        {selectedEvent && (
          <>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setFormMode(false);
              }}
              className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            {selectedEvent.cover_image && (
              <img
                src={selectedEvent.cover_image}
                alt={selectedEvent.name}
                className="mb-6 h-64 w-full rounded-md object-cover"
              />
            )}

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedEvent.name}
              </h1>

              <p className="text-sm text-gray-600">
                {selectedEvent.description}
              </p>

              <p className="text-sm text-gray-600">
                {formatDate(selectedEvent.date)} • {selectedEvent.location}
              </p>

              <p className="text-sm text-gray-600">
                Valor: <strong>R$ {selectedEvent.price}</strong>
              </p>
            </div>

            {/* TIMES */}

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {teams.map((team: Team) => {
                const teamPlayers = playersByTeam[team.id] || [];
                const isFull = teamPlayers.length >= maxPlayersPerTeam;

                return (
                  <div
                    key={team.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <h3 className="mb-2 text-lg font-semibold">
                      {team.name} ({teamPlayers.length} / {maxPlayersPerTeam})
                    </h3>

                    <ul className="space-y-1 text-sm text-gray-700 max-h-40 overflow-y-auto pr-2">
                      {teamPlayers.length === 0 ? (
                        <li className="text-gray-400 italic">
                          Nenhum jogador ainda
                        </li>
                      ) : (
                        teamPlayers.map((player) => (
                          <li
                            key={player.id}
                            className="flex justify-between"
                          >
                            <span>{player.name}</span>
                            <span className="text-gray-400 text-xs">
                              {player.airsoft_team || "-"}
                            </span>
                          </li>
                        ))
                      )}
                    </ul>

                    {isFull && (
                      <div className="mt-2 text-xs text-red-500">
                        Time cheio
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!formMode && (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading || allTeamsFull}
                onClick={() => setFormMode(true)}
              >
                {allTeamsFull ? "Times completos" : "Quero me inscrever"}
              </Button>
            )}

            {formMode && (
              <div className="mt-6 flex flex-col gap-4">

                {errorMessage && (
                  <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-brand-500"
                />

                <input
                  type="text"
                  placeholder="Sua equipe (opcional)"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-brand-500"
                />

                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-brand-500"
                >
                  <option value="">Selecione o time</option>

                  {teams.map((team) => {
                    const teamPlayers = playersByTeam[team.id] || [];
                    const isFull = teamPlayers.length >= maxPlayersPerTeam;

                    return (
                      <option
                        key={team.id}
                        value={team.id}
                        disabled={isFull}
                      >
                        {team.name} {isFull ? "(Lotado)" : ""}
                      </option>
                    );
                  })}
                </select>

                <Button
                  variant="primary"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  onClick={handleRegister}
                >
                  Confirmar inscrição
                </Button>

                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setFormMode(false);
                    setErrorMessage(null);
                  }}
                >
                  Fechar
                </Button>

              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}