import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, useLocation, useRoutes } from "react-router-dom";
import { AppHeader } from "../components/organisms/app-header";
import CollectionView from "../components/templates/collection";
import CollectionEditView from "../components/templates/collection-edit";
import CollectionSearchView from "../components/templates/collection-search";
import { selectColours } from "../redux/features/themeSlice";
import { useAppSelector } from "../redux/hooks";
import { ReduxWrapper } from "../redux/redux-wrapper";
import { setBodyBackground } from "../utilities/graphics/colours";
import { routeCollectionView, routeSearch, routeSourcesEdit } from "../data/top-routes";
import { Hero } from "../components/atoms/hero";

const AppPageInner: React.FC = () => {
    const colours = useAppSelector(selectColours);
    const elMainStyle: React.CSSProperties = {
        "--pixel-ratio": window?.devicePixelRatio || 1,
        "--primary": colours.primaryLightnessAdjusted,
        background: colours.backgroundLightnessAdjusted,
    } as React.CSSProperties;

    setBodyBackground(colours.backgroundLightnessAdjusted ?? undefined);

    // const routerClassNames = "flex justify-center py-12 overflow-x-hidden";
    const routerClassNames = "flex justify-center py-0 overflow-x-hidden";

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

    if (!element) return null;

    // scrollTo(0,0)

    return (
        <main className="w-screen flex flex-col min-h-screen overscroll-none transition-all duration-1000" style={elMainStyle}>
            <AppHeader location={location} />
            <Hero />
            <div className={routerClassNames}>
                <AnimatePresence mode="wait">{React.cloneElement(element, { key: location.pathname })}</AnimatePresence>
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
