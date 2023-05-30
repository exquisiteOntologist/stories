import { combineReducers } from 'redux'
// import collections from './features/collectionsReducer'
// import { collectionsReducer } from './features/collectionsSlice'
import { contentsReducer } from './features/contentsSlice'
// import { contentBodiesReducer } from './features/contentBodiesSlice'
import { sourcesReducer } from './features/sourcesSlice'
import { themeReducer } from './features/themeSlice'

export default combineReducers({
    // collections: collectionsReducer,
    sources: sourcesReducer,
    contents: contentsReducer,
    // contentBodies: contentBodiesReducer,
    theme: themeReducer
})
