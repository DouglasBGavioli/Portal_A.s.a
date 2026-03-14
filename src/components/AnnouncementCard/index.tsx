import { formatCurrency } from "../../utils/formatCurrency";

type AnnouncementCardProps = {
  url: string;
  item?: string;
  contact: string;
  value?: number;
  onClick?: () => void;
};

export default function AnnouncementCard({
  url,
  item,
  contact,
  value,
  onClick,
}: AnnouncementCardProps) {

  const regex = /\D/g;
  const phone = contact.replace(regex, "");

  return (
    <div
      onClick={onClick}
      className="flex w-full max-w-[340px] flex-col overflow-hidden rounded-xl bg-white shadow transition hover:shadow-lg"
    >
      {/* Título */}
      {item && (
        <span className="line-clamp-2 bg-brand-500 px-3 py-2 text-sm font-semibold text-white">
          {item}
        </span>
      )}

      {/* Imagem */}
      <img
        src={url}
        alt={item || "Anúncio"}
        className="h-[250px] w-full object-cover object-center"
      />

      {/* Rodapé */}
      {(value || contact) && (
        <div className="flex items-center justify-between bg-brand-500 px-3 py-2 text-white">

          <div className="flex flex-col text-sm font-semibold leading-tight">
            {value && <span>{formatCurrency(value)}</span>}
            <span className="text-xs opacity-90">Tel: {contact}</span>
          </div>

          <a
            aria-label="Chat on WhatsApp"
            target="_blank"
            rel="noreferrer"
            href={`https://wa.me/55${phone}?text=Olá tenho interesse no seu produto (${item}) anunciado no site da A.S.A`}
            className="flex h-[42px] w-[42px] items-center justify-center"
          >
            <img
              src="/whatsapp_icon.png"
              alt="WhatsApp"
              className="h-9 w-9 transition hover:scale-110"
            />
          </a>

        </div>
      )}
    </div>
  );
}