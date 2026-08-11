import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, type DefaultValues, type FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import { settingsApi } from '@/api/settings.api';
import { getApiErrorMessage } from '@/api/axiosClient';
import type { SiteSettings } from '@/types';

/**
 * Shared plumbing for the Appearance/SEO/Settings admin screens: all three
 * edit slices of the same `SiteSettings` singleton via the same GET/PUT pair.
 */
export function useSettingsForm<T extends FieldValues>(mapToForm: (settings: SiteSettings) => T) {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ['settings'], queryFn: settingsApi.get });

  const form = useForm<T>({ defaultValues: undefined as unknown as DefaultValues<T> });

  useEffect(() => {
    if (settings) form.reset(mapToForm(settings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (payload: Partial<SiteSettings>) => settingsApi.update(payload),
    onSuccess: () => {
      toast.success('Settings saved');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to save settings')),
  });

  return { settings, isLoading, form, save: saveMutation.mutateAsync, isSaving: saveMutation.isPending };
}
