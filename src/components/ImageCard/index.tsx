import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type ImageCardProps = {
  url: string;
  evento?: string;
  data?: string;
  onClick?: () => void;
};

export default function ImageCard(props: ImageCardProps) {
  return (
    <div className="h-full w-full max-w-[320px] cursor-pointer overflow-hidden rounded-md max-[650px]:max-w-[350px]" onClick={props?.onClick}>
      <div className="h-[165px] w-full max-[650px]:h-[300px]">
        <img src={props.url} alt="Imagem da nossa história" className="h-full w-full rounded-t-md object-cover object-center" />
      </div>
      <div className="flex flex-col gap-1 rounded-b-md bg-brand-900 p-2">
        <h2 className="text-base font-semibold text-white">Evento: {props.evento}</h2>
        <p className="truncate text-sm text-white" title={`Data: ${format(parseISO(props.data!), "EEEE', 'dd' de 'MMMM 'de' Y", { locale: ptBR })}`}>
          Data: {format(parseISO(props.data!), "EEEE', 'dd' de 'MMMM 'de' Y", { locale: ptBR })}
        </p>
      </div>
    </div>
  );
}

