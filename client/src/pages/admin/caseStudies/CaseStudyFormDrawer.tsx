import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Drawer } from '@/components/admin/Drawer';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import { TagInput } from '@/components/admin/form/TagInput';
import { Button } from '@/components/ui/Button';
import type { CaseStudy } from '@/types/entities';

export interface CaseStudyFormValues {
  title: string;
  client: string;
  coverImage: string;
  problem: string;
  strategy: string;
  solution: string;
  implementation: string;
  results: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialPosition: string;
  status: 'active' | 'inactive' | 'draft';
}

const EMPTY: CaseStudyFormValues = {
  title: '', client: '', coverImage: '', problem: '', strategy: '', solution: '', implementation: '',
  results: '', technologies: [], metrics: [], testimonialQuote: '', testimonialAuthor: '', testimonialPosition: '',
  status: 'active',
};

function toFormValues(cs?: CaseStudy | null): CaseStudyFormValues {
  if (!cs) return EMPTY;
  return {
    title: cs.title, client: cs.client, coverImage: cs.coverImage, problem: cs.problem, strategy: cs.strategy,
    solution: cs.solution, implementation: cs.implementation, results: cs.results, technologies: cs.technologies,
    metrics: cs.metrics, testimonialQuote: cs.testimonialQuote, testimonialAuthor: cs.testimonialAuthor,
    testimonialPosition: cs.testimonialPosition, status: cs.status,
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CaseStudyFormValues) => Promise<void>;
  caseStudy?: CaseStudy | null;
  isSubmitting?: boolean;
}

export function CaseStudyFormDrawer({ open, onClose, onSubmit, caseStudy, isSubmitting }: Props) {
  const { register, control, handleSubmit, reset, watch, setValue } = useForm<CaseStudyFormValues>({
    defaultValues: toFormValues(caseStudy),
  });

  useEffect(() => {
    if (open) reset(toFormValues(caseStudy));
  }, [open, caseStudy, reset]);

  const metrics = useFieldArray({ control, name: 'metrics' });
  const technologies = watch('technologies');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={caseStudy ? 'Edit case study' : 'New case study'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper label="Title" required>
          <Input {...register('title', { required: true })} />
        </FieldWrapper>
        <FieldWrapper label="Client">
          <Input {...register('client')} />
        </FieldWrapper>
        <FieldWrapper label="Cover image URL">
          <Input {...register('coverImage')} />
        </FieldWrapper>
        <FieldWrapper label="Problem"><Textarea rows={2} {...register('problem')} /></FieldWrapper>
        <FieldWrapper label="Strategy"><Textarea rows={2} {...register('strategy')} /></FieldWrapper>
        <FieldWrapper label="Solution"><Textarea rows={2} {...register('solution')} /></FieldWrapper>
        <FieldWrapper label="Implementation"><Textarea rows={2} {...register('implementation')} /></FieldWrapper>
        <FieldWrapper label="Results"><Textarea rows={2} {...register('results')} /></FieldWrapper>
        <FieldWrapper label="Technologies">
          <TagInput value={technologies} onChange={(t) => setValue('technologies', t)} placeholder="Add and press Enter" />
        </FieldWrapper>

        <div className="rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Metrics</h3>
            <Button type="button" variant="ghost" size="sm" onClick={() => metrics.append({ label: '', value: '' })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            {metrics.fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <Input {...register(`metrics.${i}.value` as const)} placeholder="3x" className="w-24" />
                <Input {...register(`metrics.${i}.label` as const)} placeholder="Faster page loads" className="flex-1" />
                <button type="button" onClick={() => metrics.remove(i)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">Testimonial</h3>
          <div className="mt-3 space-y-3">
            <Textarea rows={2} {...register('testimonialQuote')} placeholder="Quote" />
            <div className="grid grid-cols-2 gap-2">
              <Input {...register('testimonialAuthor')} placeholder="Author" />
              <Input {...register('testimonialPosition')} placeholder="Position" />
            </div>
          </div>
        </div>

        <FieldWrapper label="Status">
          <Select {...register('status')}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </Select>
        </FieldWrapper>
      </form>
    </Drawer>
  );
}
