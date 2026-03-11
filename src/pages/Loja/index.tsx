import { useEffect } from "react";
import { useStore } from "../../contexts";
import { TitlePage } from "../../components/TitlePage";

export default function Loja() {
  const { getStore, store } = useStore();

  useEffect(() => {
    getStore();
  }, [getStore]);

  function formatCurrency(value?: number) {
    if (!value) return "";
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const regex = /\D/g;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">

      <TitlePage
        title="Loja do Time"
        subtitle="Compra e venda de equipamentos de airsoft"
      />

      
      <p className="mt-10 mb-10 max-w-3xl text-base text-gray-600">
        Equipamentos anunciados pelos membros da equipe.
      </p>

      {store.length === 0 && (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-500">
            Nenhum item anunciado no momento.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {store.map((item) => {
          if (!item || !item.url) return null;

          const phone = item.contact.replace(regex, "");

          return (
            <div
              key={item.id}
              className="group relative cursor-pointer overflow-hidden rounded-xl bg-black shadow transition hover:shadow-lg"
            >

              {/* IMAGEM */}
              <img
                src={item.url}
                alt={item.text}
                className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* INFO */}
              <div className="absolute bottom-0 left-0 flex w-full flex-col gap-1 p-4 text-white">

                <span className="text-xs uppercase tracking-wider text-brand-300">
                  Loja
                </span>

                <h3 className="text-lg font-semibold line-clamp-1">
                  {item.text}
                </h3>

                {item.value && (
                  <span className="text-sm font-medium">
                    {formatCurrency(item.value)}
                  </span>
                )}

                <div className="mt-1 flex items-center gap-3">

                  <span className="text-xs opacity-80">
                    Tel: {item.contact}
                  </span>

                  <a
                    href={`https://wa.me/55${phone}?text=Olá tenho interesse no item (${item.text}) anunciado no site da A.S.A`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-auto flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-xs font-semibold transition hover:bg-green-700"
                  >
                    WhatsApp
                  </a>

                </div>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}