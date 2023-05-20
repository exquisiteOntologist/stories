import * as React from 'react'
import { useEffect } from 'react'
// import Helmet from 'react-helmet'
import ListingsContainer from '../../molecules/listings/listings-container'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
// import { contentsSelectors, fetchContentOfSources } from '../../../redux/features/contentsSlice'
import { ListingRow } from '../../molecules/listings/row'
// import { fetchSources, sourcesSelectors } from '../../../redux/features/sourcesSlice'
import { ListingCard } from '../../molecules/listings/card'
import { resetThemeColours } from '../../../redux/features/themeSlice'

interface CollectionViewProps {
    collectionId?: number | string
}

const clientItemsLimit = 100

const CollectionView: React.FC<CollectionViewProps> = (props) => {
    const dispatch = useAppDispatch()

    // @TODO: List collections in this collection view in addition to sources/contents
    // const contents = useAppSelector(contentsSelectors.selectAll).slice(0, clientItemsLimit)
    // const sources = useAppSelector(sourcesSelectors.selectAll)

    const title = 'hi'
    
    useEffect(() => {
        // @TODO: Make server return default collection
        const sourceIds = [1, 2, 3, 4, 5, 6]

        // dispatch(fetchSources(sourceIds))
        // dispatch(fetchContentOfSources(sourceIds))
    }, [dispatch])

    // useEffect(() => {
    //     dispatch(resetThemeColours(null))
    // }, [dispatch])

    // const contentRows = contents.map((content, cI) => (
    //     <ListingRow
    //         key={content.contentId}
    //         id={content.contentId}
    //         title={content.title}
    //         linkUrl={`/app/reader/${content.contentId}`}
    //         content={content}
    //         source={sources?.find(s => s?.sourceId == content.sourceId)}
    //     />
    // ));

    // const contentCards = contents.map((content, cI) => (
    //     <ListingCard
    //         key={content.contentId}
    //         id={content.contentId}
    //         title={content.title}
    //         linkUrl={`/app/reader/${content.contentId}`}
    //         content={content}
    //         source={sources?.find(s => s?.sourceId == content.sourceId)}
    //     />
    // ))

    return (
        <>
            {/* <Helmet>
                <title>{title} | Semblance</title>
            </Helmet> */}
            <div className="collection w-full max-w-7xl mx-4 h-min-content">
                <h1 className='text-4xl font-semibold mb-24'>{title}</h1>
                {/* <ListingsContainer view='Cards'>
                    {contentCards}
                </ListingsContainer>
                <ListingsContainer view='Rows'>
                   {contentRows}
                </ListingsContainer> */}
            </div>
        </>
    )
}

export default CollectionView
