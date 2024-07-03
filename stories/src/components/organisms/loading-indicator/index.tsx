import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { selectIsLoading } from "../../../redux/features/sessionSlice";
import { IconLoadingRing } from "../../atoms/icons/icon-loading-ring";
import { motionProps } from "../../../utilities/animate";
import { AnimatePresence, motion } from "framer-motion";

export const LoadingIndicator: React.FC = () => {
    const isLoading = useAppSelector(selectIsLoading);

    return (
        <AnimatePresence>
            <motion.div {...motionProps} className="fixed top-12 left-40">
                {isLoading && <IconLoadingRing />}
            </motion.div>
        </AnimatePresence>
    );
};
