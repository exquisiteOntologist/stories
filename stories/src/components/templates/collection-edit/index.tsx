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
            <div className="collection max-w-xl w-full h-min-content">
                <h1 className="text-4xl font-semibold mb-24">Material of <Light colour="yellow">{collection?.name}</Light> Collection</h1>
                {renameCollectionSection}               
                <EditListSources />
                <EditListCollections />
            </div>
        </>
    )
}

export default CollectionEditView
