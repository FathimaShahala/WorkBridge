import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Roles from "../components/landing/Roles";
import Statistics from "../components/landing/Statistics";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <Features />

        <HowItWorks />


        <Roles />

        <Statistics />

        <Testimonials />


        <CTA />
      </main>

      <Footer />
    </>
  );
};

export default LandingPage;