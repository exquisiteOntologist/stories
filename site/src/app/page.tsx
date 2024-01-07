import styles from './page.module.css'
import { MeDouble } from '../components/illustrations/me'
import { QuestionsAnsweredText } from '../components/illustrations/questions-answered'
import { AppIcon } from '../components/logos/app-icon'
import { Chip } from '../components/chip'
import { DownloadButton } from '@/components/buttons/download-button'
import { HeroBg } from '@/components/illustrations/hero-bg'
import React from 'react'
import { HeroLogo } from '@/components/logos/hero-logo'
import { DownloadBar } from '@/components/download-bar'

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
          {/* <video src="/videos/stories-new.mp4" poster="/videos/stories-new.jpg" muted autoPlay loop width={1280} height={605}></video> */}
          <video src="/videos/stories-new.mp4" poster="/videos/stories-new.jpg" muted autoPlay loop width={1024} height={544}></video>
        </figure>
        <DownloadBar />
      </header>
      <section>
        <div>
          <h2>Your Sources are your Program</h2>
          <p>Add your chosen websites and APIs for your content, and automatically receive content updates.</p>
          <p>&nbsp;</p>
          <p>Viewing content opens original web pages. Publishers rejoice!</p>
          <Chip variant="blue">Read Websites today. More soon.</Chip>
        </div>
        <div className={styles.middle}>
          <video className={styles.floating} src="/videos/stories-vi-02.mp4" poster="/videos/stories-vi-02.jpg" muted autoPlay loop width={393} height={341}></video>
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
          <h2>Compatible. Decent.</h2>
          <p>You can use it on any major desktop OS and you don't need to hand anything over just to experience it.</p>
          <p>&nbsp;</p>
          <AppIcon />
        </div>
        <div className={styles.topCenter}>
          <MeDouble />
        </div>
      </section>
    </main>
  )
}
