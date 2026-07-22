import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AdminAuthProvider } from "./context/AdminAuth";

export default function App() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
    </AdminAuthProvider>
  );
}
