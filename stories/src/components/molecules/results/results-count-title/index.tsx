import React from 'react'
import { ResultsCountTitleProps } from './interfaces'

export const ResultsCountTitle: React.FC<ResultsCountTitleProps> = ({countClassName, thing, thingName}) => (
    <h2 className={`text-xl font-semibold mt-6 mb-2 ${(!!thing.length) ? 'opacity-100 visible' : 'opacity-0 hidden'} transition-all duration-150`}><span className={countClassName}>{thing.length}</span> {thingName}</h2>
)
