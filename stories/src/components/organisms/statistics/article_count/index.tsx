import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { motionProps } from "../../../../utilities/animate";
import { TodayCount } from "../../../../data/chirp-types";

export interface ArticleCountProps {
    collectionId: number;
}

export const ArticleCount: React.FC<ArticleCountProps> = ({ collectionId }) => {
    const [count, setCount] = useState<TodayCount>();

    useEffect(() => {
        invoke("today_content_count", {
            collectionId,
        }).then((newCount) => setCount(newCount as TodayCount));
    }, [collectionId]);

    const change = count?.yesterday ? Math.round(((count.today - count.yesterday) / count.yesterday) * 100) : 100;
    const pos: boolean = !!change && change >= 0;
    const percent = change && <span>({`${pos ? "+" : ""}${change}%`})</span>;

    return (
        <motion.hgroup {...motionProps} className="my-8">
            <h2 className="text-3xl">Today</h2>
            <h2 className="text-6xl">{count?.today ?? <>&nbsp;</>}</h2>
            <h3 className="text-lg">Articles {change ? percent : ""}</h3>
        </motion.hgroup>
    );
};
