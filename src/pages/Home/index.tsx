import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { compareAsc, parseISO } from "date-fns";

import { Alert } from "../../components/Alert";

import { useStore } from "../../contexts";
import { Gallery, GalleryImage, useImages } from "../../contexts";
import { useMessages } from "../../contexts";
import { useEvents } from "../../contexts/Eventos";

const buttonClass = "inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-600";

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { getStore, store } = useStore();
  const { getMidias, gallery } = useImages();
  const { events, players } = useEvents();

  const [alert, setAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const { sendMessage, data, setData } = useMessages();
  const navigate = useNavigate();

  useEffect(() => {
    getMidias();
    getStore();
  }, [getMidias, getStore]);

  const now = new Date();

  const activeEvent = events
    ?.filter((event) => new Date(event.date) >= now)
    ?.sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    )[0];

  const daysLeft = activeEvent
    ? Math.ceil(
      (new Date(activeEvent.date).getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : 0;

  const remainingSlots = activeEvent
    ? activeEvent.max_players -
    players.filter((p) => p.event_id === activeEvent.id).length
    : 0;

  const handleData = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData(prev => ({
      ...prev,
      [name]: value
    }));
  }, [setData]);

  const dataValidation = useCallback(() => {
    const values = Object.values(data);
    return !values.some((value) => value === undefined || value === null || value === "");
  }, [data]);

  const sendData = useCallback(async () => {
    const success = await sendMessage();

    if (success) {
      setAlert("success");
      setAlertMessage("Seu formulário foi enviado com sucesso!");
    } else {
      setAlert("error");
      setAlertMessage("Erro ao enviar seu formulário!");
    }

    setTimeout(() => {
      setAlert("");
    }, 2000);
  }, [sendMessage]);

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function formatPhoneNumber(phoneNumber: string): string {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    return cleanedNumber.replace(/(\d{3})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  const handleContactChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(event.target.value);

    setData(prev => ({
      ...prev,
      telefone: formattedNumber
    }));
  }, [setData]);

  const galleryOrdenada = [...(gallery || [])].sort((a: Gallery, b: Gallery) => {
    const dataA = parseISO(a.data);
    const dataB = parseISO(b.data);
    return compareAsc(dataB, dataA);
  });

  function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="w-full bg-[#f4f4f4] text-gray-800">
      <section
        className="relative flex h-[50vh] min-h-[460px] items-center justify-center bg-cover bg-center px-4"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex flex-col items-center gap-3 text-center text-white">
          <img src="/logo.png" alt="Logo elite" className="bg-black rounded-full mx-auto h-44 w-44 object-contain" />
          <h1 className="text-5xl font-bold tracking-wider md:text-7xl">A.S.A</h1>
          <h2 className="text-xl uppercase tracking-[0.35em] text-brand-400 md:text-2xl">Força e Honra</h2>
          <button onClick={scrollToSection} className={buttonClass}>Saiba Mais</button>
        </div>
      </section>

      <section ref={sectionRef} className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 md:px-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold uppercase text-brand-700">Sobre a equipe</h2>
          <h3 className="text-lg font-medium text-gray-500">Elite Team Airsoft</h3>
        </div>

        <div className="grid items-center gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-[220px_1fr]">
          <img src="/logo_elite.png" alt="Logo elite" className="mx-auto h-44 w-44 object-contain" />
          <div className="space-y-4 text-gray-700">
            <p className="flex items-start gap-3">
              <img src="/logo.png" alt="Logo asa" className="mt-2 h-10 w-10 object-contain" />
              Associação Santiaguense de Airsoft engloba o Elite Team Airsoft, equipe fundada em dezembro de 2019 por Cedenir Colpo na cidade de Santiago-RS, para prática de Airsoft.
            </p>
            <p>
              Utilizando como base simulações de ações militares (Milsim), o Elite Team Airsoft conta hoje com cerca de 20 jogadores. Seguindo os passos dos pioneiros do esporte levando sempre para campo os valores de honra, respeito, disciplina e amizade.
            </p>
          </div>
        </div>

        <span className="text-center text-sm italic text-gray-600">Fortitudine et disciplina, Elite Team virtutis exemplar est.</span>
      </section>

      {activeEvent && (
        <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-8">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-700">
              Próximo evento
            </h2>
          </div>

          <div
            onClick={() => navigate("/eventos")}
            className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
          >

            <div className="grid md:grid-cols-[330px_1fr]">

              {/* POSTER */}
              <div className="relative bg-black flex items-center justify-center">

                <img
                  src={activeEvent.cover_image}
                  alt={activeEvent.name}
                  className="h-[320px] w-full object-fit"
                />

                <div className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow uppercase">
                  {remainingSlots === 0 ? "Lotado" : "Inscrições abertas"}
                </div>

              </div>

              {/* INFOS */}
              <div className="flex flex-col justify-between p-6">

                <div className="flex flex-col gap-2">

                  <h3 className="text-2xl font-bold text-gray-800">
                    {activeEvent.name}
                  </h3>

                  <span className="text-sm text-gray-600">
                    📍 {activeEvent.location}
                  </span>

                  <span className="text-sm text-gray-600">
                    📅 {activeEvent.date}
                  </span>

                  <span className="text-sm text-gray-600">
                    💰 {formatCurrency(activeEvent.price)}
                  </span>

                </div>

                <div className="mt-6 flex flex-wrap gap-4">

                  <div className="rounded-lg bg-brand-50 px-4 py-3">
                    <p className="text-xs text-gray-500">Dias restantes</p>
                    <p className="text-lg font-bold text-brand-700">
                      {daysLeft}
                    </p>
                  </div>

                  <div className="rounded-lg bg-brand-50 px-4 py-3">
                    <p className="text-xs text-gray-500">Vagas restantes</p>
                    <p className="text-lg font-bold text-brand-700">
                      {remainingSlots}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>
      )}

      {((galleryOrdenada?.length || 0) > 0 || (store?.length || 0) > 0) && (
        <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-700">
              Atividade recente no portal
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* GALERIA */}
            {(galleryOrdenada?.length || 0) > 0 && (
              <div
                className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
                onClick={() => navigate("/galery")}
              >
                <h2 className="p-5 text-lg font-semibold text-gray-700">
                  Última galeria criada
                </h2>

                {galleryOrdenada && galleryOrdenada[0] && (
                  <div className="relative">

                    <img
                      src={
                        galleryOrdenada[0]?.images
                          ?.slice()
                          .sort((a: GalleryImage, b: GalleryImage) => a.order - b.order)[0]?.url
                      }
                      alt="Imagem da galeria"
                      className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />

                    <div className="absolute bottom-0 left-0 flex w-full flex-col gap-1 p-4 text-white">

                      <span className="text-xs uppercase tracking-wider text-brand-300">
                        Galeria
                      </span>

                      <h3 className="text-lg font-semibold">
                        {galleryOrdenada[0].description}
                      </h3>

                      <span className="text-sm opacity-80">
                        {galleryOrdenada[0].data}
                      </span>

                      <span className="mt-1 text-xs opacity-70">
                        {galleryOrdenada[0].images?.length} fotos
                      </span>

                    </div>

                  </div>
                )}
              </div>
            )}

            {/* LOJA */}
            {(store?.length || 0) > 0 && (
              <div
                className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
                onClick={() => navigate("/loja")}
              >
                <h2 className="p-5 text-lg font-semibold text-gray-700">
                  Último item anunciado
                </h2>

                {store && store[0] && (
                  <div className="relative">

                    <img
                      src={store[0].url}
                      alt="Imagem da loja"
                      className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />

                    <div className="absolute bottom-0 left-0 flex w-full flex-col gap-1 p-4 text-white">

                      <span className="text-xs uppercase tracking-wider text-brand-300">
                        Loja
                      </span>

                      <h3 className="text-lg font-semibold">
                        {store[0].text}
                      </h3>

                      <span className="text-sm">
                        {formatCurrency(Number(store[0].value))}
                      </span>

                    </div>

                  </div>
                )}
              </div>
            )}

          </div>
        </section>
      )}

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-12 md:px-8">

        <div className="rounded-xl bg-brand-900 p-6 text-white shadow">
          <h2 className="text-2xl font-bold uppercase">Código de honra</h2>
          <span className="text-sm text-brand-400">
            Associação Santiaguense de Airsoft
          </span>
        </div>

        {/* Conduta */}
        <div className="rounded-xl bg-white p-5 shadow md:grid md:grid-cols-[1fr_180px] md:items-center md:gap-6">

          <div>
            <div className="mb-3 flex items-start gap-3 md:block">
              <img
                src="/safe.png"
                alt="Safe"
                className="h-10 w-10 rounded-md object-cover md:hidden"
              />

              <div>
                <h2 className="text-lg font-bold text-brand-700 md:text-2xl">
                  Conduta em campo
                </h2>
                <p className="text-sm text-gray-600">
                  Minimizando risco de acidentes
                </p>
              </div>
            </div>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Óculos de proteção é equipamento obrigatório.</li>
              <li>Arma sempre travada e desmuniciada na safe zone.</li>
              <li>Manter o FPS da sua arma correspondente ao limite estipulado.</li>
              <li>Considerar uso de equipamentos diversos, capacete, coturno e joelheira.</li>
            </ul>
          </div>

          <img
            src="/safe.png"
            alt="Safe"
            className="mx-auto hidden h-40 w-40 rounded-lg object-cover md:block md:h-44 md:w-44"
          />
        </div>

        {/* Respeito */}
        <div className="rounded-xl bg-white p-5 shadow md:grid md:grid-cols-[180px_1fr] md:items-center md:gap-6">

          <img
            src="/respect.png"
            alt="Respeito"
            className="mx-auto hidden h-40 w-40 rounded-lg object-cover md:block md:h-44 md:w-44"
          />

          <div>
            <div className="mb-3 flex items-start gap-3 md:block">
              <img
                src="/respect.png"
                alt="Respeito"
                className="h-10 w-10 rounded-md object-cover md:hidden"
              />

              <h2 className="text-lg font-bold text-brand-700 md:text-2xl">
                Respeito e amizade
              </h2>
            </div>

            <p className="text-gray-700">
              O Airsoft é um esporte coletivo. O respeito e a seriedade são
              fundamentais para todos se divertirem e conviverem em harmonia.
            </p>
          </div>
        </div>

        {/* Honra */}
        <div className="rounded-xl bg-white p-5 shadow md:grid md:grid-cols-[1fr_180px] md:items-center md:gap-6">

          <div>
            <div className="mb-3 flex items-start gap-3 md:block">
              <img
                src="/honra.png"
                alt="Honra"
                className="h-10 w-10 rounded-md object-cover md:hidden"
              />

              <div>
                <h2 className="text-lg font-bold uppercase text-brand-700 md:text-2xl">
                  Jogue com honra
                </h2>
                <p className="text-sm text-gray-600">
                  O Airsoft necessita de um sistema de honra
                </p>
              </div>
            </div>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Se houver incerteza sobre ter sido atingido, saia do jogo.</li>
              <li>Se o oponente não se acusou, ele não está eliminado.</li>
              <li>Comportamentos desonestos devem ser informados ao comando.</li>
            </ul>
          </div>

          <img
            src="/honra.png"
            alt="Honra"
            className="mx-auto hidden h-40 w-40 rounded-lg object-cover md:block md:h-44 md:w-44"
          />
        </div>

        {/* Leis */}
        <div className="rounded-xl bg-white p-5 shadow md:grid md:grid-cols-[180px_1fr] md:items-center md:gap-6">

          <img
            src="/laws.png"
            alt="Leis"
            className="mx-auto hidden h-40 w-40 rounded-lg object-cover md:block md:h-44 md:w-44"
          />

          <div>
            <div className="mb-3 flex items-start gap-3 md:block">
              <img
                src="/laws.png"
                alt="Leis"
                className="h-10 w-10 rounded-md object-cover md:hidden"
              />

              <div>
                <h2 className="text-lg font-bold text-brand-700 md:text-2xl">
                  Respeito às leis
                </h2>
                <p className="text-sm text-gray-600">
                  Controle feito pelo Exército Brasileiro
                </p>
              </div>
            </div>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>Transporte em case de proteção e com nota fiscal.</li>
              <li>A ponta laranja é obrigatória.</li>
            </ul>
          </div>
        </div>

        {/* Documentos */}
        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-brand-700">
              Documentos do Recruta
            </h2>
            <span className="text-sm text-gray-500">
              Material obrigatório para novos integrantes
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://drive.google.com/file/d/1_KaephUv8DjEN-nuu_ojyre2rv2byw9V/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass}
            >
              Manual do Recruta
            </a>

            <a
              href="https://drive.google.com/file/d/1a3H9dYVjDrudRe-Z9d6GX044vwxzS0fn/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass}
            >
              Regulamento Interno
            </a>
          </div>
        </div>

      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 md:px-8">
        <div className="mb-3 flex items-start gap-3 md:block">
          <img
            src="/balanca.png"
            alt="Legislação"
            className="h-10 w-10 rounded-md object-cover md:hidden"
          />

          <div>
            <h2 className="text-lg font-bold uppercase text-brand-700 md:text-2xl">
              Legislação no airsoft
            </h2>
            <p className="text-sm text-gray-600">
              Exército Brasileiro
            </p>
          </div>
        </div>

        <div className="grid items-center gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-[220px_1fr]">
          <img
            src="/balanca.png"
            alt="Legislação"
            className="mx-auto hidden h-40 w-40 rounded-lg object-cover md:block md:h-44 md:w-44"
          />
          <div className="space-y-4 text-gray-700">
            <p>As regras para aquisição e importação de armas de pressão para airsoft no Brasil estão definidas na Portaria Nº 02 COLOG de 26 de fevereiro de 2010.</p>
            <p>Artigo 26 da Lei 10.826/03: são vedadas fabricação, venda, comercialização e importação de brinquedos, réplicas e simulacros que possam confundir com arma real.</p>
            <p>Para mais informações, acesse o site do EB: <a href="https://www.eb.mil.br" rel="noopener noreferrer" target="_blank" className="text-brand-600 hover:underline">www.eb.mil.br</a></p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-8">
        <div className="rounded-xl bg-white p-6 shadow">
          {alert === "success" ? <Alert variant="success" type="inline">{alertMessage}</Alert> : alert === "error" && <Alert variant="error" type="inline">{alertMessage}</Alert>}

          <div className="mb-6 mt-2">
            <h2 className="text-2xl font-bold text-brand-700">Contato para jogos</h2>
            <h3 className="mt-2 text-sm text-gray-600">Se interessou pela equipe e gostaria de participar de um jogo aberto a convidados?</h3>
            <h3 className="text-sm text-gray-600">Entre em contato conosco e aliste-se!</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <input type="text" name="nome" value={data.nome} placeholder="Digite seu nome*" onChange={handleData} className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-brand-500" />
              <input type="email" name="email" value={data.email} placeholder="Digite seu e-mail*" onChange={handleData} className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-brand-500" />
              <input type="tel" required value={data.telefone} placeholder="(055) 99999-9999" onChange={handleContactChange} className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-brand-500" />
              <input type="text" name="tempoPratica" value={data.tempoPratica} placeholder="A quanto tempo pratica o esporte*" onChange={handleData} className="rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-brand-500" />
            </div>
            <textarea name="mensagem" value={data.mensagem} placeholder="Deixe alguma mensagem*" onChange={(e) =>
              setData(prev => ({
                ...prev,
                mensagem: e.target.value
              }))
            } className="min-h-[190px] rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-brand-500" />
          </div>

          <button type="button" disabled={!dataValidation()} className={`${buttonClass} mt-5 disabled:cursor-not-allowed disabled:opacity-60`} onClick={sendData}>Enviar</button>
        </div>
      </section>
    </div>
  );
}
