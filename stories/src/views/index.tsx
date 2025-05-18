import React from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, useLocation, useRoutes } from "react-router-dom";
import { AppHeader } from "../components/organisms/app-header";
import CollectionView from "../components/templates/collection";
import CollectionEditView from "../components/templates/collection-edit";
import CollectionSearchView from "../components/templates/collection-search";
import { selectColours } from "../redux/features/themeSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ReduxWrapper } from "../redux/redux-wrapper";
import { setBodyBackground } from "../utilities/graphics/colours";
import {
  routeCollectionView,
  routeSearch,
  routeSourcesEdit,
} from "../data/top-routes";
import { selectSession, ticker } from "../redux/features/sessionSlice";
import { useEffect } from "react";

const AppPageInner: React.FC = () => {
  const dispatch = useAppDispatch();
  const { ticking } = useAppSelector(selectSession);
  const colours = useAppSelector(selectColours);
  const elMainStyle: React.CSSProperties = {
    "--pixel-ratio": window?.devicePixelRatio || 1,
    "--primary": colours.primaryLightnessAdjusted,
    background: colours.backgroundLightnessAdjusted,
  } as React.CSSProperties;

  setBodyBackground(colours.backgroundLightnessAdjusted ?? undefined);

  const routerClassNames = "flex justify-center py-12 px-12 overflow-x-hidden";

  const element = useRoutes([
    {
      path: routeCollectionView,
      element: <CollectionView />,
    },
    {
      path: routeSearch,
      element: <CollectionSearchView />,
    },
    {
      path: routeSourcesEdit,
      element: <CollectionEditView />,
    },
  ]);

  const location = useLocation();

  useEffect(() => {
    if (!ticking) dispatch(ticker());
  }, [dispatch]);

  if (!element) return null;

  // scrollTo(0,0)

  return (
    <main
      className="w-screen flex flex-col min-h-screen overscroll-none transition-all duration-1000"
      style={elMainStyle}
    >
      <AppHeader location={location} />
      <div className={routerClassNames}>
        <AnimatePresence mode="wait">
          {React.cloneElement(element, { key: location.pathname })}
        </AnimatePresence>
      </div>
    </main>
  );
};

const AppView: React.FC = () => (
  <React.Fragment>
    <ReduxWrapper>
      <BrowserRouter>
        <AppPageInner />
      </BrowserRouter>
    </ReduxWrapper>
  </React.Fragment>
);

export default AppView;
