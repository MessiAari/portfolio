import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Journey } from "@/components/sections/journey";
import { OtherBuilds } from "@/components/sections/other-builds";
import { Contact } from "@/components/sections/contact";
import { ChatWidget } from "@/components/chat-widget";
import { showOtherBuilds } from "@/lib/portfolio-data";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Manifesto />
        <About />
        <Skills />
        <Projects />
        <Journey />
        {showOtherBuilds && <OtherBuilds />}
        <Contact />
      </main>
      <ChatWidget />
    </>
  );
}
