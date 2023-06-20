import * as React from 'react'
import { useEffect } from 'react'
import { motion } from "framer-motion";
import { collectionsSelectors, fetchCollection, fetchNestedCollections } from '../../../redux/features/collectionsSlice'
import { collectionToSourceSelectors } from '../../../redux/features/collectionToSourceSlice'
import { selectCollectionId } from '../../../redux/features/navSlice'
import { fetchSourcesOfCollection } from '../../../redux/features/sourcesSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { motionProps } from '../../../utilities/animate'
import { EditListCollections } from '../../organisms/collection-edit/edit-list-collections'
import { EditListSources } from '../../organisms/collection-edit/edit-list-sources'
import { RenameCollectionSection } from '../../organisms/collection-edit/rename-collection'
import { TitleCrumbs } from '../../organisms/title-crumbs'
import { CollectionEditViewProps } from './interfaces'


const CollectionEditView: React.FC<CollectionEditViewProps> = () => {
    const dispatch = useAppDispatch()
    const collectionId = useAppSelector(selectCollectionId)
        
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))
    const collectionToSources = useAppSelector(collectionToSourceSelectors.selectAll)

    useEffect(() => {
        dispatch(fetchCollection([collectionId]))
        dispatch(fetchNestedCollections([collectionId]))
        dispatch(fetchSourcesOfCollection([collectionId]))
    }, [dispatch, collectionId])

    useEffect(() => {
        dispatch(fetchSourcesOfCollection([collectionId]))
    }, [dispatch, collection, collectionToSources])

    return (
        <>
            <motion.div {...motionProps} className="w-full max-w-7xl mx-4 flex flex-wrap justify-normal">
                <div className="collection w-full max-w-7xl h-min-content">
                    <TitleCrumbs collectionId={collectionId} title="materials" />
                </div>
                <div className="collection w-full max-w-xl h-min-content">    
                    <RenameCollectionSection />
                    <EditListSources />
                    <EditListCollections />
                </div>
            </motion.div>
        </>
    )
}

export default CollectionEditView
