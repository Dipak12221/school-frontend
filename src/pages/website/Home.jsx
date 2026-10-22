
import Hero from "../../components/website/Hero/Hero";
import About from "../../components/website/About/About";
import PrincipalMessage from "../../components/website/PrincipalMessage/PrincipalMessage";
import ChairmanMessage from "../../components/website/ChairmanMessage/ChairmanMessage";
import Facilities from "../../components/website/Facilities/Facilities";
import Statistics from "../../components/website/Statistics/Statistics";
import NoticeBoard from "../../components/website/NoticeBoard/NoticeBoard";
import Events from "../../components/website/Events/Events";
import Gallery from "../../components/website/Gallery/Gallery";
import Testimonials from "../../components/website/Testimonials/Testimonials";
import Contact from "../../components/website/Contact/Contact";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <PrincipalMessage />
      <ChairmanMessage />
      <Facilities />
      <Statistics />
      <NoticeBoard />
      <Events />
      <Gallery />
      <Testimonials />
      <Contact />
    </>
  );
}

export default Home;