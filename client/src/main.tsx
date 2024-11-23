// import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RootLayout from "./layouts/RootLayout.tsx";
import { ThemeProvider } from "./lib/hook/useTheme.tsx";
import { SocketProvider } from "./lib/context/useSocketContext.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import App from "./App.tsx";
import { NuqsAdapter } from "nuqs/adapters/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <SocketProvider>
      <RootLayout>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
        <Toaster />
      </RootLayout>
    </SocketProvider>
  </ThemeProvider>
  // {/* </React.StrictMode> */}
);
