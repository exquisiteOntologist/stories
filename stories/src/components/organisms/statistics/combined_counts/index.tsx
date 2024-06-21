import React from "react";
import { ArticleCount } from "../article_count";
import { PhraseCount } from "../phrase_count";
import { CombinedCountsProps } from "./interfaces";

export const CombinedCount: React.FC<CombinedCountsProps> = ({ collectionId }) => (
    <div className="flex items-end mb-6">
        <ArticleCount collectionId={collectionId} />
        <PhraseCount collectionId={collectionId} />
    </div>
);
