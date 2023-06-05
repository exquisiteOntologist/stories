import { combineReducers } from 'redux'
import { collectionsReducer } from './features/collectionsSlice'
import { collectionSettingsReducer } from './features/collectionSettingsSlice'
import { contentsReducer } from './features/contentsSlice'
import { contentBodiesReducer } from './features/contentBodiesSlice'
import { sourcesReducer } from './features/sourcesSlice'
import { themeReducer } from './features/themeSlice'

export default combineReducers({
    collections: collectionsReducer,
    collectionSettings: collectionSettingsReducer,
    sources: sourcesReducer,
    contents: contentsReducer,
    contentBodies: contentBodiesReducer,
    theme: themeReducer
})
