import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { selectSession, selectShouldHaveUpdated } from "../../../redux/features/sessionSlice";

export const FailBanner: React.FC = () => {
    const { hasRecentUpdates } = useAppSelector(selectSession);
    const shouldHaveUpdated = useAppSelector(selectShouldHaveUpdated);

    if (shouldHaveUpdated ? hasRecentUpdates : true) return null;

    return (
        <div className="bg-rose-700 p-4 my-12">
            <p>
                <span className="font-bold">Note:</span> The content update process has stopped. Restart the app to start.
            </p>
        </div>
    );
};
