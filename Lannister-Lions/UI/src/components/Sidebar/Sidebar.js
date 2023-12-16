import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

function Sidebar({ color, image, routes }) {
  const location = useLocation();

  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        style={{
          backgroundImage: "url(" + image + ")",
        }}
      />
      <div className="sidebar-wrapper">
        <div className="optum logo d-flex align-items-center justify-content-center">
          <a href="#" className="simple-text logo-mini mx-1">
          <div className="logo-img" style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
  <img
    src="https://i.postimg.cc/G2XCpJM2/Intel-logo.png"
    alt="..."
    style={{ height: "100%", width: "100%" }}
  />
</div>
          </a>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (!prop.redirect && prop.path!=="/register" && prop.path!=='/cases/6' && prop.path!=='/cases/2' && prop.path!=='/cases/3' && prop.path!=='/summary')
              return (
                <li
                  className={
                    prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path)
                  }
                  key={key}
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
              
                  >
                    <i className={prop.icon} />
                    {
                      localStorage.getItem("intelapi")&& prop.name=='Login / Register'?
                      <p>Logout</p>:<p>{prop.name}</p>
                    }
                    
                  </NavLink>
                </li>
              );
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
