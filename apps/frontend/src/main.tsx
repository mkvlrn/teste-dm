import "#/style.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "#/app/app";

const rootElement = document.querySelector("#root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
const theme = createTheme({
  fontFamily: "Roboto Condensed",
});

root.render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <App />
      <Notifications />
    </MantineProvider>
  </StrictMode>,
);
