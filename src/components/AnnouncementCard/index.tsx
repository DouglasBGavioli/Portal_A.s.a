type AnnouncementCardProps = {
  url: string;
  item?: string;
  contact: number;
  value?: string;
  onClick?: () => void;
};

export default function AnnouncementCard(props: AnnouncementCardProps) {
  function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const regex = /\D/g;

  return (
    <div className="flex h-full min-h-[365px] w-full max-w-[340px] flex-col max-[600px]:max-h-[300px] max-[600px]:max-w-[290px] max-[600px]:justify-center">
      <span className="line-clamp-2 max-h-[50px] rounded-t bg-brand-500 px-2 py-[6px] text-base font-semibold text-white">{props.item}</span>
      <img src={props.url} alt="Anúncio" className="h-full max-h-[250px] min-h-[250px] w-full max-w-[340px] object-cover object-center" />
      {(props.value || props.contact) && (
        <p className="flex h-full items-center justify-between overflow-hidden rounded-b bg-brand-500 px-2 py-1 text-base font-semibold text-white">
          <span>
            {formatCurrency(Number(props.value))}
            <br />Tel: {props.contact}
          </span>
          <a
            aria-label="Chat on WhatsApp"
            target="_blank"
            href={`https://wa.me//55${props.contact.toString().replace(regex, "")}?text=Olá tenho interesse no seu produto (${props.item}) anunciado no site da Divisão Urutu`}
            rel="noreferrer"
            className="flex h-[50px] w-[50px] items-center justify-center"
          >
            <img alt="Chat on WhatsApp" src="whatsapp_icon.png" className="h-10 w-10 transition-all hover:h-[43px] hover:w-[43px]" />
          </a>
        </p>
      )}
    </div>
  );
}

