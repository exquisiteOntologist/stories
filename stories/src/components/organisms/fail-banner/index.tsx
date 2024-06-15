import { invoke } from "@tauri-apps/api/core";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { selectLaunchDate } from "../../../redux/features/sessionSlice";
import { minutesSince } from "../../../utilities/dates";

export const FailBanner: React.FC = () => {
    const launched = useAppSelector(selectLaunchDate);
    const [isUpdating, setIsUpdating] = useState<boolean>(true);

    useEffect(() => {
        const checkIsUpdating = () => {
            const expectAnUpdate = minutesSince(launched) > 15;
            if (expectAnUpdate) {
                invoke("retrievals_is_updating").then((working) => setIsUpdating(working as boolean));
            }
            setTimeout(() => requestAnimationFrame(checkIsUpdating), 1000 * 60);
        };

        checkIsUpdating();
    }, [setIsUpdating]);

    if (isUpdating) return null;

    return (
        <div className="bg-rose-700 p-4 my-12">
            <p>
                <span className="font-bold">Note:</span> The content update process has stopped. Restart the app to start.
            </p>
        </div>
    );
};
