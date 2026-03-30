import { TitlePage } from "../../components/TitlePage";
import {
  WrenchScrewdriverIcon,
  PhoneIcon,
  MapPinIcon,
  CheckBadgeIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

const armeiros = [
  {
    id: 1,
    name: "Douglas Gavioli Armeiro Airsoft",
    specialties: [
      "Manutenção de AEG's",
      "Manutenção de GBB's",
      "Manutenção de Snipers",
      "Pintura de Airsoft",
      "Upgrades de Airsoft"
    ],
    contact: "(55) 99993-3697",
    location: "Rua Independência, 2089 - Centro - Santiago - RS",
    description: "Manutenção e upgrades de Airsoft em geral.",
    image: "/douglas-gavioli.jpeg"
  }
];

export default function Armeiros() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 md:px-8">
      <TitlePage
        title="Armeiros"
        subtitle="Armeiros de Santiago-RS e região"
      />

      {/* INTRO SECTION */}
      <div className="flex flex-col gap-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 self-center rounded-full bg-brand-500/10 px-4 py-1 text-sm font-semibold text-brand-400 md:self-start">
          <ShieldCheckIcon className="h-4 w-4" />
          Serviços com Garantia
        </div>
      </div>

      {/* GRID OF CARDS */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {armeiros.map((armeiro) => (
          <div
            key={armeiro.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-brand-900 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-brand-500/10"
          >
            {/* CARD IMAGE HEADER */}
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <img
                src={armeiro.image}
                alt={armeiro.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* CARD BODY */}
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white line-clamp-1">
                    {armeiro.name}
                  </h3>
                  <CheckBadgeIcon className="h-5 w-5 shrink-0 text-brand-400" />
                </div>

                <div className="mt-2 flex items-start gap-2 text-xs text-gray-400">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  <span className="leading-relaxed">{armeiro.location}</span>
                </div>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-gray-300 line-clamp-3">
                {armeiro.description}
              </p>

              {/* SPECIALTIES TAGS */}
              <div className="mb-8 mt-auto flex flex-wrap gap-2">
                {armeiro.specialties.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-lg bg-brand-500/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-400 ring-1 ring-inset ring-brand-500/20"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* ACTION BUTTON */}
              <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Falar com Armeiro
                  </span>
                  <span className="text-sm font-bold text-white">
                    {armeiro.contact}
                  </span>
                </div>

                <a
                  href={`https://wa.me/55${armeiro.contact.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-green-500 active:scale-95 shadow-lg shadow-green-900/20"
                >
                  <PhoneIcon className="h-5 w-5" />
                  Abrir WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DISCLAIMER */}
      <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl bg-brand-950/50 p-6 border border-white/5">

        <p className="text-sm flex gap-2 leading-relaxed text-gray-400">
          <WrenchScrewdriverIcon className="h-6 w-6 shrink-0 text-brand-500" />
          <div> <strong>Atenção:</strong> A Associação Santiaguense de Airsoft (A.S.A) atua apenas na divulgação de profissionais parceiros.
            Qualquer negociação de valores, prazos e garantia é de responsabilidade exclusiva entre o cliente e o armeiro selecionado.</div>
        </p>
        <p className="text-sm leading-relaxed text-gray-400">
          Interessados em fazer parte do quadro de armeiros da A.S.A devem entrar em contato com o Douglas Gavioli pelo whatsapp.
        </p>

      </div>
    </div>
  );
}
