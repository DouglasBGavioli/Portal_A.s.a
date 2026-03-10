import { useCallback, useEffect, useState, useRef } from "react";
import { compareAsc, parseISO } from "date-fns";

import { Gallery, GalleryImage, useImages } from "../../contexts";
import { Modal } from "../../components/Modal";
import { TitlePage } from "../../components/TitlePage";

import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

export default function History() {
  const { getMidias, gallery } = useImages();

  const [modalGallery, setModalGallery] = useState<Gallery>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galleryPosition, setGalleryPosition] = useState(1);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    getMidias();
  }, [getMidias]);

  const handleModal = useCallback((item: Gallery) => {
    setModalGallery(item);
    setIsModalOpen(true);
    setGalleryPosition(1);
  }, []);

  const changeImage = useCallback(
    (direction: "prev" | "next") => {
      const total = modalGallery?.images?.length || 0;

      if (direction === "prev" && galleryPosition > 1) {
        setGalleryPosition((prev) => prev - 1);
      }

      if (direction === "next" && galleryPosition < total) {
        setGalleryPosition((prev) => prev + 1);
      }
    },
    [galleryPosition, modalGallery]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;

    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) changeImage("next");
    if (distance < -50) changeImage("prev");
  };

  const galleryOrdenada = [...gallery].sort((a: Gallery, b: Gallery) => {
    const dataA = parseISO(a.data);
    const dataB = parseISO(b.data);
    return compareAsc(dataB, dataA);
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">

      <TitlePage title="Nossa história" subtitle="Galeria de jogos" />

      <p className="mb-8 max-w-2xl text-gray-600">
        Um pouco da nossa história registrada em jogos e eventos da equipe.
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {galleryOrdenada.map((item: Gallery) => {

          const cover =
            item.images
              ?.slice()
              .sort((a: GalleryImage, b: GalleryImage) => a.order - b.order)[0]
              ?.url;

          return (
            <div
              key={item.id}
              onClick={() => handleModal(item)}
              className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow transition hover:shadow-xl"
            >

              <div className="relative h-52 overflow-hidden">

                <img
                  src={cover}
                  alt={item.description}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-0 p-4 text-white">

                  <h3 className="text-lg font-semibold">
                    {item.description}
                  </h3>

                  <div className="flex justify-between text-xs opacity-80">

                    <span>{item.data}</span>

                    <span>{item.images.length} fotos</span>

                  </div>

                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        className="max-w-6xl"
        onRequestClose={() => setIsModalOpen(false)}
      >

        <div className="relative flex flex-col gap-4">

          {/* FECHAR */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute right-0 top-0 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h2 className="text-center text-xl font-semibold text-gray-800">
            {modalGallery?.description}
          </h2>

          {/* VISUALIZAÇÃO */}
          <div
            className="relative flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >

            <button
              onClick={() => changeImage("prev")}
              className="absolute left-2 z-10 rounded-full bg-black/60 p-2 text-white"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>

            <img
              src={modalGallery?.images?.[galleryPosition - 1]?.url}
              alt="Imagem da galeria"
              className="max-h-[70vh] w-full rounded-lg object-contain"
            />

            <button
              onClick={() => changeImage("next")}
              className="absolute right-2 z-10 rounded-full bg-black/60 p-2 text-white"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>

          </div>

          {/* CONTADOR */}
          <div className="text-center text-sm text-gray-500">
            {galleryPosition}/{modalGallery?.images?.length}
          </div>

          {/* MINIATURAS */}
          <div className="flex gap-2 overflow-x-auto pb-2">

            {modalGallery?.images?.map((img, index) => (

              <img
                key={index}
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setGalleryPosition(index + 1)}
                className={`h-16 w-24 cursor-pointer rounded-md object-cover border transition
                ${
                  galleryPosition === index + 1
                    ? "border-brand-500"
                    : "border-transparent"
                }`}
              />

            ))}

          </div>

        </div>

      </Modal>

    </div>
  );
}