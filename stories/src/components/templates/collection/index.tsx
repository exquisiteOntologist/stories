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
import { chooseCollection, selectCollectionId } from '../../../redux/features/navSlice'
import { ListingsContainerContent } from '../../molecules/listings/listings-container-content'
import { IconSearch } from '../../atoms/icons/search'
import { LabelAdd } from '../../atoms/icons/label-add'
import { search, selectSearchResults } from '../../../redux/features/searchSlice'
import { debounce } from 'lodash'
import { TitleCrumbs } from '../../organisms/title-crumbs'
import { H2, Light } from '../../atoms/headings'

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

    const emptyCollectionMessage = (!!collection && !nestedCollections.length && !contents.length) ? (
        <div>
            <H2>Add Something to <Light colour="yellow">{collection?.name}</Light></H2>
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
                    {collectionEditor} 
                </div>
                {emptyCollectionMessage}
                {
                    nestedCollectionsRows.length ? (
                        <div className="grid grid-cols-3 gap-4 mb-12">
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
