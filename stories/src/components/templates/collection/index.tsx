import * as React from 'react'
import { useEffect } from 'react'
import ListingsContainer from '../../molecules/listings/listings-container'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { fetchContent, selectContentOfCollection } from '../../../redux/features/contentsSlice'
import { ListingRow } from '../../molecules/listings/row'
import { fetchSourcesOfCollection, sourcesSelectors } from '../../../redux/features/sourcesSlice'
import { ListingCard } from '../../molecules/listings/card'
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

interface CollectionViewProps {
    collectionId?: number | string,
    customize?: boolean
}

const clientItemsLimit: number = 100

const CollectionView: React.FC<CollectionViewProps> = ({customize}) => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))
    const submergeHistoryIds = useAppSelector(selectHistoryIds)
    const submergeHistoryItems = useAppSelector(s => submergeHistoryIds.map(id => collectionsSelectors.selectById(s, id))).filter(x => typeof x !== 'undefined') as Collection[]
    const nestedCollections = useAppSelector(selectNestedCollections)
    const collectionSettings = useAppSelector(s => collectionSettingsSelectors.selectById(s, collectionId))
    const sources = useAppSelector(sourcesSelectors.selectAll)
    const contents = useAppSelector(selectContentOfCollection).slice(0, clientItemsLimit)

    const title = customize ? 'edit' : 'hi'

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
        dispatch(fetchCollection(submergeHistoryIds))
    }, [submergeHistoryIds])

    useEffect(() => {
        dispatch(resetThemeColours())
    }, [dispatch])

    const showCollectionEditor = customize
    const viewIsList = collectionSettings?.layout === SettingsLayout.ROWS

    const collectionEditor = (
        <div className="mb-6">
            <div className={`flex justify-start transition-all duration-0 ${showCollectionEditor ? 'opacity-1' : 'opacity-0'}`}>
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

    const emptyCollectionMessage = (!nestedCollections.length && !contents.length) && (
        <div>
            <h3 className='text-2xl font-semibold mb-2 text-current'>Add Something to <span className="text-yellow-500">{collection?.name}</span>?</h3>
            <p className="text-current mb-6">This collection is empty. There are no sources &amp; no nested collections.</p>
            <div className="flex">
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} linkTo="/edit" label="Edit Sources"></Button>
            </div>
        </div>
    )

    const nestedCollectionsRows = nestedCollections.map((nCollection) => (
        <ListingRow
            key={nCollection.id}
            id={nCollection.id}
            title={nCollection.name}
            action={() => dispatch(chooseCollection(nCollection.id))}
        />
    ))

    const contentRows = contents.map((content, cI) => (
        <ListingRow
            key={content.id}
            id={content.id}
            title={content.title}
            linkUrl={content.url}
            content={content}
            source={sources?.find(s => s?.id == content.source_id)}
        />
    ))

    const contentCards = contents.map((content, cI) => (
        <ListingCard
            key={content.id}
            id={content.id}
            title={content.title}
            linkUrl={content.url}
            content={content}
            source={sources?.find(s => s?.id == content.source_id)}
        />
    ))

    const historyItems = submergeHistoryItems.map(hi => {
        const last = collectionId === hi.id
        const colour = last ? 'text-yellow-500' : 'inherit'
        return (
            <span key={hi.id} className={`text-current cursor-pointer mr-3 ${colour}`} onClick={() => dispatch(chooseCollection(hi.id))}>
                {hi.name}
            </span>
        )
    })

    return (
        <>
            <div className="collection w-full max-w-7xl mx-4 h-min-content">
                <hgroup className="mb-24">
                    <h1 className="text-4xl font-semibold">{title}</h1>
                    <h2 className="text-2xl font-semibold select-none">
                        {historyItems}
                    </h2>
                </hgroup>
                {collectionEditor}
                {emptyCollectionMessage}
                {
                    nestedCollectionsRows.length && (
                        <div className="grid grid-cols-3 mb-12">
                            {nestedCollectionsRows}
                        </div>
                    )
                }
                {
                    viewIsList
                        ? (
                            <ListingsContainer view='Rows'>
                                {contentRows}
                            </ListingsContainer>
                        ) : (
                            <ListingsContainer view='Cards'>
                                {contentCards}
                            </ListingsContainer>
                        )
                }
            </div>
        </>
    )
}

export default CollectionView
