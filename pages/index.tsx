import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className="bg-neutral-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0 scrollbar-hide">
      <Head>
        <title>Fluent</title>
      </Head>
      <Header />
      {/* Hero */}
      <section id="hero" className="snap-start">
        <Hero />
      </section>
      {/* Services */}
      <section id="services" className="snap-center">
        <Services />
      </section>
      {/* Footer */}
      <section id="footer" className="snap-end">
        <Footer />
      </section>
    </div>
  );
}