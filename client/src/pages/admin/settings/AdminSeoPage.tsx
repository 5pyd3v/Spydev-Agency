import { useSettingsForm } from '@/hooks/admin/useSettingsForm';
import { Button } from '@/components/ui/Button';
import { FieldWrapper, Input, Textarea } from '@/components/admin/form/FormField';
import { Switch } from '@/components/admin/Switch';
import { Skeleton } from '@/components/ui/Skeleton';
import { TagInput } from '@/components/admin/form/TagInput';

interface FormState {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  noindex: boolean;
}

export function AdminSeoPage() {
  const { settings, isLoading, form, save, isSaving } = useSettingsForm<FormState>((s) => ({
    title: s.seoDefaults?.title ?? '',
    description: s.seoDefaults?.description ?? '',
    keywords: s.seoDefaults?.keywords ?? [],
    ogTitle: s.seoDefaults?.ogTitle ?? '',
    ogDescription: s.seoDefaults?.ogDescription ?? '',
    ogImage: s.seoDefaults?.ogImage ?? '',
    noindex: s.seoDefaults?.noindex ?? false,
  }));

  const { register, handleSubmit, watch, setValue } = form;
  const values = watch();

  const onSubmit = (values: FormState) => save({ seoDefaults: values });

  if (isLoading || !settings) return <Skeleton className="h-96 w-full max-w-2xl rounded-3xl" />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-foreground">SEO</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Site-wide SEO defaults, used when a page doesn't set its own. <code className="rounded bg-surface px-1.5 py-0.5">/sitemap.xml</code> and{' '}
        <code className="rounded bg-surface px-1.5 py-0.5">/robots.txt</code> are generated automatically.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper label="Default SEO title"><Input {...register('title')} /></FieldWrapper>
        <FieldWrapper label="Default meta description"><Textarea rows={2} {...register('description')} /></FieldWrapper>
        <FieldWrapper label="Keywords">
          <TagInput value={values.keywords} onChange={(v) => setValue('keywords', v)} placeholder="Add and press Enter" />
        </FieldWrapper>
        <FieldWrapper label="Default Open Graph title"><Input {...register('ogTitle')} /></FieldWrapper>
        <FieldWrapper label="Default Open Graph description"><Textarea rows={2} {...register('ogDescription')} /></FieldWrapper>
        <FieldWrapper label="Default Open Graph image URL"><Input {...register('ogImage')} /></FieldWrapper>

        <div className="flex items-center justify-between rounded-xl border border-border p-3">
          <div>
            <span className="text-sm font-medium text-foreground">Discourage search engines</span>
            <p className="text-xs text-muted-foreground">Adds a site-wide noindex hint. Leave off in production.</p>
          </div>
          <Switch checked={values.noindex} onChange={(v) => setValue('noindex', v)} />
        </div>

        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : 'Save changes'}</Button>
      </form>
    </div>
  );
}
