import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import "./styles/global.scss";
// import "./styles.css";
import AppView from "./views";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
    <AppView />
  </React.StrictMode>
);
