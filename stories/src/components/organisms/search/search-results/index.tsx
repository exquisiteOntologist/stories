import React from 'react'
import { chooseCollection } from '../../../../redux/features/navSlice'
import { selectSearchResults } from '../../../../redux/features/searchSlice'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { ListingRow } from '../../../molecules/listings/row'
import { ResultsCountTitle } from '../../../molecules/results/results-count-title'

export const SearchResults: React.FC = () => {
    const dispatch = useAppDispatch()
    
    const searchResults = useAppSelector(selectSearchResults)
    const sr = searchResults

    return (
        <div className={`${!!searchResults ? 'opacity-100' : 'opacity-0'} transition-opacity duration-150`}>
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
            {/* <h2 className="text-xl font-semibold mt-6 mb-2"><span className="text-yellow-500">{sr.mean_temperament === 1 ? 'Neutral' : 'Bipolar'}</span> Temperament Overall</h2> */}
        </div>
    )
}
