import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TitlePage } from "../../components/TitlePage";

import { useEvents, Player, Event } from "../../contexts/Eventos";
import { getPastEvents, getUpcomingEvents, isRegistrationOpen } from "../../utils/eventHelpers";
import { formatDateBR } from "../../utils/formatDateBR";

import {
  CalendarDaysIcon,
  MapPinIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Eventos() {

  const { events, players } = useEvents();
  const navigate = useNavigate();

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
        className={`group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col
        ${isPast ? "grayscale opacity-75" : ""}`}
      >

        {/* IMAGEM DO EVENTO NO TOPO */}
        <div className="relative w-full aspect-video max-h-[340px] overflow-hidden">
          <img
            src={event.cover_image}
            alt={event.name}
            className="w-full h-full object-fill block transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* BADGE DE STATUS */}
          <div className="absolute top-3 left-3 z-10">
            {!isPast && !isRegistrationOpen(event) && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow">
                Inscrições em breve
              </span>
            )}

            {!isPast && isRegistrationOpen(event) && remaining !== null && (
              <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow">
                {remaining === 0 ? "Lotado" : `${remaining} vagas`}
              </span>
            )}
          </div>
        </div>

        {/* INFO INFERIOR */}
        <div className="flex flex-1 flex-col justify-between p-5 gap-4">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-brand-600 transition">
            {event.name}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
            <span className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4 text-blue-500 shrink-0" />
              <span className="font-semibold text-gray-800">{formatDateBR(event.date)}</span>
            </span>

            <span className="flex items-center gap-2">
              <BanknotesIcon className="h-4 w-4 text-green-600 shrink-0" />
              <span className="font-semibold text-gray-800">{event.price ? formatCurrency(event.price) : "Gratuito"}</span>
            </span>

            <span className="flex items-center gap-2 sm:col-span-2">
              <MapPinIcon className="h-4 w-4 text-red-500 shrink-0" />
              <span className="truncate font-medium">{event.location}</span>
            </span>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            {!isPast && isRegistrationOpen(event) && event.max_players > 0 && (
              <div className="w-full space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-gray-500">
                  <span>Vagas preenchidas</span>
                  <span className="font-bold text-gray-700">
                    {eventPlayers.length}/{event.max_players}
                  </span>
                </div>

                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-brand-500 rounded-full"
                  />
                </div>
              </div>
            )}

            {!isPast && !isRegistrationOpen(event) && (
              <span className="text-xs font-bold text-amber-600">
                Inscrições em breve
              </span>
            )}

            {isPast && (
              <span className="text-xs font-semibold text-gray-400">
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
