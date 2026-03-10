import { useEffect } from "react";
import { TitlePage } from "../../components/TitlePage";
import ProgressBar from "../../components/ProgressBar";
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

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <TitlePage
        title="Integrantes"
        subtitle="Integrantes e suas respectivas patentes(baseadas na experiência adquirida dentro do Elite Team)"
      />
      <p className="text-base text-gray-600">
        As patentes não representam uma hierarquia dentro da equipe. Elas sao apenas uma forma de reconhecer o esforço e dedicação de cada membro.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {members
          ?.slice()
          .sort((a, b) => (a.level > b.level ? -1 : 1))
          ?.map((member, index) => (
            <div className="rounded-lg bg-white p-4 shadow" key={index}>
              <div className="flex gap-4">
                <div className="h-[220px] w-[160px] shrink-0 overflow-hidden rounded-md">
                  <img src={member.file} alt="Card" className="h-full w-full object-cover" />
                </div>
                <div className="flex w-full flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{member.name}</h2>
                      <a
                        className="text-sm text-brand-600 hover:underline"
                        href={`instagram://user?username=${member.insta.replace("@", "")}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `https://www.instagram.com/${member.insta.replace("@", "")}/`;
                        }}
                      >
                        {member.insta}
                      </a>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <img src={ArrayLevel[member?.level]?.img} alt={ArrayLevel[member.level]?.lvl} title={ArrayLevel[member.level]?.lvl} className="h-12 w-12 object-contain" />
                      <p className="text-xs font-semibold text-gray-700">{ArrayLevel[member.level]?.lvl}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-gray-700">XP</p>
                    <ProgressBar percentage={member.level === 4 ? 100 : member.xp} />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

