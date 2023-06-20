import * as React from 'react'
import { useEffect } from 'react'
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { resetThemeColours } from '../../../redux/features/themeSlice'
import { fetchCollection } from '../../../redux/features/collectionsSlice'
import { selectCollectionId } from '../../../redux/features/navSlice'
import { TitleCrumbs } from '../../organisms/title-crumbs'
import { SearchResults } from '../../organisms/search/search-results'
import { SearchForm } from '../../organisms/search/search-form'
import { motionProps } from '../../../utilities/animate'

const CollectionSearchView: React.FC = () => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    
    useEffect(() => {
        dispatch(fetchCollection([collectionId]))
        dispatch(resetThemeColours())
    }, [dispatch])

    return (
        <motion.div {...motionProps} className="collection w-full max-w-7xl mx-4 h-min-content">
            <TitleCrumbs collectionId={collectionId} title="find" />
            <div className="mb-12">
                <SearchForm />
                <SearchResults />
            </div>
        </motion.div>
    )
}

export default CollectionSearchView
