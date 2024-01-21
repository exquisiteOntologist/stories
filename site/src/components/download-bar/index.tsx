import { downloadLink } from '@/data/urls'
import React from 'react'
import styles from './download-bar.module.css'

export const DownloadBar: React.FC = () => (
    <div className={styles.downloadBar}>
        <div>
            Get the <span className={styles.semibold}>answers</span> to what is <span className={styles.semibold}>actually</span> happening
        </div>
        <a className={styles.downloadButton} href={downloadLink} target="_blank">Download</a>
    </div>
)

