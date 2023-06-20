import * as React from 'react'
import { useEffect, useState } from 'react'
import { addNewCollection, collectionsSelectors, fetchCollection, fetchNestedCollections, NewCollection, selectNestedCollections, renameCollection, RenameCollection } from '../../../redux/features/collectionsSlice'
import { collectionToSourceSelectors } from '../../../redux/features/collectionToSourceSlice'
import { selectCollectionId } from '../../../redux/features/navSlice'
import { fetchSourcesOfCollection } from '../../../redux/features/sourcesSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { Button, buttonClassesHollow } from '../../atoms/button'
import { Field } from '../../atoms/forms/field'
import { H2, Hint, Light } from '../../atoms/headings'
import { EditListItem } from '../../molecules/edit-list/edit-list-item'
import { EditListCollections } from '../../organisms/collection-edit/edit-list-collections'
import { EditListSources } from '../../organisms/collection-edit/edit-list-sources'
import { TitleCrumbs } from '../../organisms/title-crumbs'
import { CollectionEditViewProps } from './interfaces'


const CollectionEditView: React.FC<CollectionEditViewProps> = () => {
    const dispatch = useAppDispatch()
    const collectionId = useAppSelector(selectCollectionId)

    const [renameCollectionName, setRenameCollectionName] = useState<string>('')
    const [renameCollectionMessage, setRenameCollectionMessage] = useState<[string, boolean]>(['', false])
        
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

    useEffect(() => {
        setRenameCollectionName(collection?.name ?? renameCollectionName)
    }, [collection])

    const submitRenameCollection = async (e: React.FormEvent) => {
        e.preventDefault()
        setRenameCollectionMessage(['Renaming collection...', false])
        const success = (await dispatch(renameCollection({collectionId: collectionId, name: renameCollectionName } as RenameCollection))).payload
        setRenameCollectionMessage([`${success ? 'Finished renaming' : 'Failed to rename'} collection "${renameCollectionName}"`, !success])
        dispatch(fetchSourcesOfCollection([collectionId]))
    }

    const [renameCollectionMessageText, renameCollectionMessageError] = renameCollectionMessage

    const renameCollectionSection = (
        <div className="mb-10">
            <H2>Rename Collection</H2>
            <form className="flex mb-2" onSubmit={submitRenameCollection}>
                <Field placeholder="Collection Name" value={renameCollectionName} updater={setRenameCollectionName} />
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} action={() => {}} label="Rename" disabled={!renameCollectionName} />
            </form>
            {
                renameCollectionMessageText
                    ? (<p className={`${renameCollectionMessageError ? 'text-orange-700' : 'text-green-700'}`}>{renameCollectionMessageText}&nbsp;</p>)
                    : <p>&nbsp;</p>
            }
        </div>
    )

    return (
        <>
            <div className="w-full max-w-7xl mx-4 flex flex-wrap justify-normal">
                <div className="collection w-full max-w-7xl h-min-content">
                    <TitleCrumbs collectionId={collectionId} title="materials" />
                </div>
                <div className="collection w-full max-w-xl h-min-content">    
                    {renameCollectionSection}
                    <EditListSources />
                    <EditListCollections />
                </div>
            </div>
        </>
    )
}

export default CollectionEditView
