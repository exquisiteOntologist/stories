import { ReactNode } from 'react';
import styles from './chip.module.css';

type ChipVariant = 'default' | 'blue' | 'orange'

interface ChipProps {
    children: ReactNode,
    variant: ChipVariant
}

export const Chip: React.FC<ChipProps> = ({children, variant}) => (
    <div className={styles.chip} data-variant={variant}>
        {children}
    </div>
)
