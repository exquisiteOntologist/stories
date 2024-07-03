import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { selectIsLoading } from "../../../redux/features/sessionSlice";
import { IconLoadingRing } from "../../atoms/icons/icon-loading-ring";

export const LoadingIndicator: React.FC = () => {
    const isLoading = useAppSelector(selectIsLoading);

    const spinner = <IconLoadingRing />;

    return spinner;

    // if (!isLoading) return null;
    // return <p>Is loading</p>;
};
