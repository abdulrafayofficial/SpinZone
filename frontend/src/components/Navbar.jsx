import { Link } from "react-router";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        Spin<span>Zone</span>
      </Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
    </header>
  );
}
