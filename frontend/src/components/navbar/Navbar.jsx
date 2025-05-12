import "./Navbar.css";
import React, { useContext } from "react";
import { MyContext } from "../../App";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useContext(MyContext) || {};
  const navigate = useNavigate();

  // Kontrollera om användaren är inloggad
  const isLoggedIn = user.name && user.password && user.token;

  // Hantera utloggning
  const handleLogout = () => {
    setUser({ name: "", password: "", token: "" });
    navigate("/login");
  };

  const sendToHomePage = () => {
    navigate("/");
  };
  return (
    <nav className="navbar">
      <h2 className="logo" onClick={sendToHomePage}>
        Message HUB
      </h2>
      <ul className="nav-links">
        {isLoggedIn ? (
          <>
            <li>
              <NavLink
                to={`/allChannels`}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Alla Kanaler
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${user.userId}/createChannel`}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Skapa Kanal
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${user.userId}/yourChannels`}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Dina Kanaler
              </NavLink>
            </li>
             <li><NavLink to={`/${user.userId}/subscriptions`}>Dina Prenumerationer</NavLink></li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logga ut
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Logga in
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/signup"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Skapa konto
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
