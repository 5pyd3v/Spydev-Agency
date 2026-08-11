import { useQuery } from '@tanstack/react-query';
import { clientsApi } from '@/api/entities.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import type { HomepageSection } from '@/types';

export function ClientsSection({ section }: { section: HomepageSection }) {
  const { data: clients } = useQuery({ queryKey: ['clients', 'public'], queryFn: () => clientsApi.listPublic() });
  if (!clients || clients.length === 0) return null;

  return (
    <section className="py-14">
      <Container>
        <Reveal>
          {section.heading && (
            <p className="mb-8 text-center text-sm font-medium text-muted-foreground">{section.heading}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-80 grayscale transition-opacity hover:opacity-100 hover:grayscale-0">
            {clients.map((client) =>
              client.websiteUrl ? (
                <a key={client._id} href={client.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <img src={client.logoUrl} alt={client.name} className="h-7 w-auto object-contain sm:h-8" />
                </a>
              ) : (
                <img key={client._id} src={client.logoUrl} alt={client.name} className="h-7 w-auto object-contain sm:h-8" />
              )
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
