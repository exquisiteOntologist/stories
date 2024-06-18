import { PhraseResult, SettingsLayout, SourceDto } from "../../../../data/chirp-types";

export interface ListingsContainerPhraseProps {
    className?: string;
    view?: SettingsLayout;
    phrases: PhraseResult[];
}
