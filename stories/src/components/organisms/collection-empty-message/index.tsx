import * as React from 'react'
import { motion } from "framer-motion";
import { Button, buttonClassesHollow } from '../../atoms/button'
import { H2, Light } from '../../atoms/headings'
import { motionProps } from '../../../utilities/animate'
import { collectionsSelectors, selectNestedCollections } from '../../../redux/features/collectionsSlice';
import { selectCollectionId, selectLoading } from '../../../redux/features/navSlice';
import { useAppSelector } from '../../../redux/hooks';
import { selectContentOfCollection } from '../../../redux/features/contentsSlice';

export const CollectionEmptyMessage: React.FC = () => {
    const collectionId = useAppSelector(selectCollectionId)
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))
    const hasNestedCollections = !!useAppSelector(selectNestedCollections)?.length
    const hasContents = !!useAppSelector(selectContentOfCollection)?.length
    const isLoading = !!useAppSelector(selectLoading)
  
    const notEmpty = !isLoading && (!!collection && !hasNestedCollections && !hasContents)

    if (notEmpty === false) return null

    return (
        <motion.div {...motionProps}>
            <H2>Add Something to <Light colour="yellow">{collection?.name}</Light></H2>
            <p className="text-current mb-6">This collection is empty. There are no sources &amp; no nested collections.</p>
            <div className="flex">
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} linkTo="/edit" label="Edit Sources"></Button>
            </div>
        </motion.div>
    )
}
