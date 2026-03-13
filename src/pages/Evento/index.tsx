import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";

import { TitlePage } from "../../components/TitlePage";
import Button from "../../components/Button";

import { useEvents, Team, Player } from "../../contexts/Eventos";
import { isPastEvent } from "../../utils/eventHelpers";

import {
    CalendarDaysIcon,
    MapPinIcon,
    BanknotesIcon,
    ShareIcon,
} from "@heroicons/react/24/outline";

export default function Evento() {
    const { slug } = useParams();

    const {
        events,
        teams,
        players,
        registerPlayer,
        selectEvent,
        loading,
    } = useEvents();

    const [formMode, setFormMode] = useState(false);
    const [name, setName] = useState("");
    const [teamName, setTeamName] = useState("");
    const [teamId, setTeamId] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    /* EVENTO */

    const event = useMemo(() => {
        if (!slug) return undefined;
        return events.find((e) => e.slug === slug);
    }, [events, slug]);

    function formatDateBR(dateString: string) {
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    }

    /* CARREGAR EVENTO */

    useEffect(() => {
        if (!slug) return;
        selectEvent(slug);
    }, [slug, selectEvent]);

    /* TIMES */

    const eventTeams = useMemo(() => {
        if (!event) return [];
        return teams.filter((team) => team.event_id === event.id);
    }, [teams, event]);

    const hasEventEnded = useMemo(() => {
        if (!event) return false;
        return isPastEvent(event);
    }, [event]);

    /* PLAYERS POR TIME */

    const playersByTeam = useMemo<Record<string, Player[]>>(() => {
        return players.reduce((acc, player) => {
            if (!acc[player.team_id]) acc[player.team_id] = [];
            acc[player.team_id].push(player);
            return acc;
        }, {} as Record<string, Player[]>);
    }, [players]);

    /* LIMITES POR TIME (SOLUÇÃO DAS VAGAS ÍMPARES) */

    const teamLimits = useMemo(() => {
        if (!event || eventTeams.length === 0) return {};

        const base = Math.floor(event.max_players / eventTeams.length);
        const remainder = event.max_players % eventTeams.length;

        const limits: Record<string, number> = {};

        eventTeams.forEach((team, index) => {
            limits[team.id] = base + (index < remainder ? 1 : 0);
        });

        return limits;
    }, [event, eventTeams]);

    /* SHARE */

    const handleShare = useCallback(async () => {
        if (!event) return;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: event.name,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copiado!");
            }
        } catch (error) {
            console.error(error);
        }
    }, [event]);

    if (!event && events.length > 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10">
                <p className="text-gray-600">Evento não encontrado.</p>
            </div>
        );
    }

    if (!event) return null;

    /* INSCRIÇÃO */

    async function handleRegister() {
        if (!teamId || !name.trim()) return;

        setErrorMessage(null);

        const result = await registerPlayer(
            teamId,
            name.trim(),
            teamName.trim() || undefined
        );

        if (result?.error) {
            setErrorMessage("Erro ao realizar inscrição");
            return;
        }

        setName("");
        setTeamName("");
        setTeamId("");
        setFormMode(false);
    }

    function formatCurrency(value: number): string {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    return (

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 md:px-8">
            <Helmet>

                <title>{event.name} - {formatDateBR(event.date)} | A.S.A</title>

                {/* SEO */}

                <meta
                    name="description"
                    content={
                        event.description ||
                        "Evento da Associação Santiaguense de Airsoft"
                    }
                />

                {/* OpenGraph */}

                <meta property="og:type" content="website" />

                <meta
                    property="og:title"
                    content={event.name}
                />

                <meta
                    property="og:description"
                    content={
                        event.description ||
                        "Confira os detalhes deste evento da A.S.A"
                    }
                />

                <meta
                    property="og:image"
                    content={event.cover_image}
                />

                <meta
                    property="og:url"
                    content={window.location.href}
                />

                <meta
                    property="og:site_name"
                    content="A.S.A"
                />

                <meta
                    property="og:locale"
                    content="pt_BR"
                />

                {/* Twitter / WhatsApp preview */}

                <meta
                    name="twitter:card"
                    content="summary_large_image"
                />

                <meta
                    name="twitter:title"
                    content={event.name}
                />

                <meta
                    name="twitter:description"
                    content={
                        event.description ||
                        "Evento da Associação Santiaguense de Airsoft"
                    }
                />

                <meta
                    name="twitter:image"
                    content={event.cover_image}
                />

            </Helmet>
            <TitlePage title={event.name} subtitle="Detalhes do evento" />

            {/* HEADER */}

            <div className="grid gap-8 md:grid-cols-[380px_1fr]">

                <div className="overflow-hidden rounded-xl bg-black shadow-lg">
                    <img
                        src={event.cover_image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col gap-6">

                    {event.description && (

                        <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                            {event.description}
                        </p>

                    )}

                    <div className="flex flex-col gap-2 md:flex-row">

                        <div className="flex flex-col w-full max-w-md gap-3 rounded-xl border bg-gray-50 p-5 text-sm text-gray-700">

                            <div className="flex items-center gap-3">
                                <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                                {formatDateBR(event.date)}
                            </div>

                            <div className="flex items-center gap-3">
                                <MapPinIcon className="h-5 w-5 text-red-500" />
                                {event.location}
                            </div>

                            <div className="flex items-center gap-3 font-medium text-gray-800">
                                <BanknotesIcon className="h-5 w-5 text-green-500" />
                                {event.price ? formatCurrency(event.price) : "Gratuito"}
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg border">

                            <iframe
                                title="Mapa do evento"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&z=14&output=embed`}
                                className="h-[250px] w-full border-0"
                                loading="lazy"
                            />

                        </div>
                    </div>


                    <div className="mt-auto flex gap-2">

                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600"
                            onClick={handleShare}
                        >
                            <ShareIcon className="h-5 w-5" />
                            Compartilhar
                        </button>

                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                            onClick={() =>
                                navigator.clipboard.writeText(window.location.href)
                            }
                        >
                            <ShareIcon className="h-5 w-5" />
                            Copiar link
                        </button>

                    </div>

                </div>

            </div>

            {/* TIMES */}

            {eventTeams.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Jogadores inscritos
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">

                        {eventTeams.map((team: Team) => {

                            const teamPlayers = playersByTeam[team.id] || [];
                            const teamLimit = teamLimits[team.id] || 0;
                            const remaining = teamLimit - teamPlayers.length;

                            return (

                                <div
                                    key={team.id}
                                    className="flex flex-col gap-3 rounded-xl border bg-white p-5 shadow-sm"
                                >

                                    <div className="flex justify-between">

                                        <h3 className="font-semibold text-gray-800">
                                            {team.name}
                                        </h3>

                                        <span className="text-xs text-gray-500">
                                            {teamPlayers.length}/{teamLimit}
                                        </span>

                                    </div>

                                    <div className="flex flex-col gap-1 text-sm">

                                        {teamPlayers.length === 0 && (
                                            <span className="italic text-gray-400">
                                                Nenhum jogador ainda
                                            </span>
                                        )}

                                        {teamPlayers.map((player) => (

                                            <div
                                                key={player.id}
                                                className="flex justify-between rounded bg-gray-50 px-2 py-1"
                                            >

                                                <span>{player.name}</span>

                                                {player.airsoft_team && (
                                                    <span className="text-xs text-gray-400">
                                                        {player.airsoft_team}
                                                    </span>
                                                )}

                                            </div>

                                        ))}

                                    </div>

                                    {remaining > 0 && (
                                        <span className="text-xs text-green-600">
                                            +{remaining} vagas disponíveis
                                        </span>
                                    )}

                                    {remaining <= 0 && (
                                        <span className="text-xs text-red-500">
                                            Time completo
                                        </span>
                                    )}

                                </div>

                            );

                        })}

                    </div>
                </>
            )}

            {/* BOTÃO INSCRIÇÃO */}

            {hasEventEnded && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                    Este evento ja foi encerrado. As inscricoes nao estao mais disponiveis.
                </div>
            )}

            {!formMode && eventTeams.length > 0 && !hasEventEnded && (

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setFormMode(true)}
                >
                    Quero me inscrever
                </Button>

            )}

            {/* FORM */}

            {formMode && !hasEventEnded && (

                <div className="flex flex-col gap-6 rounded-xl border bg-white p-6 shadow-sm">

                    {errorMessage && (
                        <div className="rounded bg-red-100 p-3 text-sm text-red-600">
                            {errorMessage}
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded border px-4 py-3"
                    />

                    <input
                        type="text"
                        placeholder="Sua equipe (opcional)"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="rounded border px-4 py-3"
                    />

                    <select
                        value={teamId}
                        onChange={(e) => setTeamId(e.target.value)}
                        className="rounded border px-4 py-3"
                    >

                        <option value="">Selecione o time</option>

                        {eventTeams.map((team) => {

                            const teamPlayers = playersByTeam[team.id] || [];
                            const teamLimit = teamLimits[team.id] || 0;
                            const isFull = teamPlayers.length >= teamLimit;

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
                        loading={loading}
                        disabled={!teamId || !name.trim()}
                        onClick={handleRegister}
                    >
                        Confirmar inscrição
                    </Button>

                    <button
                        onClick={() => {
                            setFormMode(false);
                            setErrorMessage(null);
                        }}
                        className="text-sm text-gray-500"
                    >
                        Cancelar
                    </button>

                </div>

            )}

        </div>
    );
}
