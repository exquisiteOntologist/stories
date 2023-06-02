import * as React from 'react'
import { useEffect } from 'react'
// import Helmet from 'react-helmet'
import ListingsContainer from '../../molecules/listings/listings-container'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { contentsSelectors, fetchContent, fetchContentOfSources } from '../../../redux/features/contentsSlice'
import { ListingRow } from '../../molecules/listings/row'
import { fetchSources, sourcesSelectors } from '../../../redux/features/sourcesSlice'
import { ListingCard } from '../../molecules/listings/card'
import { resetThemeColours } from '../../../redux/features/themeSlice'
import { invoke } from '@tauri-apps/api'

interface CollectionViewProps {
    collectionId?: number | string
}

const clientItemsLimit = 100

const CollectionView: React.FC<CollectionViewProps> = (props) => {
    const dispatch = useAppDispatch()

    // @TODO: List collections in this collection view in addition to sources/contents
    const sources = useAppSelector(sourcesSelectors.selectAll)
    const contents = useAppSelector(contentsSelectors.selectAll).slice(0, clientItemsLimit)

    // const collectionId: number = 0
    const title = 'hi'
    
    useEffect(() => {
        // TODO: Replace with fetch_sources_of_collection, with default id as 0 (top-level/all)
        dispatch(fetchSources())
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
            {/* <Helmet>
                <title>{title} | Semblance</title>
            </Helmet> */}
            <div className="collection w-full max-w-7xl mx-4 h-min-content">
                <h1 className='text-4xl font-semibold mb-24'>{title}</h1>
                <ListingsContainer view='Cards'>
                    {contentCards}
                </ListingsContainer>
                <ListingsContainer view='Rows'>
                   {contentRows}
                </ListingsContainer>
            </div>
        </>
    )
}

export default CollectionView
