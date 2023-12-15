import React, { useState, useEffect } from "react";
import { useLocation, Route, Switch, Link } from "react-router-dom";
import AdminNavbar from "../components/Navbars/AdminNavbar";
import Sidebar from "../components/Sidebar/Sidebar";
import routes from "../routes";

function Admin() {
  const [image, setImage] = useState("");
  const [color, setColor] = useState("black");
  const [hasImage, setHasImage] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  const location = useLocation();
  const mainPanel = React.useRef(null);
  const mainPanelStyle = {
    width: showSidebar ? '85%' : '100%'
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  useEffect(() => {
    // Your existing code for scrolling
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;

    if (window.innerWidth < 993 && document.documentElement.className.indexOf("nav-open") !== -1) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }

    // Check if the current route is '/admin/chat' and hide the sidebar
    setShowSidebar(location.pathname !== "/admin/summary");
  }, [location]);

  return (
    <>
      <div className={`wrapper ${showSidebar ? "" : "sidebar-hidden"}`}>
        {showSidebar && (
          <Sidebar color={color} image={hasImage ? "https://images.pexels.com/photos/7781900/pexels-photo-7781900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" : "https://images.pexels.com/photos/7781900/pexels-photo-7781900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} routes={routes} />
        )}
        <div className="main-panel" ref={mainPanel} style={mainPanelStyle}>
         {showSidebar && <AdminNavbar />}
         
          <div className="content">
          {location.pathname==='/admin/summary' &&
            <button onClick={toggleSidebar}>{showSidebar?"Hide ":"Show "} Menu</button>
        }
            <Switch>{getRoutes(routes)}</Switch>
          </div>

        </div>
      </div>
    </>
  );
}

export default Admin;
