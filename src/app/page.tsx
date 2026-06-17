import { FloatingNav } from "@/components/layout/floating-nav";
import { Footer } from "@/components/layout/footer";
import { BeforeAfterSection } from "@/components/sections/before-after-section";
import { EcosystemStrip } from "@/components/sections/ecosystem-strip";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { InferenceProfilingSection } from "@/components/sections/inference-profiling-section";
import { MaintainersSection } from "@/components/sections/maintainers-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { SpotlightSection } from "@/components/sections/spotlight-section";
import { TuiShowcase } from "@/components/sections/tui-showcase";
import { WhatsNewSection } from "@/components/sections/whats-new-section";
import { WorkflowShowcase } from "@/components/sections/workflow-showcase";

export default function Home() {
  return (
    <>
      <FloatingNav />
      <main id="main-content" className="overflow-x-clip">
        <HeroSection />
        <EcosystemStrip />
        <WhatsNewSection />
        <ProblemSection />
        <SpotlightSection />
        <InferenceProfilingSection />
        <WorkflowShowcase />
        <TuiShowcase />
        <BeforeAfterSection />
        <MaintainersSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
