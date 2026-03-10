import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`w-full bg-brand-900 transition-all duration-300 ${
        isMenuOpen ? "min-h-screen" : "h-[80px]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1920px] flex-row-reverse items-center justify-between sm:flex-row">

        {/* LOGO (ESCONDIDO NO MOBILE <640px) */}
        <div
          className="hidden cursor-pointer items-center gap-3 px-6 py-4 sm:flex sm:pl-10"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="Logo asa"
            className="bg-black rounded-full h-[50px] w-[50px] object-cover"
          />
        </div>

        {/* MENU DESKTOP (>=640px) */}
        <div className="hidden pr-10 sm:flex">
          <nav className="flex items-center">
            <ul className="flex list-none gap-10">

              <li>
                <Link
                  className="uppercase text-white transition-colors hover:text-brand-400"
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  className="uppercase text-white transition-colors hover:text-brand-400"
                  to="/eventos"
                >
                  Eventos
                </Link>
              </li>

              <li>
                <Link
                  className="uppercase text-white transition-colors hover:text-brand-400"
                  to="/galery"
                >
                  Galerias
                </Link>
              </li>

              <li>
                <Link
                  className="uppercase text-white transition-colors hover:text-brand-400"
                  to="/integrantes"
                >
                  Integrantes
                </Link>
              </li>

              <li>
                <Link
                  className="uppercase text-white transition-colors hover:text-brand-400"
                  to="/loja"
                >
                  Loja
                </Link>
              </li>

            </ul>
          </nav>
        </div>

        {/* MENU MOBILE (<640px) */}
        <div className="flex flex-col items-end sm:hidden">

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center p-6"
          >
            <img
              src="/menu.svg"
              alt="Menu"
              className="h-7 w-7 object-contain"
            />
          </button>

          <nav
            className={`${
              isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
            } w-full px-6 pb-8 transition-all duration-300`}
          >
            <ul className="flex list-none flex-col gap-6">

              <li>
                <Link
                  className="uppercase text-white transition-colors hover:text-brand-400"
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  className="uppercase text-white transition-colors hover:text-brand-400"
                  to="/eventos"
                >
                  Eventos
                </Link>
              </li>

              <li>
                <Link
                  className="uppercase text-white transition-colors hover:text-brand-400"
                  to="/galery"
                >
                  Galerias
                </Link>
              </li>

              <li>
                <Link
                  className="uppercase text-white transition-colors hover:text-brand-400"
                  to="/integrantes"
                >
                  Integrantes
                </Link>
              </li>

              <li>
                <Link
                  className="uppercase text-white transition-colors hover:text-brand-400"
                  to="/loja"
                >
                  Loja
                </Link>
              </li>

            </ul>
          </nav>

        </div>
      </div>
    </header>
  );
}