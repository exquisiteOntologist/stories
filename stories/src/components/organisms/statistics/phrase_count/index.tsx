import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { motionProps } from "../../../../utilities/animate";
import { PhraseResult } from "../../../../data/chirp-types";

export interface ArticleCountProps {
    collectionId: number;
}

export const PhraseCount: React.FC<ArticleCountProps> = ({ collectionId }) => {
    const [count, setCount] = useState<number>();

    useEffect(() => {
        invoke("collection_phrases_today", {
            collectionId,
        }).then((phrases) => setCount((phrases as PhraseResult[]).length));
    }, [collectionId]);

    return (
        <motion.hgroup {...motionProps} className="my-8 mr-6 cursor-default">
            {/* <h2 className="text-4xl">Top</h2> */}
            <h2 className="text-5xl">{count ?? <>&nbsp;</>}</h2>
            <h3 className="text-lg cursor-help">Phrases</h3>
        </motion.hgroup>
    );
};
