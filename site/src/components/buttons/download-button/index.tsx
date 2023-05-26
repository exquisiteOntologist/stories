import styles from './download-button.module.css';

export const DownloadButton: React.FC = () => (
    <div className={styles.download}>
        <a className={styles.downloadButton} href="#">Download</a>
        <div className={styles.byTheWay}>( Free &amp; Private )</div>
    </div>
)