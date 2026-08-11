import { useSettingsForm } from '@/hooks/admin/useSettingsForm';
import { Button } from '@/components/ui/Button';
import { FieldWrapper, Input, Select } from '@/components/admin/form/FormField';
import { Skeleton } from '@/components/ui/Skeleton';
import type { SiteSettings } from '@/types';

interface FormState {
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  buttonStyle: SiteSettings['appearance']['buttonStyle'];
  borderRadius: SiteSettings['appearance']['borderRadius'];
  fontHeading: string;
  fontBody: string;
  defaultTheme: SiteSettings['appearance']['defaultTheme'];
}

function ColorField({ label, ...props }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <FieldWrapper label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={props.value || '#000000'}
          onChange={(e) => props.onChange(e.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent"
        />
        <Input value={props.value} onChange={(e) => props.onChange(e.target.value)} />
      </div>
    </FieldWrapper>
  );
}

export function AdminAppearancePage() {
  const { settings, isLoading, form, save, isSaving } = useSettingsForm<FormState>((s) => ({
    logoUrl: s.logoUrl,
    logoDarkUrl: s.logoDarkUrl,
    faviconUrl: s.faviconUrl,
    primaryColor: s.appearance.primaryColor,
    secondaryColor: s.appearance.secondaryColor,
    backgroundColor: s.appearance.backgroundColor,
    surfaceColor: s.appearance.surfaceColor,
    textColor: s.appearance.textColor,
    buttonStyle: s.appearance.buttonStyle,
    borderRadius: s.appearance.borderRadius,
    fontHeading: s.appearance.fontHeading,
    fontBody: s.appearance.fontBody,
    defaultTheme: s.appearance.defaultTheme,
  }));

  const { register, handleSubmit, watch, setValue } = form;
  const values = watch();

  const onSubmit = (values: FormState) =>
    save({
      logoUrl: values.logoUrl,
      logoDarkUrl: values.logoDarkUrl,
      faviconUrl: values.faviconUrl,
      appearance: {
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        backgroundColor: values.backgroundColor,
        surfaceColor: values.surfaceColor,
        textColor: values.textColor,
        buttonStyle: values.buttonStyle,
        borderRadius: values.borderRadius,
        fontHeading: values.fontHeading,
        fontBody: values.fontBody,
        defaultTheme: values.defaultTheme,
      },
    });

  if (isLoading || !settings) {
    return <Skeleton className="h-96 w-full max-w-2xl rounded-3xl" />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-foreground">Appearance</h1>
      <p className="mt-1 text-sm text-muted-foreground">Customize branding, colors, and typography.</p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">Branding</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FieldWrapper label="Logo URL"><Input {...register('logoUrl')} /></FieldWrapper>
            <FieldWrapper label="Dark-mode logo URL"><Input {...register('logoDarkUrl')} /></FieldWrapper>
            <FieldWrapper label="Favicon URL"><Input {...register('faviconUrl')} /></FieldWrapper>
          </div>
        </div>

        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">Colors</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ColorField label="Primary (accent)" value={values.primaryColor} onChange={(v) => setValue('primaryColor', v)} />
            <ColorField label="Secondary" value={values.secondaryColor} onChange={(v) => setValue('secondaryColor', v)} />
            <ColorField label="Background" value={values.backgroundColor} onChange={(v) => setValue('backgroundColor', v)} />
            <ColorField label="Surface" value={values.surfaceColor} onChange={(v) => setValue('surfaceColor', v)} />
            <ColorField label="Text" value={values.textColor} onChange={(v) => setValue('textColor', v)} />
          </div>
        </div>

        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground">Style</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FieldWrapper label="Button style">
              <Select {...register('buttonStyle')}>
                <option value="pill">Pill</option>
                <option value="rounded">Rounded</option>
                <option value="square">Square</option>
              </Select>
            </FieldWrapper>
            <FieldWrapper label="Border radius">
              <Select {...register('borderRadius')}>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra large</option>
              </Select>
            </FieldWrapper>
            <FieldWrapper label="Heading font"><Input {...register('fontHeading')} /></FieldWrapper>
            <FieldWrapper label="Body font"><Input {...register('fontBody')} /></FieldWrapper>
            <FieldWrapper label="Default theme">
              <Select {...register('defaultTheme')}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </Select>
            </FieldWrapper>
          </div>
        </div>

        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving…' : 'Save changes'}</Button>
      </form>
    </div>
  );
}
