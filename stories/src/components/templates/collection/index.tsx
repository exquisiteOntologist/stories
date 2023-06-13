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

const CollectionView: React.FC<CollectionViewProps> = ({customize, searchMode}) => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))
    const nestedCollections = useAppSelector(selectNestedCollections)
    const collectionSettings = useAppSelector(s => collectionSettingsSelectors.selectById(s, collectionId))
    const sources = useAppSelector(sourcesSelectors.selectAll)
    const contents = useAppSelector(selectContentOfCollection).slice(0, clientItemsLimit)
    const searchResults = useAppSelector(selectSearchResults)
    const sr = searchResults

    const [searchPhrase, setSearchPhrase] = React.useState<string>('')

    const title = customize ? 'edit' : (searchMode ? 'find' : 'hi')

    // console.log('collection', collectionId, collection)
    // console.log('collection settings', collectionSettings)
    // console.log('nested collections', nestedCollections)
    // console.log('collection to source maps', collectionToSources)
    
    useEffect(() => {
        dispatch(fetchCollection([collectionId]))
        dispatch(fetchSourcesOfCollection([collectionId]))
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchNestedCollections([collectionId]))
    }, [collection, collectionSettings])

    useEffect(() => {
        dispatch(fetchContent())
    }, [sources])

    useEffect(() => {
    }, [contents])

    useEffect(() => {
        dispatch(resetThemeColours())
    }, [dispatch])

    const showCollectionEditor = customize
    const viewIsList = collectionSettings?.layout === SettingsLayout.ROWS

    const collectionEditor = (
        <div className={`transition-all duration-0 ${showCollectionEditor ? 'opacity-1' : 'opacity-0'}`}>
            {/* <h2 className="text-2xl font-semibold mb-2">Customize</h2> */}
            <div className={`flex justify-start`}>
                <Button
                    label="Done"
                    Icon={IconTickCircle}
                    linkTo={`/`}
                />
                <Button 
                    label={`View as ${viewIsList ? 'Cards' : 'List'}`}
                    Icon={viewIsList ? IconGrid : IconList}
                    action={() => dispatch(setCollectionSettings({
                        ...collectionSettings,
                        layout: viewIsList ? 'CARDS' : 'ROWS'
                    } as CollectionSettings))}
                />
                <Button 
                    label="Add Widget"
                    Icon={IconAddCircle}
                    action={() => void 8}
                    disabled={true}
                />
                <Button
                    Icon={IconShapes}
                    label="Sources"
                    linkTo={`/edit`}
                />
            </div>
        </div>
    )

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

    const topActionSet = searchMode ? collectionSearcher : collectionEditor

    const emptyCollectionMessage = (!nestedCollections.length && !contents.length) ? (
        <div>
            <h3 className='text-2xl font-semibold mb-2 text-current'>Add Something to <span className="text-yellow-500">{collection?.name}</span>?</h3>
            <p className="text-current mb-6">This collection is empty. There are no sources &amp; no nested collections.</p>
            <div className="flex">
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} linkTo="/edit" label="Edit Sources"></Button>
            </div>
        </div>
    ) : null

    const nestedCollectionsRows = nestedCollections.map((nCollection) => (
        <ListingRow
            key={nCollection.id}
            id={nCollection.id}
            title={nCollection.name}
            action={() => dispatch(chooseCollection(nCollection.id))}
        />
    ))

    return (
        <>
            <div className="collection w-full max-w-7xl mx-4 h-min-content">
                <TitleCrumbs collectionId={collectionId} title={title} />
                <div className="mb-6">
                    {topActionSet} 
                </div>
                {emptyCollectionMessage}
                {
                    nestedCollectionsRows.length ? (
                        <div className="grid grid-cols-3 mb-12">
                            {nestedCollectionsRows}
                        </div>
                    ) : null
                }
                <ListingsContainerContent
                    view={collectionSettings?.layout as SettingsLayout}
                    contents={contents}
                    sources={sources}
                />
            </div>
        </>
    )
}

export default CollectionView
