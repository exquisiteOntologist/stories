import React, { useEffect, useState } from 'react'
import { collectionsSelectors, renameCollection, RenameCollection } from '../../../../redux/features/collectionsSlice'
import { selectCollectionId } from '../../../../redux/features/navSlice'
import { fetchSourcesOfCollection } from '../../../../redux/features/sourcesSlice'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { Button, buttonClassesHollow } from '../../../atoms/button'
import { Field } from '../../../atoms/forms/field'
import { H2 } from '../../../atoms/headings'

// it is assumed this is used where the collection has been fetched already
export const RenameCollectionSection: React.FC = () => {
    const dispatch = useAppDispatch()
    const collectionId = useAppSelector(selectCollectionId)
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))

    const [renameCollectionName, setRenameCollectionName] = useState<string>('')
    const [renameCollectionMessage, setRenameCollectionMessage] = useState<[string, boolean]>(['', false])

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

    return (
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
}
