import Image from 'next/image'
import styles from './page.module.css'
import { Me, MeDouble } from '../components/illustrations/me'
import { QuestionsAnsweredText } from '../components/illustrations/questions-answered'
import { AppIcon } from '../components/logos/app-icon'
import { Chip } from '../components/chip'
// import imgScreenshot from '../../public/images/early-screenshot.png'
// import imgScreenshotCards from '../../public/images/early-screenshot-cards.png'
// import imgScreenshotAddSource from '../../public/images/sources-screenshot.png'
import { DownloadButton } from '@/components/buttons/download-button'
import { HeroBg } from '@/components/illustrations/hero-bg'
import React from 'react'
import { HeroLogo } from '@/components/logos/hero-logo'

export default function Home() {
  const chipComingSoon = <Chip variant="orange">Coming Soon</Chip>

  return (
    <main className={styles.main}>
      <HeroBg />
      <header className={styles.headerTop}>
        <span className={styles.devil}>👹</span>
        <div className={styles.intro}>
          <HeroLogo />
          <h1>Make sense of our world<span>,</span></h1>
        </div>
        <figure className={styles.introImg}>
          {/* <Image src={imgScreenshot} alt="Stories provides a view of the world" width={2880/2} height={1424/2} /> */}
          {/* <img src="/images/early-screenshot.png" alt="Stories provides a view of the world" width={2880/2} height={1424/2} /> */}
          {/* <video src="/videos/stories-new.mp4" poster="/videos/stories-new.jpg" muted autoPlay loop width={1280} height={605}></video> */}
          <video src="/videos/stories-new.mp4" poster="/videos/stories-new.jpg" muted autoPlay loop width={1024} height={544}></video>
          {/* <Image src={imgScreenshotCards} alt="Stories provides a view of the world" width={3204/2} height={1660/2} /> */}
        </figure>
      </header>
      <section>
        <div>
          <h2>Your Questions Answered</h2>
          <p>Have information work for you. Your questions and your goals are answered &amp; updated as times change. You don’t have to read the internet yourself.</p>
          {chipComingSoon}
        </div>
        <div className={styles.middle}>
          <QuestionsAnsweredText />
        </div>
      </section>
      <section>
        <div>
          <h2>Context Sensitive</h2>
          <p>Any word, concept, or context has associated words, concepts, and contexts. You can dive deeper into anything. An article could lead to an academic paper and a video, or a wiki.</p>
          {chipComingSoon}
        </div>
        <div className={styles.middle}>
          <img className={styles.floating} src="/images/early-screenshot-find.png" alt="Find things that are associated" width={1200/3} height={1000/3} />
        </div>
      </section>
      <section>
        <div>
          <h2>Your Sources</h2>
          <p>Add your chosen Websites, Subscriptions, and APIs.<br></br>For reading and watching, analysis and search, or all of the above. Automatic updates, refreshing not required.</p>
          <p>&nbsp;</p>
          <p>Viewing content opens original web pages. Publishers rejoice!</p>
          <Chip variant="blue">Read Websites today. More soon.</Chip>{/* <Chip variant="orange">Features coming soon</Chip> */}
        </div>
        <div className={styles.middle}>
          {/* <Image className={styles.floating} src={imgScreenshotAddSource} alt="Stories provides a view of the world" width={786/2} height={682/2} /> */}
          {/* <img className={styles.floating} src="/images/sources-screenshot.png" alt="Stories provides a view of the world" width={786/2} height={682/2} /> */}
          <video className={styles.floating} src="/videos/stories-vi-02.mp4" poster="/videos/stories-vi-02.jpg" muted autoPlay loop width={393} height={341}></video>
        </div>
      </section>
      <section>
        <div>
          <h2>Compatible. Decent.</h2>
          <p>You can use it on any major desktop OS and you don't need to hand anything over just to experience it.</p>
          <p>&nbsp;</p>
          <AppIcon />
        </div>
        <div className={styles.topCenter}>
          <MeDouble />
        </div>
      </section>
      <footer>
        <DownloadButton />
      </footer>
    </main>
  )
}
