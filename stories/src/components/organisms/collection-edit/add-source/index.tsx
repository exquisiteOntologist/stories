import React, { useState } from 'react'
import { selectCollectionId } from '../../../../redux/features/navSlice'
import { addSourceToCollection, fetchSourcesOfCollection } from '../../../../redux/features/sourcesSlice'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { Button, buttonClassesHollow } from '../../../atoms/button'
import { Field } from '../../../atoms/forms/field'
import { H2, Hint } from '../../../atoms/headings'

export const AddSource: React.FC = () => {
    const dispatch = useAppDispatch()
    const collectionId = useAppSelector(selectCollectionId)

    const [sourceUrlEntry, setSourceUrlEntry] = useState<string>('')
    const [otherParamEntry, setOtherParamEntry] = useState<string>('')
    const [addSourceMessage, setAddSourceMessage] = useState<[string, boolean]>(['', false])

    const submitAddToCollection = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddSourceMessage(['Adding source...', false])
        const success = (await dispatch(addSourceToCollection({collectionId, sourceUrl: sourceUrlEntry, otherParam: otherParamEntry }))).payload
        setAddSourceMessage([`${success ? 'Finished adding' : 'Failed to add'} source "${sourceUrlEntry}"`, !success])
        dispatch(fetchSourcesOfCollection([collectionId]))
        if (success) {
            setSourceUrlEntry('')
            setOtherParamEntry('')
        }
    }

    const [addMessageText, addMessageWasError] = addSourceMessage

    return (
        <div className="mb-10">
            <H2>Add a Source</H2>
            <form className='flex mb-2' onSubmit={submitAddToCollection}>
                <Field placeholder="Enter Source URL" value={sourceUrlEntry} updater={setSourceUrlEntry} />
                <Field placeholder="Article URL '/segment/'" value={otherParamEntry} updater={setOtherParamEntry} />
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} action={() => {}} label="Add" disabled={!sourceUrlEntry} />
            </form>
            {
                addMessageText
                    ? (<p className={`${addMessageWasError ? 'text-orange-700' : 'text-green-700'}`}>{addMessageText}&nbsp;</p>)
                    : (<Hint title="Tip" text="If articles on a site have &ldquo;/2023/&rdquo; in their URLs, add &ldquo;2023&rdquo; as the segment.&nbsp;" />)
            }
        </div>
    )
}
