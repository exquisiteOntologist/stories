import { downloadLink } from '@/data/urls';
import styles from './download-button.module.css';

export const DownloadButton: React.FC = () => (
    <div className={styles.download}>
        <a className={styles.downloadButton} href={downloadLink} target="_blank">Download</a>
        <div className={styles.byTheWay}>( Free &amp; Private )</div>
    </div>
)
