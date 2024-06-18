import React from "react";
import { SettingsLayout, SourceKind } from "../../../../data/chirp-types";
import ListingsContainer from "../listings-container";
import { ListingRow } from "../row";
import { ListingsContainerPhraseProps } from "./interfaces";

export const ListingsContainerPhrase: React.FC<ListingsContainerPhraseProps> = ({ className, view, phrases }) => (
    <ListingsContainer className={className} view={SettingsLayout.CARDS /* view */}>
        {phrases.map((p) => (
            <ListingRow key={p.id} id={p.id} title={`${p.phrase} (${p.total.toLocaleString()})`} action={() => console.log("phrase", p)} bold={true} source={{ id: 0, name: "Phrase", url: "", site_url: "", kind: SourceKind.WEB }} />
        ))}
        {/* {view === SettingsLayout.CARDS} */}
    </ListingsContainer>
);
