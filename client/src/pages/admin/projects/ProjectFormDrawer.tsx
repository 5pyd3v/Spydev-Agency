import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Drawer } from '@/components/admin/Drawer';
import { FieldWrapper, Input, Select, Textarea } from '@/components/admin/form/FormField';
import { TagInput } from '@/components/admin/form/TagInput';
import { Switch } from '@/components/admin/Switch';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types/entities';

export interface ProjectFormValues {
  name: string;
  client: string;
  category: Project['category'];
  description: string;
  challenge: string;
  solution: string;
  results: string;
  technologies: string[];
  coverImage: string;
  projectUrl: string;
  githubUrl: string;
  featured: boolean;
  status: 'active' | 'inactive' | 'draft';
}

const EMPTY: ProjectFormValues = {
  name: '', client: '', category: 'web', description: '', challenge: '', solution: '', results: '',
  technologies: [], coverImage: '', projectUrl: '', githubUrl: '', featured: false, status: 'active',
};

const CATEGORIES: Project['category'][] = ['web', 'mobile', 'ai', 'saas', 'cybersecurity', 'ecommerce'];

function toFormValues(project?: Project | null): ProjectFormValues {
  if (!project) return EMPTY;
  return {
    name: project.name, client: project.client, category: project.category, description: project.description,
    challenge: project.challenge, solution: project.solution, results: project.results,
    technologies: project.technologies, coverImage: project.coverImage, projectUrl: project.projectUrl,
    githubUrl: project.githubUrl, featured: project.featured, status: project.status,
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  project?: Project | null;
  isSubmitting?: boolean;
}

export function ProjectFormDrawer({ open, onClose, onSubmit, project, isSubmitting }: Props) {
  const { register, handleSubmit, reset, watch, setValue } = useForm<ProjectFormValues>({ defaultValues: toFormValues(project) });

  useEffect(() => {
    if (open) reset(toFormValues(project));
  }, [open, project, reset]);

  const technologies = watch('technologies');
  const featured = watch('featured');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={project ? 'Edit project' : 'New project'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save project'}
          </Button>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper label="Project name" required>
          <Input {...register('name', { required: true })} />
        </FieldWrapper>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Client">
            <Input {...register('client')} />
          </FieldWrapper>
          <FieldWrapper label="Category">
            <Select {...register('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FieldWrapper>
        </div>
        <FieldWrapper label="Description" required>
          <Textarea rows={3} {...register('description', { required: true })} />
        </FieldWrapper>
        <FieldWrapper label="Cover image URL">
          <Input {...register('coverImage')} />
        </FieldWrapper>
        <FieldWrapper label="Challenge">
          <Textarea rows={2} {...register('challenge')} />
        </FieldWrapper>
        <FieldWrapper label="Solution">
          <Textarea rows={2} {...register('solution')} />
        </FieldWrapper>
        <FieldWrapper label="Results">
          <Textarea rows={2} {...register('results')} />
        </FieldWrapper>
        <FieldWrapper label="Technologies">
          <TagInput value={technologies} onChange={(t) => setValue('technologies', t)} placeholder="Add and press Enter" />
        </FieldWrapper>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrapper label="Project URL">
            <Input {...register('projectUrl')} />
          </FieldWrapper>
          <FieldWrapper label="GitHub URL">
            <Input {...register('githubUrl')} />
          </FieldWrapper>
        </div>
        <FieldWrapper label="Status">
          <Select {...register('status')}>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
          </Select>
        </FieldWrapper>
        <div className="flex items-center justify-between rounded-xl border border-border p-3">
          <span className="text-sm font-medium text-foreground">Featured</span>
          <Switch checked={featured} onChange={(v) => setValue('featured', v)} />
        </div>
      </form>
    </Drawer>
  );
}
