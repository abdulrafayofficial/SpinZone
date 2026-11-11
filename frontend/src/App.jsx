import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import ProductDetails from "./pages/product_detail.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/product/:id", element: <ProductDetails /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
