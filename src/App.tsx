import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import * as C from "./contexts";

import Footer from "./components/Footer";
import Home from "./pages/Home";
import History from "./pages/History";
import Integrantes from "./pages/Integrantes";
import Acervo from "./pages/Acervo";
import Manutencao from "./pages/Manutencao";
import Header from "./components/Header";
import Loja from "./pages/Loja";
import Eventos from "./pages/Eventos";
import Evento from "./pages/Evento";

/* ========================= */
/* PROVIDERS WRAPPER */
/* ========================= */

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <C.MembersProvider>
        <C.StoreProvider>
          <C.MidiasProvider>
            <C.LoaderProvider>
              <C.EventsProvider>
                <C.MessageProvider>
                  {children}
                </C.MessageProvider>
              </C.EventsProvider>
            </C.LoaderProvider>
          </C.MidiasProvider>
        </C.StoreProvider>
      </C.MembersProvider>
    </HelmetProvider>
  );
}

/* ========================= */
/* APP */
/* ========================= */

function App() {
  return (
    <BrowserRouter>
      <AppProviders>

        <div className="flex min-h-screen flex-col">
          <Header />

          <main className="flex-1">
            <Routes>
              <Route index element={<Home />} />
              <Route path="/galery" element={<History />} />
              <Route path="/integrantes" element={<Integrantes />} />
              <Route path="/acervo" element={<Acervo />} />
              <Route path="/loja" element={<Loja />} />
              <Route path="/manutencao" element={<Manutencao />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/evento/:slug" element={<Evento />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <Analytics />

      </AppProviders>
    </BrowserRouter>
  );
}

export default App;