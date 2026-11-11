import { useParams } from "react-router";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function ProductDetails() {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <section className="section">
        <h2>Product Details</h2>
        <p>Product reference: {id}</p>
      </section>
      <Footer />
    </>
  );
}
