import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useSettingsForm } from '@/hooks/admin/useSettingsForm';
import { Button } from '@/components/ui/Button';
import { FieldWrapper, Input, Textarea } from '@/components/admin/form/FormField';
import { Switch } from '@/components/admin/Switch';
import { Skeleton } from '@/components/ui/Skeleton';
import type { SocialLink } from '@/types';

interface FormState {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  footerText: string;
  socialLinks: SocialLink[];
  announcementEnabled: boolean;
  announcementText: string;
  announcementLinkText: string;
  announcementLinkUrl: string;
  notifyOnContactLead: boolean;
  notifyOnProjectInquiry: boolean;
}

export function AdminSettingsPage() {
  const { settings, isLoading, form, save, isSaving } = useSettingsForm<FormState>((s) => ({
    siteName: s.siteName,
    tagline: s.tagline,
    contactEmail: s.contactEmail,
    contactPhone: s.contactPhone,
    address: s.address,
    footerText: s.footerText,
    socialLinks: s.socialLinks,
    announcementEnabled: s.announcement.enabled,
    announcementText: s.announcement.text,
    announcementLinkText: s.announcement.linkText,
    announcementLinkUrl: s.announcement.linkUrl,
    notifyOnContactLead: s.emailNotifications.notifyOnContactLead,
    notifyOnProjectInquiry: s.emailNotifications.notifyOnProjectInquiry,
  }));

  const { register, control, handleSubmit, watch, setValue } = form;
  const values = watch();
  const socialLinks = useFieldArray({ control, name: 'socialLinks' });

  const onSubmit = (values: FormState) =>
    save({
      siteName: values.siteName,
      tagline: values.tagline,
      contactEmail: values.contactEmail,
      contactPhone: values.contactPhone,
      address: values.address,
      footerText: values.footerText,
      socialLinks: values.socialLinks,
      announcement: {
        enabled: values.announcementEnabled,
        text: values.announcementText,
        linkText: values.announcementLinkText,
        linkUrl: values.announcementLinkUrl,
        dismissible: true,
      },
      emailNotifications: {
        notifyOnContactLead: values.notifyOnContactLead,
        notifyOnProjectInquiry: values.notifyOnProjectInquiry,
      },
    });

  if (isLoading || !settings) return <Skeleton className="h-96 w-full max-w-2xl rounded-3xl" />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">General site information, contact details, and notifications.</p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">General</h2>
          <div className="mt-4 space-y-4">
            <FieldWrapper label="Site name"><Input {...register('siteName')} /></FieldWrapper>
            <FieldWrapper label="Tagline"><Input {...register('tagline')} /></FieldWrapper>
            <FieldWrapper label="Footer text"><Input {...register('footerText')} /></FieldWrapper>
          </div>
        </div>

        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FieldWrapper label="Contact email"><Input {...register('contactEmail')} /></FieldWrapper>
            <FieldWrapper label="Contact phone"><Input {...register('contactPhone')} /></FieldWrapper>
            <FieldWrapper label="Address" className="sm:col-span-2"><Input {...register('address')} /></FieldWrapper>
          </div>
        </div>

        <div className="rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Social links</h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => socialLinks.append({ platform: '', url: '', enabled: true })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            {socialLinks.fields.map((field, i) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input {...register(`socialLinks.${i}.platform` as const)} placeholder="LinkedIn" className="w-32" />
                <Input {...register(`socialLinks.${i}.url` as const)} placeholder="https://…" className="flex-1" />
                <button type="button" onClick={() => socialLinks.remove(i)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">Announcement banner</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-medium text-foreground">Show banner</span>
              <Switch checked={values.announcementEnabled} onChange={(v) => setValue('announcementEnabled', v)} />
            </div>
            <FieldWrapper label="Text"><Textarea rows={2} {...register('announcementText')} /></FieldWrapper>
            <div className="grid grid-cols-2 gap-4">
              <FieldWrapper label="Link text"><Input {...register('announcementLinkText')} /></FieldWrapper>
              <FieldWrapper label="Link URL"><Input {...register('announcementLinkUrl')} /></FieldWrapper>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">Email notifications</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-medium text-foreground">Notify on contact form leads</span>
              <Switch checked={values.notifyOnContactLead} onChange={(v) => setValue('notifyOnContactLead', v)} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <span className="text-sm font-medium text-foreground">Notify on project inquiries</span>
              <Switch checked={values.notifyOnProjectInquiry} onChange={(v) => setValue('notifyOnProjectInquiry', v)} />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : 'Save changes'}</Button>
      </form>
    </div>
  );
}
