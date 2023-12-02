import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import ChatBot from "./components/ChatBot.jsx";

export default function Layout() {
  return (
      <Fragment>
          <div className="fixed bottom-0 right-0">
              <div className="flex space-x-4">
                  <ChatBot />
              </div>
          </div>
      <Header />
      <Outlet></Outlet>
    </Fragment>
  );
}
