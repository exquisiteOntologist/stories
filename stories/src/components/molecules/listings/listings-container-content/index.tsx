import React from 'react'
import { ListingCard } from '../card'
import ListingsContainer from '../listings-container'
import { ListingRow } from '../row'
import { ListingsContainerContentProps } from './interfaces'

export const ListingsContainerContent: React.FC<ListingsContainerContentProps> = ({view, contents, sources}) => (
    <ListingsContainer view={view}>
        {view === 'CARDS' ? contents.map((c, cI) => (
            <ListingCard
                key={c.id}
                id={c.id}
                title={c.title}
                linkUrl={c.url}
                content={c}
                source={sources?.find(s => s?.id == c.source_id)}
            />
        )) : contents.map((c, cI) => (
            <ListingRow
                key={c.id}
                id={c.id}
                title={c.title}
                linkUrl={c.url}
                content={c}
                source={sources?.find(s => s?.id == c.source_id)}
            />
        ))}
    </ListingsContainer>
)