import { useState } from "react";
import {
  HeartPulse,
  MessageSquare,
  Calendar,
  ChartBarBig,
  Building2,
  ClipboardList,
  FileUser,
  Contact,
  UserPlus,
  Send,
} from "lucide-react";

import { AtencionGeneral } from "../../atencion_general";
import { LimeTimeAtention } from "../../general_atention_linetime";
import ListaContactos from "./ListaContactos";
import ListaMensajes from "./ListaMensajes";
import Calendarios from "./Calendarios";
import InteractiveList from "./contactos";
import UserMenu from "./UserMenu";
import DataFetcher from "@/components/moleculas/dataFetcher";
import HistoryProcess from "@/components/HistoryProcess/historyProcess";
import TicketsSelectionCard from "@/components/Tickets/TicketsMenu";
import TareasSelectionCard from "@/components/Tickets/TareasMenu";
import { SucursalesData } from "../../sucursalesInfo";
import { TareaFormRegister } from "@/components/Tickets/RegistroRequerimiento";
import { ContactForm } from "@/components/Forms/contactForm";
import CampanasView from "@/components/campanas/CampanasView";
import UsersView from "@/components/Users/UsersView";
import { userApi } from "@/services/services";

const NAV_ITEMS = [
  { key: "usuarios", label: "usuarios", icon: UserPlus },
  { key: "atencion", label: "Atencion", icon: ChartBarBig },
  { key: "tiempo", label: "Tiempo", icon: MessageSquare },
  { key: "sucursales", label: "Sucursales", icon: Building2 },
  { key: "contactos", label: "Contactos", icon: Contact },
  // { key: "calendarios", label: "Calendarios", icon: Calendar },
  // { key: "Fetching", label: "Fetching", icon: FileSearchCorner },
  // { key: "Tickets", label: "Tickets", icon: Ticket },
  { key: "Chats", label: "Chats", icon: MessageSquare },
  { key: "Registros", label: "Generar Tickets", icon: FileUser },
  { key: "Tareas", label: "Tickets", icon: ClipboardList },
  { key: "Campanas", label: "Campañas", icon: Send },
];

const Dashboard = () => {
  const [seccion, setSeccion] = useState("Tareas");
  const [usuario, setUsuario] = useState(async () => {
    /*const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;*/
    const guardado = await userApi.dashboard();
    setUsuario(guardado);
    //return guardado ? JSON.parse(guardado) : null;;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-solid-head text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HeartPulse className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-display font-bold">
                  Clínica Internacional De La Visión De Ecuador
                </h1>
                <p className="text-white/80 text-sm">Panel de administración</p>
              </div>
            </div>
            <UserMenu nombre={usuario?.name} />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0">
          <nav className="py-6 px-3 space-y-1">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSeccion(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  seccion === key
                    ? "bg-[oklch(62.3%_0.214_259.815)] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenido */}
        <main className="flex-1 bg-gradient-to-br from-background via-white to-accent-light px-8 py-10">
          {seccion === "usuarios" && <UsersView />}
          {seccion === "atencion" && <AtencionGeneral />}
          {seccion === "tiempo" && <LimeTimeAtention />}
          {seccion === "sucursales" && <SucursalesData />}
          {seccion === "contactos" && <ContactView />}
          {/* {seccion === "calendarios" && <Calendarios />} */}
          {/* {seccion === "Fetching" && (
            <DataFetcher url={"https://jsonplaceholder.typicode.com/users"} />
          )} */}
          <br />
          {/* {seccion === "Tickets" && <TicketsSelectionCard />} */}
          {seccion === "Registros" && <TareaFormRegister />}
          {seccion === "Tareas" && <TareasSelectionCard />}
          {seccion === "Chats" && <ListaMensajes />}
          {seccion === "Campanas" && <CampanasView />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
