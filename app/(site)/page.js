import { Hero } from "@/components/home/Hero";
import { TopFunded } from "@/components/home/TopFunded";
import { Categories, CtaBanner, Faq, HowItWorks, Impact, Testimonials } from "@/components/home/Sections";

export const metadata = {
  title: { absolute: "Fundora | Turn your ideas into impact" },
  description:
    "Fundora connects creators with supporters. Start a campaign, back projects with credits, and make a difference together.",
};

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">Fundora: turn your ideas into impact</h1>
      <Hero />
      <TopFunded />
      <HowItWorks />
      <Categories />
      <Impact />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  );
}
