import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { debounce } from 'lodash'
import { search } from '../../../../redux/features/searchSlice'
import { IconSearch } from '../../../atoms/icons/search'
import { H2, Light } from '../../../atoms/headings'

export const SearchForm: React.FC = () => {
    const dispatch = useDispatch()

    const [searchPhrase, setSearchPhrase] = React.useState<string>('')

    const dispatchSearch = useCallback(debounce((phrase: string) => dispatch(search(phrase)), 300, {
        trailing: true
    }), [])

    useEffect(() => {
        dispatch(search(''))
    }, [dispatch])

    const updateSearch = (phrase: string) => {
        setSearchPhrase(phrase)
        // dispatchSearch.cancel()
        // dispatchSearch.flush()
        dispatchSearch(phrase)
    }

    const submitHandler = (e: Event) => {
        e.preventDefault()
        dispatch(search(searchPhrase))
    }

    return (
        <>
            <H2>&nbsp; {searchPhrase && (<Light colour="blue">&ldquo;{searchPhrase}&rdquo;</Light>)}</H2>
            <form className="flex mb-12" onSubmit={submitHandler}>
                <div className="relative w-full mr-2">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-blue-500 pointer-events-none"><IconSearch /></span>
                    <input id="search-box" className='block border border-slate-400 w-full mr-2 px-4 py-2 pl-12 bg-transparent rounded-full' type="text" placeholder="" autoFocus spellCheck="false" value={searchPhrase} onChange={e => updateSearch(e.currentTarget.value)} />
                </div>
            </form>
        </>
    )
}
