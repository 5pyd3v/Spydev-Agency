import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import { leadsApi } from '@/api/leads.api';
import { getApiErrorMessage } from '@/api/axiosClient';
import { useSettings } from '@/hooks/queries/useSettings';
import { usePublicServices } from '@/hooks/queries/useServices';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

type ContactForm = z.infer<typeof contactSchema>;

export function ContactPage() {
  const { data: settings } = useSettings();
  const { data: services } = usePublicServices();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactForm) => {
    try {
      const res = await leadsApi.submitContact(values);
      toast.success(res.message);
      reset();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Something went wrong — please try again.'));
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact — SpyDev</title>
        <meta name="description" content="Get in touch with the SpyDev team." />
      </Helmet>

      <Container className="py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <span className="text-sm font-medium text-accent">Contact</span>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">Let's talk.</h1>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Tell us a bit about what you need — we typically respond within one business day.
            </p>

            <div className="mt-10 space-y-4">
              {settings?.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 text-sm text-foreground hover:text-accent">
                  <Mail className="h-4 w-4 text-accent" /> {settings.contactEmail}
                </a>
              )}
              {settings?.contactPhone && (
                <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-3 text-sm text-foreground hover:text-accent">
                  <Phone className="h-4 w-4 text-accent" /> {settings.contactPhone}
                </a>
              )}
              {settings?.address && (
                <p className="flex items-center gap-3 text-sm text-foreground">
                  <MapPin className="h-4 w-4 text-accent" /> {settings.address}
                </p>
              )}
            </div>
          </Reveal>

          <Reveal className="rounded-3xl border border-border bg-surface p-8">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrapper label="Name" required error={errors.name?.message}>
                  <Input {...register('name')} />
                </FieldWrapper>
                <FieldWrapper label="Email" required error={errors.email?.message}>
                  <Input type="email" {...register('email')} />
                </FieldWrapper>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrapper label="Phone">
                  <Input {...register('phone')} />
                </FieldWrapper>
                <FieldWrapper label="Company">
                  <Input {...register('company')} />
                </FieldWrapper>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrapper label="Service">
                  <Select {...register('service')} defaultValue="">
                    <option value="">Select a service</option>
                    {services?.map((s) => (
                      <option key={s._id} value={s.title}>{s.title}</option>
                    ))}
                  </Select>
                </FieldWrapper>
                <FieldWrapper label="Budget">
                  <Input {...register('budget')} placeholder="$5,000 – $15,000" />
                </FieldWrapper>
              </div>
              <FieldWrapper label="Message" required error={errors.message?.message}>
                <Textarea rows={5} {...register('message')} />
              </FieldWrapper>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
