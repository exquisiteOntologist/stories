import { Router, Location, Redirect } from "@reach/router"
import * as React from "react"
import { AppHeader } from "../components/organisms/app-header";
import CollectionView from "../components/templates/collection"
import ReduxWrapper from "../redux/redux-wrapper";
// import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
// import { AppHeader } from "../../components/organisms/app-header"
// import CollectionView from "../../components/templates/collection"
// import CollectionEditView from "../../components/templates/collection-edit"
// import LoginView from "../../components/templates/login"
// import NotFound from "../../components/templates/not-found"
// import ReaderView from "../../components/templates/reader"
// import { selectColours } from "../../redux/features/themeSlice"
// import { useAppSelector } from "../../redux/hooks"
// import ReduxWrapper from "../../redux/redux-wrapper"
// import { setBodyBackground } from "../../utilities/graphics/colours"

// // The App itself has dynamic client-side routes, while the other pages are pure Gatsby
// const AppPageInner = () => {
//   const colours = useAppSelector(selectColours)
//   const elMainStyle: React.CSSProperties = {
//     "--pixel-ratio": window?.devicePixelRatio || 1,
//     "--primary": colours.primaryLightnessAdjusted,
//     background: colours.backgroundLightnessAdjusted
//   } as React.CSSProperties;

//   setBodyBackground(colours.backgroundLightnessAdjusted)

//   const { isAuthenticated } = useAuth0()
//   const routerClassNames = 'flex justify-center py-12 overflow-x-hidden'

//   return (
//     <Location>
//       {({ location }) => (
//         <main className="w-screen flex flex-col min-h-screen overscroll-none transition-all duration-1000" style={elMainStyle}>
//           <AppHeader location={location} />
//           {
//             isAuthenticated
//               ? <Redirect from="/login" to="/app" replace={true} noThrow={true} />
//               : <Redirect from="*" to="/app/login" replace={true} noThrow={true} />
//           }
//           {
//             isAuthenticated ? (
//               <Router basepath="/app" location={location} className={routerClassNames}>
//                 <ReaderView path="/reader/:contentId" />
//                 <CollectionEditView path="/:collectionId/edit" />
//                 <CollectionView path="/:collectionId" />
//                 <CollectionEditView path="/edit" />
//                 <CollectionView path="/" />
//                 <NotFound default />
//               </Router>
//             ) : (
//               <Router basepath="/app" location={location} className={routerClassNames}>
//                 <Redirect from="*" to="/app/login" replace={true} noThrow={true} />
//                 <LoginView path="/login" />
//               </Router>
//             )
//           }
//         </main>
//       )}
//     </Location>
//   )
// }

// // note - access will be denied if API not running & registered in Auth0
// const apiPath = `http://localhost:5001/api`
// const apiAudience = `semblance-server`
// const apiScopes: string = [
//   'read:current_user',
//   'update:current_user'
// ].join(' ')

// const AppPage: React.FC = () => (
//   <React.Fragment>
//     <ReduxWrapper>
//       <Auth0Provider
//         domain="dev-mhap18dww6biqkgq.au.auth0.com"
//         clientId="eVazCKf9vrYZYKpF89SSod32AIteeYie"
//         redirectUri={window.location.origin + '/app'}
//         audience={apiAudience}
//         scope={apiScopes}
//       >
//         <AppPageInner />
//       </Auth0Provider>
//     </ReduxWrapper>
//   </React.Fragment>
// )

const elMainStyle: React.CSSProperties = {
  "--pixel-ratio": window?.devicePixelRatio || 1,
  // "--primary": colours.primaryLightnessAdjusted,
  // background: colours.backgroundLightnessAdjusted
} as React.CSSProperties;

const AppView: React.FC = () => (
  <React.Fragment>
    <ReduxWrapper>
      <Location>
        {({ location }) => (
          <main className="w-screen flex flex-col min-h-screen overscroll-none transition-all duration-1000" style={elMainStyle}>
            <AppHeader location={location} />
            <div className="flex justify-center py-12 overflow-x-hidden">
              <CollectionView />
            </div>
          </main>
        )}
      </Location>
    </ReduxWrapper>
  </React.Fragment>
)

export default AppView
