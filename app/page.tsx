import Hero from '@/components/Hero';
import NavbarCentered from '@/components/NavbarCentered';
import UploadSectionActive from '@/components/UploadSectionActive';
// import UploadSection from '@/components/UploadSection'; // yedek
//import ProductList from '@/components/ProductList';
import Reviews from '@/components/Reviews';
//import Features from '@/components/Features';
import HowItWorksAlt from '@/components/HowItWorksAlt';
import Footer from '@/components/Footer';
import ClickSparkles from '@/components/ClickSparkles';
import ChatBot from '@/components/ChatBot';
import HowItWorksAltCards from '@/components/HowItWorksAltCards';
import ScrollReveal from '@/components/ScrollReveal';

export default function Home() {
  return (
    <main className="min-h-screen">
      <ClickSparkles />
      <NavbarCentered />
      <ScrollReveal delayMs={0}>
        <Hero />
      </ScrollReveal>
      <ScrollReveal delayMs={120}>
        <UploadSectionActive />
      </ScrollReveal>
      {/* <ProductList /> */}
    {/*  <Features /> */}
    <ScrollReveal delayMs={240}>
      <HowItWorksAltCards />
    </ScrollReveal>
     {/* <HowItWorksAlt /> */}
    <ScrollReveal delayMs={360}>
      <Reviews />
    </ScrollReveal>
      <ScrollReveal delayMs={480}>
        <Footer />
      </ScrollReveal>
      <ChatBot />
    </main>
  );
}
