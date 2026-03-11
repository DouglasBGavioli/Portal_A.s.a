import { useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";


import { TitlePage } from "../../components/TitlePage";
import Button from "../../components/Button";

import { useEvents, Team, Player } from "../../contexts/Eventos";

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

    const event = useMemo(() => {
        return events.find((e) => e.slug === slug);
    }, [events, slug]);

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString("pt-BR");
    }

    /* ============================= */
    /* CARREGAR DADOS DO EVENTO      */
    /* ============================= */

    useEffect(() => {
        if (event) {
            selectEvent(event);
        }
    }, [event, selectEvent]);

    /* ============================= */
    /* TIMES DO EVENTO               */
    /* ============================= */

    const eventTeams = useMemo(() => {
        if (!event) return [];
        return teams.filter((team) => team.event_id === event.id);
    }, [teams, event]);

    /* ============================= */
    /* PLAYERS POR TIME              */
    /* ============================= */

    const playersByTeam = useMemo<Record<string, Player[]>>(() => {
        return players.reduce((acc, player) => {
            if (!acc[player.team_id]) acc[player.team_id] = [];
            acc[player.team_id].push(player);
            return acc;
        }, {} as Record<string, Player[]>);
    }, [players]);

    /* ============================= */
    /* VAGAS POR TIME                */
    /* ============================= */

    const maxPlayersPerTeam =
        eventTeams.length > 0 && event
            ? Math.floor(event.max_players / eventTeams.length)
            : 0;

    /* ============================= */
    /* EVENTO NÃO ENCONTRADO         */
    /* ============================= */

    if (!event) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10">
                <p className="text-gray-600">Evento não encontrado.</p>
            </div>
        );
    }

    /* ============================= */
    /* INSCRIÇÃO                     */
    /* ============================= */

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

    /* ============================= */
    /* PAGE                          */
    /* ============================= */

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 md:px-8">

            <TitlePage title={event.name} subtitle="Detalhes do evento" />

            {/* HEADER EVENTO */}

            <div className="grid gap-8 md:grid-cols-[380px_1fr]">

                {/* POSTER */}

                <div className="overflow-hidden rounded-xl bg-black shadow-lg">
                    <img
                        src={event.cover_image}
                        alt={event.name}
                        className="w-full object-contain"
                    />
                </div>

                {/* INFO */}

                <div className="flex flex-col gap-6">

                    {event.description && (
                        <p className="text-gray-700 leading-relaxed">
                            {event.description}
                        </p>
                    )}

                    <div className="flex flex-col gap-3 rounded-xl border bg-gray-50 p-5 text-sm text-gray-700">

                        <div className="flex items-center gap-3">
                            <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
                            {formatDate(event.date)}
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPinIcon className="h-5 w-5 text-red-500" />
                            {event.location}
                        </div>

                        <div className="flex items-center gap-3 font-medium text-gray-800">
                            <BanknotesIcon className="h-5 w-5 text-green-500" />
                            R$ {event.price}
                        </div>

                    </div>
                    <div className="mt-auto inline-flex items-center gap-2 rounded-m">
                        <button className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
                            onClick={() => navigator.share({ url: window.location.href })}>
                            <ShareIcon className="h-5 w-5 text-white" />
                            Compartilhar evento
                        </button>
                        <button className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-600 transition" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert("Link copiado para a área de transferência!"))}>
                            <ShareIcon className="h-5 w-5 text-white" />
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
                            const remaining = maxPlayersPerTeam - teamPlayers.length;

                            return (

                                <div
                                    key={team.id}
                                    className="flex flex-col gap-3 rounded-xl border bg-white p-5 shadow-sm"
                                >

                                    <div className="flex items-center justify-between">

                                        <h3 className="font-semibold text-gray-800">
                                            {team.name}
                                        </h3>

                                        <span className="text-xs text-gray-500">
                                            {teamPlayers.length}/{maxPlayersPerTeam}
                                        </span>

                                    </div>

                                    {/* PLAYERS */}

                                    <div
                                        className={`flex flex-col gap-1 text-sm ${teamPlayers.length > 5
                                            ? "max-h-[160px] overflow-y-auto pr-1"
                                            : ""
                                            }`}
                                    >

                                        {teamPlayers.length === 0 && (
                                            <span className="italic text-gray-400">
                                                Nenhum jogador ainda
                                            </span>
                                        )}

                                        {teamPlayers.map((player) => (

                                            <div
                                                key={player.id}
                                                className="flex items-center justify-between rounded bg-gray-50 px-2 py-1"
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
                                        <span className="text-xs font-medium text-green-600">
                                            +{remaining} vagas disponíveis
                                        </span>
                                    )}

                                    {remaining <= 0 && (
                                        <span className="text-xs font-medium text-red-500">
                                            Time completo
                                        </span>
                                    )}

                                </div>

                            );

                        })}

                    </div>
                </>
            )}

            {/* INSCRIÇÃO */}

            {!formMode && eventTeams.length > 0 && (

                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => setFormMode(true)}
                >
                    Quero me inscrever
                </Button>

            )}

            {formMode && (

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