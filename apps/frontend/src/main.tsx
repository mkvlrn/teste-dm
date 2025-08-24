import "#/style.css";
import { createTheme, MantineProvider } from "@mantine/core";
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
    </MantineProvider>
  </StrictMode>,
);
