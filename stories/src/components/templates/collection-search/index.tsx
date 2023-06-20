import * as React from 'react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { resetThemeColours } from '../../../redux/features/themeSlice'
import { fetchCollection } from '../../../redux/features/collectionsSlice'
import { selectCollectionId } from '../../../redux/features/navSlice'
import { TitleCrumbs } from '../../organisms/title-crumbs'
import { SearchResults } from '../../organisms/search/search-results'
import { SearchForm } from '../../organisms/search/search-form'

const CollectionSearchView: React.FC = () => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    
    useEffect(() => {
        dispatch(fetchCollection([collectionId]))
        dispatch(resetThemeColours())
    }, [dispatch])

    return (
        <div className="collection w-full max-w-7xl mx-4 h-min-content">
            <TitleCrumbs collectionId={collectionId} title="find" />
            <div className="mb-12">
                <SearchForm />
                <SearchResults />
            </div>
        </div>
    )
}

export default CollectionSearchView
