import { Router, Location } from "@reach/router"
import * as React from "react"
import { AppHeader } from "../components/organisms/app-header";
import CollectionView from "../components/templates/collection"
import CollectionEditView from "../components/templates/collection-edit"
import CollectionSearchView from "../components/templates/collection-search";
import ReaderView from "../components/templates/reader"
import { selectColours } from "../redux/features/themeSlice"
import { useAppSelector } from "../redux/hooks"
import { ReduxWrapper } from "../redux/redux-wrapper"
import { setBodyBackground } from "../utilities/graphics/colours"

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

  return (
    <Location>
      {({ location }) => {
        scrollTo(0,0) // because router primary={true} scrolls down from top to nested path component
        return (
          <main className="w-screen flex flex-col min-h-screen overscroll-none transition-all duration-1000" style={elMainStyle}>
            <AppHeader location={location} />
            <Router location={location} className={routerClassNames} primary={false}>
                {/* <NotFound default /> */}
                {/* <CollectionView default /> */}
                <CollectionView path="/" />
                <CollectionView path="/customize" customize={true} />
                <CollectionSearchView path="/search" searchMode={true} />
                <CollectionEditView path="/edit" />
                {/* <CollectionEditView path="/:collectionId/edit" /> */}
                <ReaderView path="/reader/:contentId" />
                {/* <CollectionView path="/:collectionId" /> */}
            </Router>
          </main>
        )
      }}
    </Location>
  )
}

// note - access will be denied if API not running & registered in Auth0
const apiPath = `http://localhost:5001/api`
const apiAudience = `semblance-server`
const apiScopes: string = [
  'read:current_user',
  'update:current_user'
].join(' ')

const AppView: React.FC = () => (
  <React.Fragment>
    <ReduxWrapper>
      <AppPageInner />
    </ReduxWrapper>
  </React.Fragment>
)

export default AppView
