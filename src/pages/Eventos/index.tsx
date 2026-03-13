import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TitlePage } from "../../components/TitlePage";

import { useEvents, Player, Event } from "../../contexts/Eventos";
import { getPastEvents, getUpcomingEvents } from "../../utils/eventHelpers";

import {
  CalendarDaysIcon,
  MapPinIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function Eventos() {

  const { events, players } = useEvents();
  const navigate = useNavigate();

  function formatDateBR(dateString: string) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  const upcomingEvents = useMemo(() => {
    return getUpcomingEvents(events);
  }, [events]);

  const pastEvents = useMemo(() => {
    return getPastEvents(events).slice(0, 6);
  }, [events]);

  const playersByEvent = useMemo<Record<string, Player[]>>(() => {
    return players.reduce((acc, player) => {
      if (!acc[player.event_id]) acc[player.event_id] = [];
      acc[player.event_id].push(player);
      return acc;
    }, {} as Record<string, Player[]>);
  }, [players]);

  function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function renderEventCard(event: Event, isPast = false) {

    const eventPlayers = playersByEvent[event.id] || [];

    const remaining =
      event.max_players > 0
        ? event.max_players - eventPlayers.length
        : null;

    const progress =
      event.max_players > 0
        ? (eventPlayers.length / event.max_players) * 100
        : 0;

    return (
      <div
        key={event.id}
        onClick={() => navigate(`/evento/${event.slug}`)}
        className={`group cursor-pointer overflow-hidden rounded-xl bg-white shadow hover:shadow-xl transition
        ${isPast ? "grayscale opacity-70" : ""}`}
      >

        <div className="grid grid-cols-[220px_1fr] h-[160px]">

          {/* POSTER */}

          <div className="relative overflow-hidden bg-black">

            <img
              src={event.cover_image}
              alt={event.name}
              className="h-full w-full object-cover"
            />

            {!isPast && remaining !== null && (
              <div className="absolute left-3 top-3 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white uppercase">
                {remaining === 0 ? "Lotado" : `${remaining} vagas`}
              </div>
            )}

          </div>

          {/* INFO */}

          <div className="flex flex-col justify-center gap-2 px-5">

            <h3 className="text-lg font-semibold text-gray-800">
              {event.name}
            </h3>

            <span className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDaysIcon className="h-4 w-4 text-blue-500" />
              {formatDateBR(event.date)}
            </span>

            <span className="flex items-center gap-2 text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 text-red-500" />
              {event.location}
            </span>

            <span className="flex items-center gap-2 text-sm text-gray-600">
              <BanknotesIcon className="h-4 w-4 text-green-500" />
              {event.price ? formatCurrency(event.price) : "Gratuito"}
            </span>

            {!isPast && event.max_players > 0 && (
              <div className="mt-1">

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Vagas</span>
                  <span>
                    {eventPlayers.length}/{event.max_players}
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-brand-500"
                  />

                </div>

              </div>
            )}

            {isPast && (
              <span className="text-xs text-gray-500">
                Evento encerrado
              </span>
            )}

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 md:px-8">

      <TitlePage
        title="Eventos"
        subtitle="Eventos e operações da equipe"
      />

      {/* PRÓXIMOS */}

      <div className="flex flex-col gap-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Próximos Eventos
        </h2>

        {upcomingEvents.length === 0 && (
          <p className="text-gray-500">
            Nenhum evento agendado.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {upcomingEvents.map((event) =>
            renderEventCard(event)
          )}
        </div>

      </div>

      {/* PASSADOS */}

      {pastEvents.length > 0 && (
        <div className="flex flex-col gap-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Eventos Passados
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {pastEvents.map((event) =>
              renderEventCard(event, true)
            )}
          </div>

        </div>
      )}

    </div>
  );
}
