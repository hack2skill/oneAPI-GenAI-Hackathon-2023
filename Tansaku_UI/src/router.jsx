import { createBrowserRouter, Navigate } from "react-router-dom";

import Home from "./Home.jsx";
import ViewProducts from "./ViewProducts.jsx";
import Search from "./Search.jsx";
import Layout from "./Layout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    name: "Layout",
    element: <Layout />,
    children: [
      {
        path: "/",
        name: "Home",
        element: <Home />,
      },
      {
        path: "/products",
        name: "Products",
        element: <ViewProducts />
      },
      {
        path: "/search",
        name: "Search",
        element: <Search />
      }
    ]
  }
  // {
  //   path: "/products/:id",
  //   name: "Product",
  //   element: <Product />
  // }
]);

export default router;
