import { LogoAlt } from '@/components/logos/logo-alt'
import Image from 'next/image'
import styles from './page.module.css'
import imgScreenshot from '../../public/images/early-screenshot.png'
import { DownloadButton } from '@/components/buttons/download-button'

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.headerTop}>
        <LogoAlt />
        <DownloadButton />
      </header>
      <div className={styles.intro}>
        <h1>Make sense of our world</h1>
        <h2>Browsing, Updates, Answers.</h2>
      </div>
      <figure className={styles.introImg}>
        <Image src={imgScreenshot} alt="Stories provides a view of the world" width={2792/2} height={1424/2} />
      </figure>
    </main>
  )
}
