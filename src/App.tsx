import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "../router";
export default function App() {
  return <RouterProvider router={AppRoutes} />;
}
