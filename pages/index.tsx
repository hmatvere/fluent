import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className='bg-neutral-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0'>
      <Head>
        <title>Fluent</title>
      </Head>

      <Header />

      {/* Hero */}
      <section id='hero' className='snap-center'>
        <Hero />
      </section>


      {/* About */}

      {/* Services */}

      {/* Contact */}

    </div>
  )
}
