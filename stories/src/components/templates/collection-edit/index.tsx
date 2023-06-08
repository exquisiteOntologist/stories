import * as React from 'react'
import { useEffect, useState } from 'react'
import { SourceDto } from '../../../data/chirp-types'
import { addNewCollection, collectionsSelectors, fetchNestedCollections, NewCollection, selectNestedCollections } from '../../../redux/features/collectionsSlice'
import { selectCollectionId } from '../../../redux/features/navSlice'
import { addSourceToCollection, fetchSourcesOfCollection, removeSources, sourcesSelectors } from '../../../redux/features/sourcesSlice'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { Button, buttonClassesHollow } from '../../atoms/button'
import { IconRemove } from '../../atoms/icons/remove'
import { IconShapes } from '../../atoms/icons/shapes'

interface CollectionEditViewProps {
    collectionId?: number | string
}

const CollectionEditView: React.FC<CollectionEditViewProps> = (props) => {
    const dispatch = useAppDispatch()
    const collectionId = useAppSelector(selectCollectionId)
    
    const [newCollectionName, setNewCollectionName] = useState<string>('')
    const [newCollectionMessage, setNewCollectionMessage] = useState<[string, boolean]>(['', false])
    const collection = useAppSelector(s => collectionsSelectors.selectById(s, collectionId))
    const nestedCollections = useAppSelector(selectNestedCollections)
    
    const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([])
    const [sourceUrlEntry, setSourceUrlEntry] = useState<string>('')
    const [otherParamEntry, setOtherParamEntry] = useState<string>('')
    const [addSourceMessage, setAddSourceMessage] = useState<[string, boolean]>(['', false])
    const sources = useAppSelector(sourcesSelectors.selectAll)

    useEffect(() => {
        dispatch(fetchSourcesOfCollection([collectionId]))
        dispatch(fetchNestedCollections([collectionId]))
    }, [dispatch])

    const submitAddCollection = async (e: React.FormEvent) => {
        e.preventDefault()
        const success = (await dispatch(addNewCollection({
            collectionName: newCollectionName,
            parentId: collectionId
        } as NewCollection))).payload
        setNewCollectionMessage([`${success ? 'Succeeded' : 'Failed'} adding new collection "${newCollectionName}"`, !success])
    }

    const submitAddToCollection = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddSourceMessage(['Adding source...', false])
        const success = (await dispatch(addSourceToCollection({collectionIds: [collectionId], sourceUrl: sourceUrlEntry, otherParam: otherParamEntry }))).payload
        console.log('add source to collection after success', success)
        setAddSourceMessage([`${success ? 'Finished adding' : 'Failed to add'} source "${sourceUrlEntry}"`, !success])
        dispatch(fetchSourcesOfCollection([collectionId]))
    }

    const [newCollectionMessageText, newCollectionMessageError] = newCollectionMessage
    const [addMessageText, addMessageWasError] = addSourceMessage

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
                    : (<p className="text-gray-300"><span className="font-semibold">Note:</span> The collection will be nested within the current collection.</p>)
            }
        </div>
    )

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

    console.log('nested collections', nestedCollections)
    const nestedCollectionList = nestedCollections.sort((cA, cB) => (cA.name || '').localeCompare(cB.name || '')).map(c => (
        <div className="select-none" key={c.id}>
            <input className="hidden" type="checkbox" id={c.id.toString()} name={c.id.toString()} onChange={e => console.error('selecting collections not supported')} />
            <label htmlFor={c.id.toString()} className={`block p-2 p2-3 px-2 -mt-2 -ml-2 -mr-2 max-w-none rounded-md ${sourceChecked(c.id) ? 'bg-yellow-200' : ''}`}>
                <h3 className={`${sourceChecked(c.id) ? 'text-gray-900' : 'text-current'}`}>{c.name}</h3>
                {/* <p className={`${sourceChecked(c.id) ? 'text-gray-900' : 'text-current'} opacity-30`} title={`ID ${c.id}`}><span className={`font-bold ${kindClass(c.kind)}`}>{c.kind}&nbsp;</span>{c.url}</p> */}
                {/* <p className="text-gray-900 opacity-30 mix-blend-multiply" title={`ID ${s.id}`}><span className={`font-bold ${kindClass(s.kind)}`}>{s.kind}&nbsp;</span>{s.url}</p> */}
                {/* <p className="text-gray-300" title={`ID ${s.id}`}><span className="font-bold">{s.kind}&nbsp;</span>{s.url}</p> */}
            </label>
        </div>
    ))

    const showContextActions: boolean = !!selectedSourceIds.length

    return (
        <>
            <div className="collection max-w-xl w-full h-min-content">
                <h1 className="text-4xl font-semibold mb-24">Sources of <span className="text-yellow-500">{collection?.name}</span> Collection</h1>
                {addSource}
                {
                    sourceList?.length && (
                        <>
                            <h2 className='text-2xl font-semibold mb-2'>Sources</h2>
                            <div className='mb-10'>
                                {sourceList}
                            </div>
                        </>
                    ) || null
                }
                {addCollection}
                {
                    nestedCollectionList?.length && (
                        <>
                            <h2 className='text-2xl font-semibold'>Collections inside {collection?.name}</h2>
                            <div className='mb-10'>
                                {nestedCollectionList}
                            </div>
                        </>
                    ) || null
                }
                <div className={`flex justify-center transition-all duration-0 ${showContextActions ? 'opacity-1' : 'opacity-0'}`}>
                    {/* <Button 
                        Icon={IconShapes}
                        action={() => void 8}
                        disabled={true}
                    /> */}
                    <Button 
                        Icon={IconRemove}
                        action={() => dispatch(removeSources({
                            collectionId: collectionId,
                            sourceIds: selectedSourceIds
                        }))}
                    />
                </div>
            </div>
        </>
    )
}

export default CollectionEditView
