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

interface CollectionViewProps {
    collectionId?: number | string,
    customize?: boolean
}

const clientItemsLimit = 100

const CollectionView: React.FC<CollectionViewProps> = ({customize}) => {
    const dispatch = useAppDispatch()

    // @TODO: List collections in this collection view in addition to sources/contents
    const sources = useAppSelector(sourcesSelectors.selectAll)
    const contents = useAppSelector(contentsSelectors.selectAll).slice(0, clientItemsLimit)

    const collectionId: number = 0
    const title = customize ? 'edit' : 'hi'
    
    useEffect(() => {
        // TODO: Replace with fetch_sources_of_collection, with default id as 0 (top-level/all)
        dispatch(fetchSourcesOfCollection([collectionId]))
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
    const viewIsList = true

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
                    action={() => void 8 /* dispatch(removeSources({
                        collectionId: currentCollection,
                        sourceIds: selectedSourceIds
                    })) */}
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
                    <h2 className="text-2xl font-semibold"><span className="text-yellow-500">Home</span></h2>
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
