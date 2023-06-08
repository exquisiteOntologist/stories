import { combineReducers } from 'redux'
import { collectionsReducer } from './features/collectionsSlice'
import { collectionSettingsReducer } from './features/collectionSettingsSlice'
import { contentsReducer } from './features/contentsSlice'
import { contentBodiesReducer } from './features/contentBodiesSlice'
import { sourcesReducer } from './features/sourcesSlice'
import { themeReducer } from './features/themeSlice'
import { collectionToCollectionReducer } from './features/collectionToCollectionSlice'
import { navReducer } from './features/navSlice'
import { collectionToSourceReducer } from './features/collectionToSourceSlice'

export default combineReducers({
    collections: collectionsReducer,
    collectionSettings: collectionSettingsReducer,
    collectionToCollection: collectionToCollectionReducer,
    collectionToSource: collectionToSourceReducer,
    sources: sourcesReducer,
    contents: contentsReducer,
    contentBodies: contentBodiesReducer,
    nav: navReducer,
    theme: themeReducer
})
