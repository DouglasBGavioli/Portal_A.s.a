import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <C.MembersProvider>
        <C.StoreProvider>
          <C.MidiasProvider>
            <C.LoaderProvider>
              <C.EventsProvider>
                <C.MessageProvider>

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
                      </Routes>
                    </main>

                    <Footer />
                  </div>

                </C.MessageProvider>
              </C.EventsProvider>
            </C.LoaderProvider>
          </C.MidiasProvider>
        </C.StoreProvider>
      </C.MembersProvider>
    </BrowserRouter>
  );
}

export default App;