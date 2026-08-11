import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link2 } from 'lucide-react';
import { teamApi } from '@/api/entities.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { staggerContainer } from '@/animations/variants';
import { motion } from 'framer-motion';

export function TeamPage() {
  const { data: team, isLoading } = useQuery({ queryKey: ['team', 'public'], queryFn: () => teamApi.listPublic() });

  return (
    <>
      <Helmet>
        <title>Team — SpyDev</title>
        <meta name="description" content="Meet the engineers, designers, and security specialists behind SpyDev." />
      </Helmet>

      <Container className="py-20">
        <Reveal>
          <span className="text-sm font-medium text-accent">Our team</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            The people building SpyDev.
          </h1>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer(0.06)}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)}

          {team?.map((member) => (
            <motion.div
              key={member._id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="rounded-3xl border border-border bg-surface p-6"
            >
              <div className="flex items-center gap-4">
                {member.profileImage ? (
                  <img src={member.profileImage} alt={member.name} className="h-14 w-14 rounded-2xl object-cover" />
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 font-display text-lg font-semibold text-accent">
                    {member.name.charAt(0)}
                  </span>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">{member.position}</p>
                </div>
              </div>
              {member.shortBio && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{member.shortBio}</p>}
              {member.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {member.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {(member.linkedin || member.github) && (
                <div className="mt-4 flex gap-2 border-t border-border pt-4">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
                    >
                      <Link2 className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
                    >
                      <Link2 className="h-3.5 w-3.5" /> GitHub
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </>
  );
}
