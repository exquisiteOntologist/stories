import * as React from "react"
import { ReactNode } from "react"
import { Provider } from "react-redux"
import { store } from "./store"

export const ReduxWrapper: React.FC<{ children?: ReactNode }> = ({ children /* element */ }) => {
    // Instantiating store in `wrapRootElement` handler ensures:
    //  - there is fresh store for each SSR page
    //  - it will be called only once in browser, when React mounts
    // const store = configureStore()
    
    return (
        <Provider store={store}>{ children }</Provider>
    )
}

