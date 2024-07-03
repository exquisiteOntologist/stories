import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { selectIsLoading } from "../../../redux/features/sessionSlice";

export const LoadingIndicator: React.FC = () => {
    const isLoading = useAppSelector(selectIsLoading);

    if (!isLoading) return null;
    return <p>Is loading</p>;
};
