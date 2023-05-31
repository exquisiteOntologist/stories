import { downloadLink } from '@/data/urls';
import styles from './download-button.module.css';

const dlCopy = {
    download: 'Download',
    sourceCode: 'Get Source'
}

export const DownloadButton: React.FC = () => (
    <div className={styles.download}>
        <a className={styles.downloadButton} href={downloadLink} target="_blank">{dlCopy.sourceCode}</a>
        <div className={styles.byTheWay}>( Free &amp; Private )</div>
    </div>
)
