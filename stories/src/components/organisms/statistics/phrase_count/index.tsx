import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { motionProps } from "../../../../utilities/animate";
import { GenericCount } from "../../../../data/chirp-types";

export interface ArticleCountProps {
    collectionId: number;
}

export const PhraseCount: React.FC<ArticleCountProps> = ({ collectionId }) => {
    const [count, setCount] = useState<GenericCount>();

    useEffect(() => {
        invoke("today_phrases_count", {
            collectionId,
        }).then((newCount) => setCount(newCount as GenericCount));
    }, [collectionId]);

    return (
        <motion.hgroup {...motionProps} className="my-8 mr-6 cursor-default">
            {/* <h2 className="text-4xl">Top</h2> */}
            <h2 className="text-5xl">{count?.today.toLocaleString() ?? <>&nbsp;</>}</h2>
            <h3 className="text-lg cursor-help">Phrases</h3>
        </motion.hgroup>
    );
};
