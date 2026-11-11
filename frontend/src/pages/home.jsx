import { Link } from "react-router";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const categories = [
  { name: "Blades", description: "Allround to offensive plus" },
  { name: "Rubbers", description: "Inverted, pimples and anti" },
  { name: "Ready Rackets", description: "Match-ready for every level" },
  { name: "Balls", description: "40+ plastic competition balls" },
  { name: "Tables", description: "Indoor and outdoor tables" },
  { name: "Accessories", description: "Cases, nets, glue and more" },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <p className="hero-eyebrow">TABLE TENNIS STORE</p>
        <h1>Gear built for spin, speed and control.</h1>
        <p>
          Shop blades, rubbers, rackets, balls and tables from the brands
          trusted by players at every level.
        </p>
        <Link to="/signup" className="button">
          Get Started
        </Link>
      </section>
      <section className="section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.name}>
              {category.name}
              <small>{category.description}</small>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
