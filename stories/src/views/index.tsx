// import { Router, Location } from "@reach/router"
import * as React from "react"
import { AnimatePresence, motion } from "framer-motion";
import { BrowserRouter, useLocation, useRoutes } from "react-router-dom";
import { AppHeader } from "../components/organisms/app-header";
import CollectionView from "../components/templates/collection"
import CollectionEditView from "../components/templates/collection-edit"
import CollectionSearchView from "../components/templates/collection-search";
import ReaderView from "../components/templates/reader"
import { selectColours } from "../redux/features/themeSlice"
import { useAppSelector } from "../redux/hooks"
import { ReduxWrapper } from "../redux/redux-wrapper"
import { setBodyBackground } from "../utilities/graphics/colours"
import { motionProps } from "../utilities/animate";

const Wrap: React.FC<{children: React.ReactElement}> = ({ children }) => (
  <motion.div
      {...motionProps}
  >{children}</motion.div>
)


// The App itself has dynamic client-side routes, while the other pages are pure Gatsby
const AppPageInner = () => {
  const colours = useAppSelector(selectColours)
  const elMainStyle: React.CSSProperties = {
    "--pixel-ratio": window?.devicePixelRatio || 1,
    "--primary": colours.primaryLightnessAdjusted,
    background: colours.backgroundLightnessAdjusted
  } as React.CSSProperties;

  setBodyBackground(colours.backgroundLightnessAdjusted ?? undefined)

  const routerClassNames = 'flex justify-center py-12 overflow-x-hidden'

  const element = useRoutes([
    {
      path: "/",
      element: <CollectionView /> // <Wrap><CollectionView /></Wrap>
    },
    {
      path: "/search",
      element: <CollectionSearchView /> // <Wrap><CollectionSearchView /></Wrap>
    },
    {
      path: "/edit",
      element: <CollectionEditView /> // <Wrap><CollectionEditView /></Wrap>
    }
  ]);

  const location = useLocation();

  if (!element) return null

  // scrollTo(0,0)

  return (    
    
      <main className="w-screen flex flex-col min-h-screen overscroll-none transition-all duration-1000" style={elMainStyle}>
        <AppHeader location={location} />
        <div className={routerClassNames}>
          <AnimatePresence mode="wait">
            {React.cloneElement(element, { key: location.pathname })}
          </AnimatePresence>
        </div>
      </main>
  )
}


const AppView: React.FC = () => (
  <React.Fragment>
    <ReduxWrapper>
      <BrowserRouter>
        <AppPageInner />
      </BrowserRouter>
    </ReduxWrapper>
  </React.Fragment>
)

export default AppView
