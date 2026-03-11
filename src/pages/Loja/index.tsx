import { useEffect, useState } from "react";
import { useStore } from "../../contexts";
import { TitlePage } from "../../components/TitlePage";

export default function Loja() {
  const {
    getStore,
    store,
    files,
    setFiles,
    text,
    setText,
    value,
    setValue,
    contact,
    setContact,
    createAnnouncement,
  } = useStore();

  const [openForm, setOpenForm] = useState(false);

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

      <p className="mt-10 mb-6 max-w-3xl text-base text-gray-600">
        Equipamentos anunciados pelos membros da equipe.
      </p>

      {/* BOTÃO DROPDOWN */}
      <div className="mb-10">
        <button
          onClick={() => setOpenForm(!openForm)}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 font-semibold text-white transition hover:bg-brand-700"
        >
          {openForm ? "Fechar anúncio" : "Anunciar equipamento"}
        </button>

        {/* FORM */}
        {openForm && (
          <div className="mt-4 rounded-xl bg-white p-6 shadow">

            <div className="grid gap-4 md:grid-cols-2">

              {/* FOTO */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Foto
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFiles(e.target.files ? [e.target.files[0]] : [])
                  }
                  className="rounded border p-2 text-sm"
                />

                {files[0] && (
                  <img
                    src={URL.createObjectURL(files[0])}
                    alt={files[0].name}
                    className="mt-2 h-32 w-full rounded object-cover"
                  />
                )}
              </div>

              {/* DESCRIÇÃO */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Descrição
                </label>

                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ex: AK74U Cybergun full metal"
                  className="rounded border p-2 text-sm"
                />
              </div>

              {/* VALOR */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Valor
                </label>

                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Ex: 1200"
                  className="rounded border p-2 text-sm"
                />
              </div>

              {/* CONTATO */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  WhatsApp
                </label>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={contact}
                  onChange={(e) => {
                    const numbers = e.target.value.replace(/\D/g, "");

                    let formatted = numbers;

                    if (numbers.length > 2) {
                      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
                    }

                    if (numbers.length > 7) {
                      formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
                    }

                    setContact(formatted);
                  }}
                  placeholder="(55) 99999-9999"
                  className="rounded border p-2 text-sm"
                />
              </div>

            </div>

            <button
              onClick={createAnnouncement}
              className="mt-6 rounded-lg bg-brand-600 px-6 py-2 font-semibold text-white transition hover:bg-brand-700"
            >
              Enviar anúncio
            </button>

            <p className="mt-3 text-xs text-gray-500">
              O anúncio será revisado antes de aparecer na loja. E irá durar 30 dias.
            </p>
          </div>
        )}
      </div>

      {/* LISTA DE ITENS */}
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
              className="group relative overflow-hidden rounded-xl bg-black shadow transition hover:shadow-lg"
            >

              <img
                src={item.url}
                alt={item.text}
                className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

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
      <p className="mt-10 mb-6 max-w-3xl text-base text-gray-600">
        * A A.S.A não se responsabiliza por transações realizadas entre os membros. Use o campo de contato para negociar diretamente com o vendedor.
      </p>
    </div>
  );
}