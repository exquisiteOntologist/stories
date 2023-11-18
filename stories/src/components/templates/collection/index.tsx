import * as React from 'react'
import { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { contentsSelectors, fetchContent, fetchContentOfSources, selectContentOfCollection } from '../../../redux/features/contentsSlice'
import { fetchSourcesOfCollection, sourcesSelectors } from '../../../redux/features/sourcesSlice'
import { resetThemeColours } from '../../../redux/features/themeSlice'
import { collectionsSelectors, fetchCollection, fetchNestedCollections, selectNestedCollections } from '../../../redux/features/collectionsSlice'
import { collectionSettingsSelectors } from '../../../redux/features/collectionSettingsSlice'
import { ContentDto, SettingsLayout } from '../../../data/chirp-types'
import { chooseCollection, selectCollectionId, selectIsCustomizing } from '../../../redux/features/navSlice'
import { ListingsContainerContent } from '../../molecules/listings/listings-container-content'
import { TitleCrumbs } from '../../organisms/title-crumbs'
import { ListingsContainerCollections } from '../../molecules/listings/listings-container-collections'
import { CollectionCustomizer } from '../../organisms/collection-customizer'
import { CollectionViewProps } from './interface'
import { motionProps } from '../../../utilities/animate'
import { CollectionEmptyMessage } from '../../organisms/collection-empty-message';
import { selectNestedSourceIds } from '../../../redux/features/collectionToSourceSlice';

const clientItemsLimit: number = 100
const time = (s: string): number => new Date(s).getTime()
const sortContentPublished = (cA: ContentDto, cB: ContentDto) => time(cB.date_published) - time(cA.date_published)
// in the event multiple items have same date, but not fetched together, you could append id to time string in comparison
const sortId = (cA: ContentDto, cB: ContentDto) => cB.id - cA.id

const CollectionView: React.FC<CollectionViewProps> = () => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))
    const nestedCollections = useAppSelector(selectNestedCollections)
    const collectionSettings = useAppSelector(s => collectionSettingsSelectors.selectById(s, collectionId))
    // these source selectors assume that the sources store only has the current sources
    const sources = useAppSelector(sourcesSelectors.selectAll)
    const sourceIds = useAppSelector(selectNestedSourceIds)
    const contents = useAppSelector(selectContentOfCollection).sort(sortContentPublished).slice(0, clientItemsLimit)
    const isCustomizing = useAppSelector(selectIsCustomizing);
    const [doRefresh, setDoUpdate] = useState<boolean>(true)
    const [contentsVisible, setContentsVisible] = useState<ContentDto[]>([])
    const [filteringCollectionId, setFilteringCollectionId] = useState<number | null>(null)

    const title = isCustomizing ? 'edit' : 'hi'
    
    useEffect(() => {
        dispatch(fetchCollection([collectionId]))
        dispatch(fetchSourcesOfCollection([collectionId]))
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchNestedCollections([collectionId]))
    }, [collection, collectionSettings])

    useEffect(() => {
        dispatch(fetchContentOfSources(sourceIds))
    }, [collectionId, sources])

    useEffect(() => {
        dispatch(resetThemeColours())
    }, [dispatch])

    useEffect(() => {
        console.log('refresh?', doRefresh)
        if (doRefresh && contents.length) {
            setContentsVisible(contents)
            setDoUpdate(false)
            setFilteringCollectionId(collectionId)
        }
        console.log('refresh after?', doRefresh)
    }, [contents])

    useEffect(() => {
        setContentsVisible(contents)
        setDoUpdate(true)
        setFilteringCollectionId(collectionId)
        console.log('set update to true again')
    }, [collectionId])

    // console.log('contents', contents.map(c => [c.title, c.date_published]))

    // know whether to just show content of collection or to show recency-based filtered list (cycles & speed)
    const isFilteredCollection = filteringCollectionId === collectionId

    return (
        <motion.div {...motionProps} key={collectionId} className="collection w-full max-w-7xl mx-4 h-min-content">
            <div className="flex justify-between">
                <TitleCrumbs collectionId={collectionId} title={title} />
                <CollectionCustomizer collectionSettings={collectionSettings} isCustomizing={isCustomizing} /> 
            </div>
            <CollectionEmptyMessage />
            <ListingsContainerCollections
                className="mb-12"
                view={collectionSettings?.layout as SettingsLayout}
                collections={nestedCollections}
                selectAction={c => dispatch(chooseCollection(c.id))}
            />
            <ListingsContainerContent
                view={collectionSettings?.layout as SettingsLayout}
                contents={!isFilteredCollection ? contents : contentsVisible}
                sources={sources}
            />
        </motion.div>
    )
}

export default CollectionView
