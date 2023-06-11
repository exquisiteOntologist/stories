import React from 'react'
import { ListingCard } from '../card'
import ListingsContainer from '../listings-container'
import { ListingRow } from '../row'
import { ListingsContainerContentProps } from './interfaces'

export const ListingsContainerContent: React.FC<ListingsContainerContentProps> = ({view, contents, sources}) => (
    <ListingsContainer view={view}>
        {view === 'CARDS' ? contents.map((content, cI) => (
        <ListingCard
            key={content.id}
            id={content.id}
            title={content.title}
            linkUrl={content.url}
            content={content}
            source={sources?.find(s => s?.id == content.source_id)}
        />
    )) : contents.map((content, cI) => (
        <ListingRow
            key={content.id}
            id={content.id}
            title={content.title}
            linkUrl={content.url}
            content={content}
            source={sources?.find(s => s?.id == content.source_id)}
        />
    ))}
    </ListingsContainer>
)
