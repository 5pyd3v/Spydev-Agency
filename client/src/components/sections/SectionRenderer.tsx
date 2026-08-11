import type { ComponentType } from 'react';
import type { HomepageSection, HomepageSectionType } from '@/types';
import { HeroSection } from './HeroSection';
import { ServicesSection } from './ServicesSection';
import { CtaSection } from './CtaSection';
import { ClientsSection } from './ClientsSection';
import { StatsSection } from './StatsSection';
import { ProjectsSection } from './ProjectsSection';
import { ProcessSection } from './ProcessSection';
import { TechnologiesSection } from './TechnologiesSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FaqSection } from './FaqSection';
import { PricingSection } from './PricingSection';

const SECTION_COMPONENTS: Partial<Record<HomepageSectionType, ComponentType<{ section: HomepageSection }>>> = {
  hero: HeroSection,
  clients: ClientsSection,
  services: ServicesSection,
  stats: StatsSection,
  projects: ProjectsSection,
  process: ProcessSection,
  technologies: TechnologiesSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  pricing: PricingSection,
  cta: CtaSection,
};

export function SectionRenderer({ sections }: { sections: HomepageSection[] }) {
  return (
    <>
      {sections.map((section) => {
        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) return null;
        return <Component key={section._id} section={section} />;
      })}
    </>
  );
}
