import React from 'react'
import { SettingsLayout } from '../../../../data/chirp-types'
import ListingsContainer from '../listings-container'
import { ListingRow } from '../row'
import { ListingsContainerCollectionsProps } from './interfaces'

export const ListingsContainerCollections: React.FC<ListingsContainerCollectionsProps> = ({className, view, collections, selectAction }) => (
    <ListingsContainer className={className} view={SettingsLayout.CARDS /* view */}>
        {
            collections.map(c => (
                <ListingRow
                    key={c.id}
                    id={c.id}
                    title={c.name}
                    action={() => selectAction(c)}
                    bold={true}
                />
            ))
        }
        {/* {view === SettingsLayout.CARDS} */}
    </ListingsContainer>
)

