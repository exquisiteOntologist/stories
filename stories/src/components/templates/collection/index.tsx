import * as React from 'react'
import { useEffect } from 'react'
import ListingsContainer from '../../molecules/listings/listings-container'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { contentsSelectors, fetchContent } from '../../../redux/features/contentsSlice'
import { ListingRow } from '../../molecules/listings/row'
import { fetchSourcesOfCollection, sourcesSelectors } from '../../../redux/features/sourcesSlice'
import { ListingCard } from '../../molecules/listings/card'
import { resetThemeColours } from '../../../redux/features/themeSlice'
import { Button } from '../../atoms/button'
import { IconGrid } from '../../atoms/icons/grid'
import { IconList } from '../../atoms/icons/list'
import { IconAddCircle } from '../../atoms/icons/add-circle'
import { IconShapes } from '../../atoms/icons/shapes'
import { IconTickCircle } from '../../atoms/icons/tick-circle'
import { collectionsSelectors, fetchCollection, fetchNestedCollections } from '../../../redux/features/collectionsSlice'
import { collectionSettingsSelectors, setCollectionSettings } from '../../../redux/features/collectionSettingsSlice'
import { CollectionSettings, SettingsLayout } from '../../../data/chirp-types'
import { collectionToCollectionSelectors } from '../../../redux/features/collectionToCollectionSlice'

interface CollectionViewProps {
    collectionId?: number | string,
    customize?: boolean
}

const clientItemsLimit = 100

const CollectionView: React.FC<CollectionViewProps> = ({customize}) => {
    const dispatch = useAppDispatch()

    const collectionId: number = 0 // 0 is the root collection (seeded on Rust lib init)

    // @TODO: List collections in this collection view in addition to sources/contents
    // const collections = useAppSelector(collectionsSelectors.selectAll)
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))
    const nestedCollectionIds = useAppSelector(s => collectionToCollectionSelectors.selectAll(s)).filter(cToC => cToC.collection_parent_id === collectionId).map(ncm => ncm.collection_inside_id)
    const nestedCollections = useAppSelector(s => collectionsSelectors.selectAll(s).filter(c => nestedCollectionIds.includes(c.id)))
    const collectionSettings = useAppSelector(s => collectionSettingsSelectors.selectById(s, collectionId))
    const sources = useAppSelector(sourcesSelectors.selectAll)
    const contents = useAppSelector(contentsSelectors.selectAll).slice(0, clientItemsLimit)

    const title = customize ? 'edit' : 'hi'

    console.log('collection', collection)
    console.log('collection settings', collectionSettings)
    console.log('nested collections', nestedCollections)
    
    useEffect(() => {
        // TODO: Replace with fetch_sources_of_collection, with default id as 0 (top-level/all)
        dispatch(fetchCollection([collectionId]))
        dispatch(fetchSourcesOfCollection([collectionId]))
        dispatch(fetchNestedCollections([collectionId]))
    }, [dispatch])

    useEffect(() => {
        // console.log('source ids in use effect', sources)
        dispatch(fetchContent())
    }, [sources])

    useEffect(() => {
        // console.log('contents for given sources in view', contents)
    }, [contents])

    useEffect(() => {
        dispatch(resetThemeColours())
    }, [dispatch])

    const showCollectionEditor = customize
    const viewIsList = collectionSettings?.layout === SettingsLayout.ROWS

    const collectionEditor = (
        <div className="mb-6">
            {/* <h3 className="text-1xl font-semibold">Edit Collection</h3> */}
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
                    // linkTo={`${location.pathname}/edit`}
                    linkTo={`/edit`}
                />
            </div>
        </div>
    )

    const contentRows = contents.map((content, cI) => (
        <ListingRow
            key={content.id}
            id={content.id}
            title={content.title}
            linkUrl={content.url /* `/reader/${content.id}` */}
            content={content}
            source={sources?.find(s => s?.id == content.source_id)}
        />
    ));

    const contentCards = contents.map((content, cI) => (
        <ListingCard
            key={content.id}
            id={content.id}
            title={content.title}
            linkUrl={content.url /* `/reader/${content.id}` */}
            content={content}
            source={sources?.find(s => s?.id == content.source_id)}
        />
    ))

    return (
        <>
            <div className="collection w-full max-w-7xl mx-4 h-min-content">
                <hgroup className="mb-24">
                    <h1 className="text-4xl font-semibold">{title}</h1>
                    <h2 className="text-2xl font-semibold"><span className="text-yellow-500">{collection?.name}</span></h2>
                </hgroup>
                {collectionEditor}
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
