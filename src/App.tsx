import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LayoutModeProvider } from "@/components/layout/LayoutModeProvider";
import { router } from "@/routes";

/**
 * App shell: the global providers that wrap every route.
 * (The <html>/<body> tags, the Inter font and the pre-paint theme script
 * live in index.html.)
 */
export default function App() {
  return (
    <ThemeProvider>
      <LayoutModeProvider>
        <RouterProvider router={router} />
        <ToastContainer theme="dark" />
      </LayoutModeProvider>
    </ThemeProvider>
  );
}
