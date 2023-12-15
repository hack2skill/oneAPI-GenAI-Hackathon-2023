import Dashboard from "./views/Dashboard.js";
import Chat from "./views/Chat.js";
import Login from "./views/Login.js";
import Registers from "./views/Registers.js";
import Table from "./views/Table.js"
import Table3 from "./views/Table3";
import Table2 from "./views/Table2";
import ChatOne from './views/ChatOne.js'
import IPC from "./views/IPC.js";

const dashboardRoutes = [
  {
    upgrade: true,
    path: "/login",
    name: "Login / Register",
    icon: "nc-icon nc-alien-33",
    component: Login,
    layout: "/admin"
  },
  {
    upgrade: true,
    path: "/register",
    name: "Login / Register",
    icon: "nc-icon nc-alien-33",
    component: Registers,
    layout: "/admin"
  },
  {
    path: "/dashboard",
    name: "Case Whisper",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/ipc",
    name: "Indian Penal Code",
    icon: "nc-icon nc-pin-3",
    component: IPC,
    layout: "/admin"
  },
  {
    path: "/chat",
    name: "Chat",
    icon: "nc-icon nc-pin-3",
    component: Chat,
    layout: "/admin"
  },
  {
    path: "/cases/6",
    name: "Won Cases",
    icon: "nc-icon nc-pin-3",
    component: Table,
    layout: "/admin"
  },
  {
    path: "/cases/3",
    name: "Ongoing Cases",
    icon: "nc-icon nc-pin-3",
    component: Table2,
    layout: "/admin"
  },
  {
    path: "/cases/2",
    name: "Lost Cases",
    icon: "nc-icon nc-pin-3",
    component: Table3,
    layout: "/admin"
  },
  {
    path: "/summary",
    name: "",
    icon: "nc-icon nc-pin-3",
    component: ChatOne,
    layout: "/admin"
  }
];

export default dashboardRoutes;
