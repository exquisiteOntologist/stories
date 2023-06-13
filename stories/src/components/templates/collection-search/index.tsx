import * as React from 'react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { fetchContent, selectContentOfCollection } from '../../../redux/features/contentsSlice'
import { ListingRow } from '../../molecules/listings/row'
import { fetchSourcesOfCollection, sourcesSelectors } from '../../../redux/features/sourcesSlice'
import { resetThemeColours } from '../../../redux/features/themeSlice'
import { Button, buttonClassesHollow } from '../../atoms/button'
import { IconGrid } from '../../atoms/icons/grid'
import { IconList } from '../../atoms/icons/list'
import { IconAddCircle } from '../../atoms/icons/add-circle'
import { IconShapes } from '../../atoms/icons/shapes'
import { IconTickCircle } from '../../atoms/icons/tick-circle'
import { collectionsSelectors, fetchCollection, fetchNestedCollections, selectNestedCollections } from '../../../redux/features/collectionsSlice'
import { collectionSettingsSelectors, setCollectionSettings } from '../../../redux/features/collectionSettingsSlice'
import { Collection, CollectionSettings, SettingsLayout } from '../../../data/chirp-types'
import { chooseCollection, selectCollectionId, selectHistory as selectHistoryIds } from '../../../redux/features/navSlice'
import { ListingsContainerContent } from '../../molecules/listings/listings-container-content'
import { IconSearch } from '../../atoms/icons/search'
import { LabelAdd } from '../../atoms/icons/label-add'
import { search, selectSearchResults } from '../../../redux/features/searchSlice'
import { debounce } from 'lodash'
import { TitleCrumbs } from '../../organisms/title-crumbs'

interface CollectionViewProps {
    collectionId?: number | string,
    customize?: boolean,
    searchMode?: boolean
}

const clientItemsLimit: number = 100

const CollectionSearchView: React.FC<CollectionViewProps> = ({customize, searchMode}) => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    const searchResults = useAppSelector(selectSearchResults)
    const sr = searchResults

    const [searchPhrase, setSearchPhrase] = React.useState<string>('')

    const title = customize ? 'edit' : (searchMode ? 'find' : 'hi')

    console.log('search results', searchResults)
    
    useEffect(() => {
        dispatch(fetchCollection([collectionId]))
    }, [dispatch])

    useEffect(() => {
        dispatch(resetThemeColours())
    }, [dispatch])

    const submitSearch = (e: React.FormEvent) => e.preventDefault()

    const dispatchSearch = debounce((phrase: string) => dispatch(search(phrase)), 150)

    const updateSearch = (phrase: string) => {
        setSearchPhrase(phrase)
        dispatchSearch(phrase)
    }

    const collectionSearcher = (
        <div className={`mb-12 ${searchMode ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150`}>
            <h2 className="text-2xl font-semibold mb-2">{/* Search */}&nbsp; {searchPhrase && (<span className="text-blue-500">&ldquo;{searchPhrase}&rdquo;</span>)} {/* <span className="inline-block ml-0 align-top"><LabelAdd /></span> */}</h2>
            <form className="flex mb-12" onSubmit={submitSearch}>
                <div className="relative w-full mr-2">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-blue-500 pointer-events-none"><IconSearch /></span>
                    <input className='block border border-slate-400 w-full mr-2 px-4 py-2 pl-12 bg-transparent rounded-full' type="text" placeholder="" autoFocus spellCheck="false" value={searchPhrase} onChange={e => updateSearch(e.currentTarget.value)} />
                </div>
                {/* <Button className={`${buttonClassesHollow} whitespace-nowrap`} action={() => console.log('pinning not yet supported :)')} label="Pin it" disabled={!searchPhrase}></Button> */}
            </form>
            <h2 className="text-xl font-semibold mt-6 mb-2"> <span className="text-green-500">{sr.sources.length}</span> Sources</h2>
            <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-red-500">{sr.collections.length}</span> Collections</h2>
            <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-orange-500">{sr.contents.length + sr.body_content_ids.length}</span> Articles</h2>
            <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-yellow-500">{sr.entity_people.length}</span> People</h2>
            <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-blue-500">{sr.entity_places.length}</span> Places</h2>
            <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-blue-500">{sr.entity_brands.length}</span> Brands</h2>
            <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-blue-500">{sr.entity_chemicals.length}</span> Chemicals</h2>
            <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-blue-500">{sr.entity_materials.length}</span> Materials</h2>
            <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-blue-500">{sr.entity_concepts.length}</span> Concepts</h2>
            <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-yellow-500">{sr.mean_temperament === 1 ? 'Neutral' : 'Bipolar'}</span> Temperament Overall</h2>
        </div>
    )

    return (
        <>
            <div className="collection w-full max-w-7xl mx-4 h-min-content">
                <TitleCrumbs collectionId={collectionId} title={title} />
                <div className="mb-6">
                    {collectionSearcher}
                </div>
            </div>
        </>
    )
}

export default CollectionSearchView
