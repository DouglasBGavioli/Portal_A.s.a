import { useEffect, useMemo } from "react";
import { TitlePage } from "../../components/TitlePage";
import { useMembers } from "../../contexts";

const ArrayLevel = [
  { img: "./soldadon.png", lvl: "SD" },
  { img: "./cabo.png", lvl: "CB" },
  { img: "./sargento.png", lvl: "SGT" },
  { img: "./tenente.png", lvl: "TEN" },
  { img: "./capitao.png", lvl: "CAP" },
  { img: "./medalha-de-honra.png", lvl: "KIA" },
];

export default function Integrantes() {
  const { getMembers, members } = useMembers();

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const sortedMembers = useMemo(() => {
    return [...(members ?? [])].sort((a, b) => b.level - a.level);
  }, [members]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 md:px-8">

      <TitlePage
        title="Integrantes"
        subtitle="Integrantes e suas respectivas patentes (baseadas na experiência adquirida dentro do Elite Team)"
      />

      <p className="max-w-3xl text-base text-gray-600">
        As patentes não representam hierarquia. Elas reconhecem dedicação e
        experiência adquirida durante atividades e eventos da equipe.
      </p>

      {sortedMembers.length === 0 && (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-500">
            Nenhum integrante cadastrado no momento.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">

        {sortedMembers.map((member) => {

          const level = ArrayLevel[member.level] || ArrayLevel[0];

          return (
            <div
              key={member.id}
              className="relative flex items-center justify-center py-10"
            >

              {/* FOTO */}
              <div className="relative z-10 h-48 w-32 rotate-[-6deg] overflow-hidden rounded-xl border-[6px] border-gray-800 bg-gray-200 shadow-xl">

                <div className="absolute left-1/2 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-700"></div>

                <img
                  src={member.file || "/placeholder.png"}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />

              </div>

              {/* INFO */}
              <div className="relative -ml-6 flex h-52 w-40 rotate-[4deg] flex-col items-center justify-center rounded-xl border-[6px] border-gray-800 bg-gray-100 p-4 text-center shadow-xl">

                <div className="absolute left-1/2 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-700"></div>

                <h2 className="text-sm font-bold tracking-wider text-gray-800">
                  {member.name}
                </h2>

                <a
                  className="text-xs text-brand-600 hover:underline"
                  href={`https://www.instagram.com/${member.insta.replace("@", "")}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {member.insta}
                </a>

                <div className="mt-4 flex flex-col items-center">

                  <img
                    src={level.img}
                    alt={level.lvl}
                    className="h-14 w-14 object-contain"
                  />

                  <span className="mt-1 text-sm font-bold tracking-wider text-gray-800">
                    {level.lvl}
                  </span>

                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    Elite Team
                  </span>

                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}