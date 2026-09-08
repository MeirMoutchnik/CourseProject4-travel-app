import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem("token")),
  );

  useEffect(() => {
    const sync = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", sync);
    window.addEventListener("auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-changed", sync);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  }

  return (
    <nav className="site-nav">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/flights">Flights</Link>
      <Link to="/trains">Trains</Link>
      {isLoggedIn ? (
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
}
