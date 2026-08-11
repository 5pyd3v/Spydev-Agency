import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Drawer } from '@/components/admin/Drawer';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import { TagInput } from '@/components/admin/form/TagInput';
import { Button } from '@/components/ui/Button';
import type { Service } from '@/types';

const featureSchema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string(),
  icon: z.string(),
});

const stepSchema = z.object({ title: z.string().min(1, 'Required'), description: z.string() });
const faqSchema = z.object({ question: z.string().min(1, 'Required'), answer: z.string() });

const serviceFormSchema = z.object({
  title: z.string().min(2, 'Title is required').max(120),
  shortDescription: z.string().min(1, 'Short description is required').max(300),
  fullDescription: z.string(),
  icon: z.string(),
  heroImage: z.string(),
  technologies: z.array(z.string()),
  features: z.array(featureSchema),
  process: z.array(stepSchema),
  faqs: z.array(faqSchema),
  ctaText: z.string(),
  ctaUrl: z.string(),
  status: z.enum(['active', 'inactive', 'draft']),
  seoTitle: z.string(),
  seoDescription: z.string(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

function toFormValues(service?: Service | null): ServiceFormValues {
  if (!service) {
    return {
      title: '',
      shortDescription: '',
      fullDescription: '',
      icon: 'code-2',
      heroImage: '',
      technologies: [],
      features: [],
      process: [],
      faqs: [],
      ctaText: 'Start a project',
      ctaUrl: '/start-project',
      status: 'active',
      seoTitle: '',
      seoDescription: '',
    };
  }
  return {
    title: service.title,
    shortDescription: service.shortDescription,
    fullDescription: service.fullDescription,
    icon: service.icon,
    heroImage: service.heroImage,
    technologies: service.technologies,
    features: service.features,
    process: service.process,
    faqs: service.faqs,
    ctaText: service.ctaText,
    ctaUrl: service.ctaUrl,
    status: service.status,
    seoTitle: service.seo?.title ?? '',
    seoDescription: service.seo?.description ?? '',
  };
}

export function serviceFormToPayload(values: ServiceFormValues): Partial<Service> {
  return {
    title: values.title,
    shortDescription: values.shortDescription,
    fullDescription: values.fullDescription,
    icon: values.icon,
    heroImage: values.heroImage,
    technologies: values.technologies,
    features: values.features,
    process: values.process,
    faqs: values.faqs,
    ctaText: values.ctaText,
    ctaUrl: values.ctaUrl,
    status: values.status,
    seo: { title: values.seoTitle, description: values.seoDescription },
  };
}

interface ServiceFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  service?: Service | null;
  isSubmitting?: boolean;
}

export function ServiceFormDrawer({ open, onClose, onSubmit, service, isSubmitting }: ServiceFormDrawerProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: toFormValues(service),
  });

  useEffect(() => {
    if (open) reset(toFormValues(service));
  }, [open, service, reset]);

  const featuresArray = useFieldArray({ control, name: 'features' });
  const processArray = useFieldArray({ control, name: 'process' });
  const faqsArray = useFieldArray({ control, name: 'faqs' });
  const technologies = watch('technologies');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={service ? 'Edit service' : 'New service'}
      description="Changes appear on the public site immediately after saving."
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save service'}
          </Button>
        </div>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper label="Title" error={errors.title?.message} required>
          <Input {...register('title')} placeholder="Web Development" />
        </FieldWrapper>

        <FieldWrapper label="Short description" error={errors.shortDescription?.message} required>
          <Textarea {...register('shortDescription')} rows={2} placeholder="One or two sentences for cards and previews" />
        </FieldWrapper>

        <FieldWrapper label="Full description" error={errors.fullDescription?.message}>
          <Textarea {...register('fullDescription')} rows={4} placeholder="Detailed description for the service page" />
        </FieldWrapper>

        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Icon" hint="lucide.dev name, e.g. code-2" error={errors.icon?.message}>
            <Input {...register('icon')} placeholder="code-2" />
          </FieldWrapper>
          <FieldWrapper label="Status">
            <Select {...register('status')}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FieldWrapper>
        </div>

        <FieldWrapper label="Hero image URL">
          <Input {...register('heroImage')} placeholder="https://…" />
        </FieldWrapper>

        <FieldWrapper label="Technologies">
          <TagInput value={technologies} onChange={(tags) => setValue('technologies', tags)} placeholder="Add and press Enter" />
        </FieldWrapper>

        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="CTA text">
            <Input {...register('ctaText')} />
          </FieldWrapper>
          <FieldWrapper label="CTA URL">
            <Input {...register('ctaUrl')} />
          </FieldWrapper>
        </div>

        <div className="rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Features</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => featuresArray.append({ title: '', description: '', icon: 'sparkles' })}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
          <div className="mt-3 space-y-3">
            {featuresArray.fields.map((field, i) => (
              <div key={field.id} className="flex gap-2 rounded-xl bg-surface p-3">
                <div className="flex-1 space-y-2">
                  <Input {...register(`features.${i}.title` as const)} placeholder="Feature title" />
                  <Input {...register(`features.${i}.description` as const)} placeholder="Short description" />
                </div>
                <button
                  type="button"
                  onClick={() => featuresArray.remove(i)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {featuresArray.fields.length === 0 && (
              <p className="text-xs text-muted-foreground">No features added yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Process steps</h3>
            <Button type="button" variant="ghost" size="sm" onClick={() => processArray.append({ title: '', description: '' })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
          <div className="mt-3 space-y-3">
            {processArray.fields.map((field, i) => (
              <div key={field.id} className="flex gap-2 rounded-xl bg-surface p-3">
                <div className="flex-1 space-y-2">
                  <Input {...register(`process.${i}.title` as const)} placeholder="Step title" />
                  <Input {...register(`process.${i}.description` as const)} placeholder="Short description" />
                </div>
                <button
                  type="button"
                  onClick={() => processArray.remove(i)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {processArray.fields.length === 0 && <p className="text-xs text-muted-foreground">No steps added yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">FAQs</h3>
            <Button type="button" variant="ghost" size="sm" onClick={() => faqsArray.append({ question: '', answer: '' })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
          <div className="mt-3 space-y-3">
            {faqsArray.fields.map((field, i) => (
              <div key={field.id} className="flex gap-2 rounded-xl bg-surface p-3">
                <div className="flex-1 space-y-2">
                  <Input {...register(`faqs.${i}.question` as const)} placeholder="Question" />
                  <Textarea {...register(`faqs.${i}.answer` as const)} placeholder="Answer" rows={2} />
                </div>
                <button
                  type="button"
                  onClick={() => faqsArray.remove(i)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {faqsArray.fields.length === 0 && <p className="text-xs text-muted-foreground">No FAQs added yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">SEO</h3>
          <div className="mt-3 space-y-3">
            <FieldWrapper label="SEO title">
              <Input {...register('seoTitle')} placeholder="Defaults to service title" />
            </FieldWrapper>
            <FieldWrapper label="SEO description">
              <Textarea {...register('seoDescription')} rows={2} placeholder="Defaults to short description" />
            </FieldWrapper>
          </div>
        </div>
      </form>
    </Drawer>
  );
}
