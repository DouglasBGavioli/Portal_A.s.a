import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import { useEvents } from "../../contexts/Eventos";
import { getNextEvent } from "../../utils/eventHelpers";

const links = [
  { name: "Home", path: "/" },
  { name: "Eventos", path: "/eventos" },
  { name: "Galerias", path: "/galery" },
  { name: "Integrantes", path: "/integrantes" },
  { name: "Loja", path: "/loja" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { events } = useEvents();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  /* EVENTO MAIS PRÓXIMO */

  const nextEvent = useMemo(() => {
    return getNextEvent(events);
  }, [events]);

  const goToNextEvent = () => {
    if (!nextEvent) {
      navigate("/eventos");
      return;
    }

    navigate(`/evento/${nextEvent.slug}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-900/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">

        {/* TOP BAR */}
        <div className="grid h-[70px] grid-cols-[auto_1fr_auto] items-center gap-3">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex min-w-0 cursor-pointer items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="ASA"
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            />

            <div className="hidden min-w-0 flex-col sm:flex">
              <span className="truncate text-sm font-semibold text-white">
                Associação
              </span>

              <span className="truncate text-xs tracking-widest text-brand-400">
                SANTIAGUENSE DE AIRSOFT
              </span>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden justify-center sm:flex">
            <ul className="flex items-center gap-8">

              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`text-sm font-medium uppercase transition
                    ${
                      isActive(link.path)
                        ? "text-brand-400"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

            </ul>
          </nav>

          {/* ACTION AREA */}
          <div className="flex items-center justify-end gap-2">

            {/* CTA DESKTOP */}
            <button
              onClick={goToNextEvent}
              className="hidden items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 sm:flex"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              Próximo Evento
            </button>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center text-white sm:hidden"
            >
              {open ? (
                <XMarkIcon className="h-7 w-7" />
              ) : (
                <Bars3Icon className="h-7 w-7" />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`overflow-hidden transition-all duration-300 sm:hidden ${
          open ? "max-h-[420px]" : "max-h-0"
        }`}
      >
        <nav className="border-t border-white/10 bg-brand-900 px-6 py-6">
          <ul className="flex flex-col gap-5">

            {links.map((link) => (
              <li key={link.path} className="w-full">
                <Link
                  to={link.path}
                  className={`block w-full rounded-md px-2 py-2 text-lg uppercase transition
                  ${
                    isActive(link.path)
                      ? "bg-brand-500/20 text-brand-400"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

          </ul>

          {/* CTA MOBILE */}
          <button
            onClick={goToNextEvent}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 py-3 font-semibold text-white transition hover:bg-brand-400"
          >
            <CalendarDaysIcon className="h-5 w-5" />
            Próximo Evento
          </button>

        </nav>
      </div>
    </header>
  );
}
