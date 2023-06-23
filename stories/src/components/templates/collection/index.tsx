import * as React from 'react'
import { useEffect } from 'react'
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { fetchContent, selectContentOfCollection } from '../../../redux/features/contentsSlice'
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

const clientItemsLimit: number = 100
const time = (s: string): number => new Date(s).getTime()
const sortContentPublished = (cA: ContentDto, cB: ContentDto) => time(cB.date_published) - time(cA.date_published)

const CollectionView: React.FC<CollectionViewProps> = () => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))
    const nestedCollections = useAppSelector(selectNestedCollections)
    const collectionSettings = useAppSelector(s => collectionSettingsSelectors.selectById(s, collectionId))
    const sources = useAppSelector(sourcesSelectors.selectAll)
    const contents = useAppSelector(selectContentOfCollection).slice(0, clientItemsLimit).sort(sortContentPublished)
    const isCustomizing = useAppSelector(selectIsCustomizing);

    const title = isCustomizing ? 'edit' : 'hi'
    
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

    return (
        <>
            <motion.div {...motionProps} className="collection w-full max-w-7xl mx-4 h-min-content">
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
                    contents={contents}
                    sources={sources}
                />
            </motion.div>
        </>
    )
}

export default CollectionView
