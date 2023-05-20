import * as React from 'react'
import { useEffect, useState } from 'react'
// import Helmet from 'react-helmet'
import { addSourceToCollection, fetchSourcesOfCollection, sourcesSelectors } from '../../../redux/features/sourcesSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { Button, buttonClassesHollow } from '../../atoms/button'

interface CollectionEditViewProps {
    collectionId?: number | string
}

const CollectionEditView: React.FC<CollectionEditViewProps> = (props) => {
    const dispatch = useAppDispatch()
    const [sourceUrlEntry, setSourceUrlEntry] = useState<string>('')
    const [addSourceMessage, setAddSourceMessage] = useState<[string, boolean]>(['', false])
    // const collection = useAppSelector(contentsSelectors.selectAll)
    const sources = useAppSelector(sourcesSelectors.selectAll)

    const currentCollection = []
    const collectionTitle = 'Top'

    useEffect(() => {
        // @TODO: Pass current collection ID if not default collection

        dispatch(fetchSourcesOfCollection(currentCollection))
    }, [dispatch])

    const addToCollection = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddSourceMessage(['Adding source...', false])
        const success = (await dispatch(addSourceToCollection({sourceUrl: sourceUrlEntry, collectionIds: []}))).payload
        console.log('add source to collection after success', success)
        setAddSourceMessage([`${success ? 'Finished adding' : 'Failed to add'} source "${sourceUrlEntry}"`, !success])
        dispatch(fetchSourcesOfCollection(currentCollection))
    }

    const [addMessageText, addMessageWasError] = addSourceMessage

    const addSource = (
        <div className="mb-10">
            <form className='flex mb-2' onSubmit={e => addToCollection(e)}>
                {/* <h3 className='text-xl'>Enter source URL</h3> */}
                <input className='block border border-slate-400 rounded-md w-full mr-2 px-4 py-2 bg-transparent' type="text" placeholder="Enter source URL" value={sourceUrlEntry} onChange={e => setSourceUrlEntry(e.currentTarget.value)} />
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} action={() => {}} label="Add Source" disabled={!sourceUrlEntry}></Button>
            </form>
            <p className={`${addMessageWasError ? 'text-orange-700' : 'text-green-700'}`}>{addMessageText}&nbsp;</p>
        </div>
    )

    const sourceList = sources.sort((sA, sB) => (sA.title || '').localeCompare(sB.title || '')).map(source => (
        <div className="my-2" key={source.sourceId}>
            <h3>{source.title}</h3>
            <p className="text-gray-300" title={`ID ${source.sourceId}`}><span className="font-bold">{source.sourceType === 0 ? 'RSS' : ''}&nbsp;</span>{source.url}</p>
        </div>
    ))

    const nestedCollectionList = []

    return (
        <>
            {/* <Helmet>
                <title>Editing &ldquo;{collectionTitle}&rdquo; | Semblance</title>
            </Helmet> */}
            <div className="collection max-w-xl w-full h-min-content">
                <h1 className="text-4xl font-semibold mb-24">Sources of &ldquo;{collectionTitle}&rdquo; Collection</h1>
                {addSource}
                {
                    sourceList?.length && (
                        <>
                            <h2 className='text-2xl font-semibold'>Sources</h2>
                            <div className='mb-10'>
                                {sourceList}
                            </div>
                        </>
                    ) || null
                }
                {
                    nestedCollectionList?.length && (
                        <>
                            <h2 className='text-2xl font-semibold'>Nested Collections</h2>
                            <div className='mb-10'>
                                {/* Collections go here */}
                            </div>
                        </>
                    ) || null
                }
            </div>
        </>
    )
}

export default CollectionEditView
