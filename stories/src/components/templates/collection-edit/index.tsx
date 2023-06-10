import * as React from 'react'
import { useEffect, useState } from 'react'
import { SourceDto } from '../../../data/chirp-types'
import { addNewCollection, collectionsSelectors, fetchCollection, fetchNestedCollections, NewCollection, selectNestedCollections, renameCollection, RenameCollection } from '../../../redux/features/collectionsSlice'
import { collectionToSourceSelectors } from '../../../redux/features/collectionToSourceSlice'
import { selectCollectionId } from '../../../redux/features/navSlice'
import { addSourceToCollection, fetchSourcesOfCollection, removeSources, selectNestedSources, sourcesSelectors } from '../../../redux/features/sourcesSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { Button, buttonClassesHollow } from '../../atoms/button'
import { ListActionBar } from '../../molecules/list-action-bar'
import { CollectionEditViewProps } from './interfaces'

const CollectionEditView: React.FC<CollectionEditViewProps> = (props) => {
    const dispatch = useAppDispatch()
    const collectionId = useAppSelector(selectCollectionId)

    const [renameCollectionName, setRenameCollectionName] = useState<string>('')
    const [renameCollectionMessage, setRenameCollectionMessage] = useState<[string, boolean]>(['', false])
    
    const [newCollectionName, setNewCollectionName] = useState<string>('')
    const [newCollectionMessage, setNewCollectionMessage] = useState<[string, boolean]>(['', false])
    
    const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([])
    const [sourceUrlEntry, setSourceUrlEntry] = useState<string>('')
    const [otherParamEntry, setOtherParamEntry] = useState<string>('')
    const [addSourceMessage, setAddSourceMessage] = useState<[string, boolean]>(['', false])
    
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))
    const nestedCollections = useAppSelector(selectNestedCollections)
    const collectionToSources = useAppSelector(collectionToSourceSelectors.selectAll)
    const sources = useAppSelector(selectNestedSources)

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

    // NOTE: Current collection name is this collection's name, & new collection name is for any collection being added new to this collection

    const submitRenameCollection = async (e: React.FormEvent) => {
        e.preventDefault()
        setRenameCollectionMessage(['Renaming collection...', false])
        const success = (await dispatch(renameCollection({collectionId: collectionId, name: renameCollectionName } as RenameCollection))).payload
        setRenameCollectionMessage([`${success ? 'Finished renaming' : 'Failed to rename'} collection "${collectionId}"`, !success])
        dispatch(fetchSourcesOfCollection([collectionId]))
    }

    const [renameCollectionMessageText, renameCollectionMessageError] = renameCollectionMessage

    const renameCollectionSection = (
        <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">Rename Collection</h2>
            <form className="flex mb-2" onSubmit={submitRenameCollection}>
                <input className='block border border-slate-400 rounded-md w-full mr-2 px-4 py-2 bg-transparent' type="text" placeholder="Collection Name" spellCheck="false" value={renameCollectionName} onChange={e => setRenameCollectionName(e.currentTarget.value)} />
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} action={() => {}} label="Rename" disabled={!renameCollectionName}></Button>
            </form>
            {
                renameCollectionMessageText
                    ? (<p className={`${renameCollectionMessageError ? 'text-orange-700' : 'text-green-700'}`}>{renameCollectionMessageText}&nbsp;</p>)
                    : <p>&nbsp;</p>
                    // : (<p className="text-gray-300"><span className="font-semibold">Note:</span> The new collection will be nested within the current collection.</p>)
            }
        </div>
    )

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

    const addCollection = (
        <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">Add a Collection</h2>
            <form className="flex mb-2" onSubmit={submitAddCollection}>
                <input className='block border border-slate-400 rounded-md w-full mr-2 px-4 py-2 bg-transparent' type="text" placeholder="Collection Name" spellCheck="false" value={newCollectionName} onChange={e => setNewCollectionName(e.currentTarget.value)} />
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} action={() => {}} label="Add" disabled={!newCollectionName}></Button>
            </form>
            {
                newCollectionMessageText
                    ? (<p className={`${newCollectionMessageError ? 'text-orange-700' : 'text-green-700'}`}>{newCollectionMessageText}&nbsp;</p>)
                    : (<p className="text-gray-300"><span className="font-semibold">Note:</span> The new collection will be nested within the current collection.</p>)
            }
        </div>
    )

    const submitAddToCollection = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddSourceMessage(['Adding source...', false])
        const success = (await dispatch(addSourceToCollection({collectionId: collectionId, sourceUrl: sourceUrlEntry, otherParam: otherParamEntry }))).payload
        setAddSourceMessage([`${success ? 'Finished adding' : 'Failed to add'} source "${sourceUrlEntry}"`, !success])
        dispatch(fetchSourcesOfCollection([collectionId]))
        if (success) {
            setSourceUrlEntry('')
            setOtherParamEntry('')
        }
    }

    const [addMessageText, addMessageWasError] = addSourceMessage

    const addSource = (
        <div className="mb-10">
            <h2 className='text-2xl font-semibold mb-2'>Add a Source</h2>
            <form className='flex mb-2' onSubmit={submitAddToCollection}>
                {/* <h3 className='text-xl'>Enter source URL</h3> */}
                <input className='block border border-slate-400 rounded-md w-full mr-2 px-4 py-2 bg-transparent' type="text" placeholder="Enter Source URL" spellCheck="false" value={sourceUrlEntry} onChange={e => setSourceUrlEntry(e.currentTarget.value)} />
                <input className='block border border-slate-400 rounded-md w-full mr-2 px-4 py-2 bg-transparent' type="text" placeholder="Article URL '/segment/'" spellCheck="false" value={otherParamEntry} onChange={e => setOtherParamEntry(e.currentTarget.value)} />
                <Button className={`${buttonClassesHollow} whitespace-nowrap`} action={() => {}} label="Add" disabled={!sourceUrlEntry}></Button>
            </form>
            {
                addMessageText
                    ? (<p className={`${addMessageWasError ? 'text-orange-700' : 'text-green-700'}`}>{addMessageText}&nbsp;</p>)
                    : (<p className="text-gray-300"><span className="font-semibold">Tip:</span> If articles on a site have &ldquo;/2023/&rdquo; in their URLs, add &ldquo;2023&rdquo; as the segment.&nbsp;</p>)
            }
        </div>
    )

    const handleCheckToggle = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const checked: boolean = (e.target as HTMLInputElement)?.checked
        const selected = [...selectedSourceIds]
        if (checked) {
            selected.push(id)
        } else {
            selected.splice(selected.indexOf(id), 1)
        }
        setSelectedSourceIds(selected)
    }

    const sourceChecked = (id: number): boolean => selectedSourceIds.includes(id)
    const kindClass = (kind: SourceDto['kind']) => kind === 'RSS' ? 'text-red-600' : 'text-yellow-600'

    const sourceList = sources.sort((sA, sB) => (sA.name || '').localeCompare(sB.name || '')).map(s => (
        <div className="select-none" key={s.id}>
            <input className="hidden" type="checkbox" id={s.id.toString()} name={s.id.toString()} onChange={e => handleCheckToggle(e, s.id)} />
            <label htmlFor={s.id.toString()} className={`block p-2 p2-3 px-2 -mt-2 -ml-2 -mr-2 max-w-none rounded-md ${sourceChecked(s.id) ? 'bg-yellow-200' : ''}`}>
                <h3 className={`${sourceChecked(s.id) ? 'text-gray-900' : 'text-current'}`}>{s.name}</h3>
                <p className={`${sourceChecked(s.id) ? 'text-gray-900' : 'text-current'} opacity-30`} title={`ID ${s.id}`}><span className={`font-bold ${kindClass(s.kind)}`}>{s.kind}&nbsp;</span>{s.url}</p>
                {/* <p className="text-gray-900 opacity-30 mix-blend-multiply" title={`ID ${s.id}`}><span className={`font-bold ${kindClass(s.kind)}`}>{s.kind}&nbsp;</span>{s.url}</p> */}
                {/* <p className="text-gray-300" title={`ID ${s.id}`}><span className="font-bold">{s.kind}&nbsp;</span>{s.url}</p> */}
            </label>
        </div>
    ))

    const nestedCollectionList = nestedCollections.sort((cA, cB) => (cA.name || '').localeCompare(cB.name || '')).map(c => (
        <div className="select-none" key={c.id}>
            <input className="hidden" type="checkbox" id={c.id.toString()} name={c.id.toString()} onChange={e => console.error('selecting collections not supported')} />
            <label htmlFor={c.id.toString()} className={`block p-2 p2-3 px-2 -mt-2 -ml-2 -mr-2 max-w-none rounded-md ${sourceChecked(c.id) ? 'bg-yellow-200' : ''}`}>
                <h3 className={`${sourceChecked(c.id) ? 'text-gray-900' : 'text-current'}`}>{c.name}</h3>
            </label>
        </div>
    ))

    const showContextActions: boolean = !!selectedSourceIds.length

    const clearSelection = () => setSelectedSourceIds([])

    return (
        <>
            <div className="collection max-w-xl w-full h-min-content">
                <h1 className="text-4xl font-semibold mb-24">Material of <span className="text-yellow-500">{collection?.name}</span> Collection</h1>
                {renameCollectionSection}               
                {addSource}
                <>
                    <h2 className='text-2xl font-semibold mb-2'><span className="text-green-500">{sourceList?.length}</span> Sources</h2>
                    <div className='mb-5'>
                        {sourceList}
                    </div>
                    <ListActionBar
                        show={showContextActions}
                        deleteAction={async () => {
                            await dispatch(removeSources({
                                collectionId: collectionId,
                                sourceIds: selectedSourceIds
                            }))

                            clearSelection()
                        }}
                    />
                </>
                {addCollection}
                <>
                    <h2 className='text-2xl font-semibold mb-2'><span className="text-blue-500">{nestedCollectionList.length}</span> Collections</h2>
                    <div className='mb-10'>
                        {nestedCollectionList}
                    </div>
                </>
            </div>
        </>
    )
}

export default CollectionEditView
