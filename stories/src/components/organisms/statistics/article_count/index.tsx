import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export interface ArticleCountProps {
    collectionId: number;
}

export const ArticleCount: React.FC<ArticleCountProps> = ({ collectionId }) => {
    const [count, setCount] = useState<number>();

    useEffect(() => {
        invoke("today_content_count", {
            collectionId,
        }).then((newCount) => setCount(newCount as number));
    }, [collectionId]);

    return (
        <hgroup className="my-8">
            <h2 className="text-3xl">Today</h2>
            <h2 className="text-6xl">{count}</h2>
            <h3 className="text-lg">Articles</h3>
        </hgroup>
    );
};
