import { ReactNode } from "react";
import { TitlePage } from "../../components/TitlePage";

function TopicSection({ title, subtitle, image, children }: { title: string; subtitle?: string; image: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-center gap-6 rounded-xl bg-white p-6 shadow md:grid-cols-[1fr_260px]">
      <div>
        <h2 className="text-2xl font-bold uppercase text-brand-700">{title}</h2>
        {subtitle && <p className="mb-3 mt-1 text-sm text-gray-500">{subtitle}</p>}
        <div className="space-y-2 text-gray-700">{children}</div>
      </div>
      <img src={image} alt={title} className="mx-auto h-48 w-48 object-contain" />
    </div>
  );
}

export default function Manutencao() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <TitlePage title="Manutenção" subtitle="Guia de manutenção básica e contato de armeiros da região" />

      <div className="space-y-6">
        <TopicSection title="Guia de manutenção básica" subtitle="Associação Santiaguense de Airsoft" image="/safe.png">
          <ul className="list-disc space-y-2 pl-5">
            <li>Óculos de proteção é equipamento obrigatório.</li>
            <li>Arma sempre travada e desmuniciada na safe zone.</li>
            <li>Manter o fps da sua arma correspondente com o limite estipulado.</li>
            <li>Considerar uso de equipamentos diversos, capacete, coturno e joelheira.</li>
          </ul>
        </TopicSection>

        <TopicSection title="Respeito e amizade" image="/respect.png">
          <p>O Airsoft é um esporte coletivo, você precisa de pelo menos uma pessoa para jogar contra. Portanto é fundamental o respeito e a seriedade, desta forma todos podem se divertir e conviver em harmonia.</p>
        </TopicSection>

        <TopicSection title="Jogue com honra" image="/honra.png">
          <p>O Airsoft necessita de um sistema de honra para registrar as eliminações, porém, devido a diversos fatores externos, como equipamentos e ambiente, é inviável garantir um registro completamente eficaz.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Se houver incerteza sobre ter sido atingido no Airsoft, considera-se que o jogador está \"morto\".</li>
            <li>Se você atingiu um oponente e ele não se acusou, ele não está morto até que o mesmo se acuse.</li>
            <li>Se alguém não está admitindo ser atingido, informe ao comando com tranquilidade e discrição.</li>
          </ul>
        </TopicSection>

        <TopicSection title="Respeito às leis" image="/laws.png">
          <p>O Exército Brasileiro é responsável pelo controle das armas de airsoft, que são consideradas produtos regulados.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Transportar em case de proteção, sem magazine, bateria e com nota fiscal.</li>
            <li>A ponta laranja é obrigatória e não deve ser removida.</li>
          </ul>
        </TopicSection>
      </div>
    </div>
  );
}
