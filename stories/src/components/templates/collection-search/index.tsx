import * as React from 'react'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { resetThemeColours } from '../../../redux/features/themeSlice'
import { collectionsSelectors, fetchCollection, fetchNestedCollections, selectNestedCollections } from '../../../redux/features/collectionsSlice'
import { collectionSettingsSelectors, setCollectionSettings } from '../../../redux/features/collectionSettingsSlice'
import { Collection, CollectionSettings, SettingsLayout } from '../../../data/chirp-types'
import { chooseCollection, selectCollectionId } from '../../../redux/features/navSlice'
import { ListingsContainerContent } from '../../molecules/listings/listings-container-content'
import { ResultsCountTitle } from '../../molecules/results/results-count-title'
import { IconSearch } from '../../atoms/icons/search'
import { LabelAdd } from '../../atoms/icons/label-add'
import { search, selectSearchResults } from '../../../redux/features/searchSlice'
import { debounce } from 'lodash'
import { TitleCrumbs } from '../../organisms/title-crumbs'
import { ListingRow } from '../../molecules/listings/row'

interface CollectionViewProps {
    collectionId?: number | string,
    customize?: boolean,
    searchMode?: boolean
}

const clientItemsLimit: number = 100

const CollectionSearchView: React.FC<CollectionViewProps> = ({customize, searchMode}) => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    const searchResults = useAppSelector(selectSearchResults)
    const sr = searchResults

    const [searchPhrase, setSearchPhrase] = React.useState<string>('')

    const title = 'find'

    console.log('search results', searchResults.contents)
    
    useEffect(() => {
        dispatch(fetchCollection([collectionId]))
    }, [dispatch])

    useEffect(() => {
        dispatch(resetThemeColours())
    }, [dispatch])

    const submitSearch = (e: React.FormEvent) => e.preventDefault()

    const dispatchSearch = debounce((phrase: string) => dispatch(search(phrase)), 150)

    const updateSearch = (phrase: string) => {
        setSearchPhrase(phrase)
        dispatchSearch(phrase)
    }

    const searchForm = (
        <form className="flex mb-12" onSubmit={submitSearch}>
            <div className="relative w-full mr-2">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-blue-500 pointer-events-none"><IconSearch /></span>
                <input id="search-box" className='block border border-slate-400 w-full mr-2 px-4 py-2 pl-12 bg-transparent rounded-full' type="text" placeholder="" autoFocus spellCheck="false" value={searchPhrase} onChange={e => updateSearch(e.currentTarget.value)} />
            </div>
            {/* <Button className={`${buttonClassesHollow} whitespace-nowrap`} action={() => console.log('pinning not yet supported :)')} label="Pin it" disabled={!searchPhrase}></Button> */}
        </form>
    )

    const searchResultsCounts = (
        <div className={`${(!!searchPhrase && !!searchResults) ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150`}>
            <ResultsCountTitle countClassName="text-green-500" thing={sr.sources} thingName="Sources" />
            {
                sr.sources.length ? (
                    <div className="grid grid-cols-3 gap-4 mb-12">
                        {
                            sr.sources.map((s) => (
                                <ListingRow
                                    key={s.id}
                                    id={s.id}
                                    title={s.name}
                                    action={() => console.info('selecting sources not supported yet')}
                                />
                            ))
                        }
                    </div>
                ) : null
            }
            <ResultsCountTitle countClassName="text-red-500" thing={sr.collections} thingName="Collections" />
            {
                sr.collections.length ? (
                    <div className="grid grid-cols-3 gap-4 mb-12">
                        {
                            sr.collections.map((c) => (
                                <ListingRow
                                    key={c.id}
                                    id={c.id}
                                    title={c.name}
                                    action={() => dispatch(chooseCollection(c.id))}
                                />
                            ))
                        }
                    </div>
                ) : null
            }
            <ResultsCountTitle countClassName="text-orange-500" thing={sr.contents} thingName="Articles" />
            {
                sr.contents.length ? (
                    <div className="grid grid-cols-3 gap-4 mb-12">
                        {
                            sr.contents.map((c) => (
                                <ListingRow
                                    key={c.id}
                                    id={c.id}
                                    title={c.title}
                                    linkUrl={c.url}
                                />
                            ))
                        }
                    </div>
                ) : null
            }
            <ResultsCountTitle countClassName="text-yellow-500" thing={sr.entity_people} thingName="People" />
            <ResultsCountTitle countClassName="text-blue-500" thing={sr.entity_places} thingName="Places" />
            <ResultsCountTitle countClassName="text-blue-500" thing={sr.entity_brands} thingName="Brands" />
            <ResultsCountTitle countClassName="text-blue-500" thing={sr.entity_chemicals} thingName="Chemicals" />
            <ResultsCountTitle countClassName="text-blue-500" thing={sr.entity_materials} thingName="Materials" />
            <ResultsCountTitle countClassName="text-blue-500" thing={sr.entity_concepts} thingName="Concepts" />
            <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-yellow-500">{sr.mean_temperament === 1 ? 'Neutral' : 'Bipolar'}</span> Temperament Overall</h2>
        </div>
    )

    const collectionSearcher = (
        <div className={`mb-12`}>
            <h2 className="text-2xl font-semibold mb-2">{/* Search */}&nbsp; {searchPhrase && (<span className="text-blue-500">&ldquo;{searchPhrase}&rdquo;</span>)} {/* <span className="inline-block ml-0 align-top"><LabelAdd /></span> */}</h2>
            {searchForm}
            {searchResultsCounts}
        </div>
    )

    return (
        <>
            <div className="collection w-full max-w-7xl mx-4 h-min-content">
                <TitleCrumbs collectionId={collectionId} title={title} />
                <div className="mb-6">
                    {collectionSearcher}
                </div>
            </div>
        </>
    )
}

export default CollectionSearchView
