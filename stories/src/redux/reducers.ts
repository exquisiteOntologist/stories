import { combineReducers } from "redux";
import { collectionSettingsReducer } from "./features/collectionSettingsSlice";
import { collectionToCollectionReducer } from "./features/collectionToCollectionSlice";
import { collectionToSourceReducer } from "./features/collectionToSourceSlice";
import { collectionsReducer } from "./features/collectionsSlice";
import { contentBodiesReducer } from "./features/contentBodiesSlice";
import { contentsReducer } from "./features/contentsSlice";
import { marksReducer } from "./features/marksSlice";
import { navReducer } from "./features/navSlice";
import { searchReducer } from "./features/searchSlice";
import { sourcesReducer } from "./features/sourcesSlice";
import { themeReducer } from "./features/themeSlice";
import { phrasesReducer } from "./features/phrasesSlice";
import { collectionToPhraseReducer } from "./features/collectionToPhraseSlice";

export default combineReducers({
    collectionSettings: collectionSettingsReducer,
    collectionToCollection: collectionToCollectionReducer,
    collectionToPhrase: collectionToPhraseReducer,
    collectionToSource: collectionToSourceReducer,
    collections: collectionsReducer,
    contentBodies: contentBodiesReducer,
    contents: contentsReducer,
    marks: marksReducer,
    nav: navReducer,
    phrases: phrasesReducer,
    search: searchReducer,
    sources: sourcesReducer,
    theme: themeReducer,
});
