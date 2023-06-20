import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { fetchContent, selectContentOfCollection } from '../../../redux/features/contentsSlice'
import { fetchSourcesOfCollection, sourcesSelectors } from '../../../redux/features/sourcesSlice'
import { resetThemeColours } from '../../../redux/features/themeSlice'
import { Button, buttonClassesHollow } from '../../atoms/button'
import { collectionsSelectors, fetchCollection, fetchNestedCollections, selectNestedCollections } from '../../../redux/features/collectionsSlice'
import { collectionSettingsSelectors } from '../../../redux/features/collectionSettingsSlice'
import { SettingsLayout } from '../../../data/chirp-types'
import { chooseCollection, selectCollectionId, selectIsCustomizing } from '../../../redux/features/navSlice'
import { ListingsContainerContent } from '../../molecules/listings/listings-container-content'
import { TitleCrumbs } from '../../organisms/title-crumbs'
import { H2, Light } from '../../atoms/headings'
import { ListingsContainerCollections } from '../../molecules/listings/listings-container-collections'
import { CollectionCustomizer } from '../../organisms/collection-customizer'
import { CollectionViewProps } from './interface'

const clientItemsLimit: number = 100

const CollectionView: React.FC<CollectionViewProps> = () => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))
    const nestedCollections = useAppSelector(selectNestedCollections)
    const collectionSettings = useAppSelector(s => collectionSettingsSelectors.selectById(s, collectionId))
    const sources = useAppSelector(sourcesSelectors.selectAll)
    const contents = useAppSelector(selectContentOfCollection).slice(0, clientItemsLimit)
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

    const emptyCollectionMessage = (!!collection && !nestedCollections.length && !contents.length) ? (
        <div>
            <H2>Add Something to <Light colour="yellow">{collection?.name}</Light></H2>
            <p className="text-current mb-6">This collection is empty. There are no sources &amp; no nested collections.</p>
            <div className="flex">
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} linkTo="/edit" label="Edit Sources"></Button>
            </div>
        </div>
    ) : null

    return (
        <>
            <div className="collection w-full max-w-7xl mx-4 h-min-content">
                <TitleCrumbs collectionId={collectionId} title={title} />
                <CollectionCustomizer collectionSettings={collectionSettings} isCustomizing={isCustomizing} /> 
                {emptyCollectionMessage}
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
            </div>
        </>
    )
}

export default CollectionView
