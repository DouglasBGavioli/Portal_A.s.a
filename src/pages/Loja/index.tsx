import { useEffect } from "react";
import { useStore } from "../../contexts";
import { TitlePage } from "../../components/TitlePage";
import AnnouncementCard from "../../components/AnnouncementCard";

export default function Loja() {
  const { getStore, store } = useStore();

  useEffect(() => {
    getStore();
  }, [getStore]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
      <TitlePage title="Bem vindos a loja do time" subtitle="Compra e vendas de itens de airsoft" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {store?.map((item, index) => (
          <AnnouncementCard url={item.url?.[0]} value={item.value} item={item.text} key={index} contact={item.contact} />
        ))}
      </div>
    </div>
  );
}

