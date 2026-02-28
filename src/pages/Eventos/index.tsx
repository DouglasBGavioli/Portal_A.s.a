import { useEffect, useState } from "react";
import "./style.scss";
import { Modal } from "../../components/Modal";
import Button from "../../components/Button";
import { useEvents } from "../../contexts/Eventos";

export default function Eventos() {
    const {
        events,
        activeEvent,
        registrations,
        listenRegistrations,
        registerPlayer,
        loading,
    } = useEvents();

    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [formMode, setFormMode] = useState(false);
    const [name, setName] = useState("");
    const [teamId, setTeamId] = useState("");

    const selectedEvent = events.find((e) => e.id === selectedEventId);

    useEffect(() => {
        if (!selectedEventId) return;

        const unsubscribe = listenRegistrations(selectedEventId);
        return unsubscribe;
    }, [selectedEventId]);

    async function handleRegister() {
        if (!selectedEvent) return;

        const team = selectedEvent.teams.find((t) => t.id === teamId);
        if (!team) return;

        const result = await registerPlayer(selectedEvent.id, {
            name,
            teamId: team.id,
            teamName: team.name,
        });

        if (result.success) {
            setName("");
            setFormMode(false);
        } else {
            alert(result.message);
        }
    }

    return (
        <div className="dua-jogos">
            <h2 className="section-title">Evento Ativo</h2>

            {activeEvent && (
                <div
                    className="dua-event-card active"
                    onClick={() => setSelectedEventId(activeEvent.id)}
                >
                    <img src={activeEvent.image} alt={activeEvent.title} />
                    <div className="dua-event-card__content">
                        <h2>{activeEvent.title}</h2>
                        <span>
                            {activeEvent.date} • {activeEvent.location} •{" "}
                            {activeEvent.price}
                        </span>
                    </div>
                </div>
            )}

            <Modal
                isOpen={selectedEventId !== null}
                onRequestClose={() => {
                    setSelectedEventId(null);
                    setFormMode(false);
                }}
            >
                {selectedEvent && (
                    <>
                        <img
                            src={selectedEvent.image}
                            alt={selectedEvent.title}
                            className="dua-jogos__modal-image"
                        />

                        <h1>{selectedEvent.title}</h1>

                        <p className="subtitle">
                            {selectedEvent.date} • {selectedEvent.location} •{" "}
                            {selectedEvent.price}
                        </p>

                        {!formMode && (
                            <>
                                <div className="dua-jogos__teams">
                                    {selectedEvent.teams.map((team) => {
                                        const teamPlayers = registrations.filter(
                                            (r) => r.teamId === team.id
                                        );

                                        return (
                                            <div key={team.id} className="team">
                                                <h3 style={{ color: team.color }}>
                                                    {team.name} ({teamPlayers.length})
                                                </h3>
                                                <ul>
                                                    {teamPlayers.map((player) => (
                                                        <li key={player.id}>{player.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    onClick={() => setFormMode(true)}
                                >
                                    Quero me inscrever
                                </Button>
                            </>
                        )}

                        {formMode && (
                            <div className="dua-jogos__form">
                                <input
                                    type="text"
                                    placeholder="Seu nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                                <select
                                    value={teamId}
                                    onChange={(e) => setTeamId(e.target.value)}
                                >
                                    <option value="">Selecione o time</option>
                                    {selectedEvent.teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>

                                <Button
                                    variant="primary"
                                    fullWidth
                                    loading={loading}
                                    onClick={handleRegister}
                                >
                                    Confirmar inscrição
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
}