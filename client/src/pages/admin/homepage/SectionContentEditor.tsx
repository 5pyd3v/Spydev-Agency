import { Plus, Trash2 } from 'lucide-react';
import { FieldWrapper, Input, Textarea } from '@/components/admin/form/FormField';
import { Button } from '@/components/ui/Button';
import type { HomepageSectionType } from '@/types';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export interface SectionFormState {
  heading: string;
  subheading: string;
  content: Record<string, unknown>;
}

function getStr(content: Record<string, unknown>, key: string): string {
  const val = content[key];
  return typeof val === 'string' ? val : '';
}

function getNestedStr(content: Record<string, unknown>, key: string, sub: string): string {
  const nested = content[key];
  if (nested && typeof nested === 'object') return (nested as Record<string, unknown>)[sub] as string ?? '';
  return '';
}

interface Props {
  type: HomepageSectionType;
  state: SectionFormState;
  onChange: (next: SectionFormState) => void;
}

export function SectionContentEditor({ type, state, onChange }: Props) {
  const setContent = (patch: Record<string, unknown>) => onChange({ ...state, content: { ...state.content, ...patch } });

  return (
    <div className="space-y-4">
      <FieldWrapper label="Heading override" hint="Leave blank to use the default">
        <Input value={state.heading} onChange={(e) => onChange({ ...state, heading: e.target.value })} />
      </FieldWrapper>
      <FieldWrapper label="Subheading">
        <Textarea rows={2} value={state.subheading} onChange={(e) => onChange({ ...state, subheading: e.target.value })} />
      </FieldWrapper>

      {type === 'hero' && (
        <>
          <FieldWrapper label="Badge text">
            <Input value={getStr(state.content, 'badge')} onChange={(e) => setContent({ badge: e.target.value })} />
          </FieldWrapper>
          <FieldWrapper label="Headline">
            <Textarea
              rows={2}
              value={getStr(state.content, 'headline')}
              onChange={(e) => setContent({ headline: e.target.value })}
            />
          </FieldWrapper>
          <FieldWrapper label="Description">
            <Textarea
              rows={3}
              value={getStr(state.content, 'description')}
              onChange={(e) => setContent({ description: e.target.value })}
            />
          </FieldWrapper>
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Primary CTA text">
              <Input
                value={getNestedStr(state.content, 'primaryCta', 'text')}
                onChange={(e) =>
                  setContent({ primaryCta: { ...(state.content.primaryCta as object), text: e.target.value } })
                }
              />
            </FieldWrapper>
            <FieldWrapper label="Primary CTA URL">
              <Input
                value={getNestedStr(state.content, 'primaryCta', 'url')}
                onChange={(e) =>
                  setContent({ primaryCta: { ...(state.content.primaryCta as object), url: e.target.value } })
                }
              />
            </FieldWrapper>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="Secondary CTA text">
              <Input
                value={getNestedStr(state.content, 'secondaryCta', 'text')}
                onChange={(e) =>
                  setContent({ secondaryCta: { ...(state.content.secondaryCta as object), text: e.target.value } })
                }
              />
            </FieldWrapper>
            <FieldWrapper label="Secondary CTA URL">
              <Input
                value={getNestedStr(state.content, 'secondaryCta', 'url')}
                onChange={(e) =>
                  setContent({ secondaryCta: { ...(state.content.secondaryCta as object), url: e.target.value } })
                }
              />
            </FieldWrapper>
          </div>
        </>
      )}

      {(type === 'cta' || type === 'custom') && (
        <>
          <FieldWrapper label="Button text">
            <Input value={getStr(state.content, 'buttonText')} onChange={(e) => setContent({ buttonText: e.target.value })} />
          </FieldWrapper>
          <FieldWrapper label="Button URL">
            <Input value={getStr(state.content, 'buttonUrl')} onChange={(e) => setContent({ buttonUrl: e.target.value })} />
          </FieldWrapper>
        </>
      )}

      {type === 'custom' && (
        <FieldWrapper label="Body">
          <Textarea rows={4} value={getStr(state.content, 'body')} onChange={(e) => setContent({ body: e.target.value })} />
        </FieldWrapper>
      )}

      {type === 'stats' && (
        <div className="rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Stats</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const items = ((state.content.items as StatItem[]) ?? []).concat({ label: '', value: 0, suffix: '+' });
                setContent({ items });
              }}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </Button>
          </div>
          <div className="mt-3 space-y-3">
            {((state.content.items as StatItem[]) ?? []).map((item, i) => (
              <div key={i} className="flex gap-2 rounded-xl bg-surface p-3">
                <Input
                  value={item.value}
                  type="number"
                  className="w-20"
                  onChange={(e) => {
                    const items = [...((state.content.items as StatItem[]) ?? [])];
                    items[i] = { ...items[i], value: Number(e.target.value) };
                    setContent({ items });
                  }}
                />
                <Input
                  value={item.suffix ?? ''}
                  placeholder="+"
                  className="w-16"
                  onChange={(e) => {
                    const items = [...((state.content.items as StatItem[]) ?? [])];
                    items[i] = { ...items[i], suffix: e.target.value };
                    setContent({ items });
                  }}
                />
                <Input
                  value={item.label}
                  placeholder="Projects shipped"
                  className="flex-1"
                  onChange={(e) => {
                    const items = [...((state.content.items as StatItem[]) ?? [])];
                    items[i] = { ...items[i], label: e.target.value };
                    setContent({ items });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const items = ((state.content.items as StatItem[]) ?? []).filter((_, idx) => idx !== i);
                    setContent({ items });
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {((state.content.items as StatItem[]) ?? []).length === 0 && (
              <p className="text-xs text-muted-foreground">No stats added yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
