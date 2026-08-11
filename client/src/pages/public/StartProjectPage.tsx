import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import { TagInput } from '@/components/admin/form/TagInput';
import { leadsApi } from '@/api/leads.api';
import { getApiErrorMessage } from '@/api/axiosClient';

const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  projectDescription: z.string().min(1, 'Please describe your project'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  requiredTechnologies: z.array(z.string()).optional(),
  referenceLinks: z.array(z.string()).optional(),
});

type InquiryForm = z.infer<typeof inquirySchema>;

const PROJECT_TYPES = ['Web Development', 'Mobile App', 'AI Agent / Automation', 'Custom Software', 'Cybersecurity', 'Other'];
const BUDGETS = ['Under $5,000', '$5,000 – $15,000', '$15,000 – $50,000', '$50,000+', 'Not sure yet'];
const TIMELINES = ['ASAP', '1–3 months', '3–6 months', '6+ months', 'Flexible'];

export function StartProjectPage() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InquiryForm>({ resolver: zodResolver(inquirySchema), defaultValues: { requiredTechnologies: [], referenceLinks: [] } });

  const technologies = watch('requiredTechnologies') ?? [];
  const referenceLinks = watch('referenceLinks') ?? [];

  const onSubmit = async (values: InquiryForm) => {
    try {
      const res = await leadsApi.submitProjectInquiry(values);
      toast.success(res.message);
      reset({ requiredTechnologies: [], referenceLinks: [] });
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Something went wrong — please try again.'));
    }
  };

  return (
    <>
      <Helmet>
        <title>Start a Project — SpyDev</title>
        <meta name="description" content="Tell us about your project and get a response from the SpyDev team." />
      </Helmet>

      <Container className="max-w-3xl py-20">
        <Reveal>
          <span className="text-sm font-medium text-accent">Start a project</span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">Tell us what you're building.</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            The more detail you give us, the faster we can scope your project and come back with a real plan.
          </p>
        </Reveal>

        <Reveal className="mt-10 rounded-3xl border border-border bg-surface p-8">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

            <FieldWrapper label="Project type">
              <Select {...register('projectType')} defaultValue="">
                <option value="">Select a type</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </FieldWrapper>

            <FieldWrapper label="Project description" required error={errors.projectDescription?.message}>
              <Textarea rows={5} {...register('projectDescription')} placeholder="What are you building, and what problem does it solve?" />
            </FieldWrapper>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldWrapper label="Budget">
                <Select {...register('budget')} defaultValue="">
                  <option value="">Select a range</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </Select>
              </FieldWrapper>
              <FieldWrapper label="Timeline">
                <Select {...register('timeline')} defaultValue="">
                  <option value="">Select a timeline</option>
                  {TIMELINES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </FieldWrapper>
            </div>

            <FieldWrapper label="Required technologies" hint="Optional — if you already have preferences">
              <TagInput value={technologies} onChange={(v) => setValue('requiredTechnologies', v)} placeholder="Add and press Enter" />
            </FieldWrapper>

            <FieldWrapper label="Reference links" hint="Optional — sites or apps you like">
              <TagInput value={referenceLinks} onChange={(v) => setValue('referenceLinks', v)} placeholder="Add a URL and press Enter" />
            </FieldWrapper>

            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Submitting…' : 'Submit inquiry'}
            </Button>
          </form>
        </Reveal>
      </Container>
    </>
  );
}
