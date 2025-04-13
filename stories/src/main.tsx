import React from "react";
import ReactDOM from "react-dom/client";
import AppView from "./views";
import "./styles/wind.css";
import "./styles/global.scss";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(duration);

dayjs.extend(relativeTime);

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "a few secs",
    m: "1min",
    mm: "%dmins",
    h: "1hr",
    hh: "%dhrs",
    d: "1d",
    dd: "%dd",
    M: "1m",
    MM: "%dm",
    y: "1yr",
    yy: "%dyrs",
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  //   <AppView />
  // </React.StrictMode>
  <AppView />,
);
