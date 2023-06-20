import React, { useState } from 'react'
import { addNewCollection, NewCollection } from '../../../../redux/features/collectionsSlice'
import { selectCollectionId } from '../../../../redux/features/navSlice'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { Button, buttonClassesHollow } from '../../../atoms/button'
import { Field } from '../../../atoms/forms/field'
import { H2, Hint } from '../../../atoms/headings'

export const AddCollection: React.FC = () => {
    const dispatch = useAppDispatch()
    const collectionId = useAppSelector(selectCollectionId)

    const [newCollectionName, setNewCollectionName] = useState<string>('')
    const [newCollectionMessage, setNewCollectionMessage] = useState<[string, boolean]>(['', false])

    const submitAddCollection = async (e: React.FormEvent) => {
        e.preventDefault()
        const success = (await dispatch(addNewCollection({
            collectionName: newCollectionName,
            parentId: collectionId
        } as NewCollection))).payload
        setNewCollectionMessage([`${success ? 'Succeeded' : 'Failed'} adding new collection "${newCollectionName}"`, !success])
        if (success) setNewCollectionName('')
    }

    const [newCollectionMessageText, newCollectionMessageError] = newCollectionMessage

    return (
        <div className="mb-10">
            <H2 className="text-current">Add a Collection</H2>
            <form className="flex mb-2" onSubmit={submitAddCollection}>
                <Field placeholder="New Collection Name" value={newCollectionName} updater={setNewCollectionName} />
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} action={() => {}} label="Add" disabled={!newCollectionName} />
            </form>
            {
                newCollectionMessageText
                    ? (<p className={`${newCollectionMessageError ? 'text-orange-700' : 'text-green-700'}`}>{newCollectionMessageText}&nbsp;</p>)
                    : (<Hint title="Note" text="The new collection will be nested within the current collection." />)
            }
        </div>
    )
}