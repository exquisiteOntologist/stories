import { invoke } from "@tauri-apps/api/core";
import React, { useState } from "react";

export const FailBanner: React.FC = () => {
    const [isUpdating, setIsUpdating] = useState<boolean>(true);

    const checkIsUpdating = () => {
        invoke("retrievals_is_updating").then((working) => setIsUpdating(working as boolean));
        setTimeout(() => requestAnimationFrame(checkIsUpdating), 1000 * 60);
    };

    checkIsUpdating();

    if (isUpdating) return null;

    return (
        <div className="bg-rose-700 p-4 my-12">
            <p>
                <span className="font-bold">Note:</span> The content update process has stopped. Restart the app to start.
            </p>
        </div>
    );
};
