import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';
import { teamApi } from '@/api/entities.api';
import { useAdminResource } from '@/hooks/admin/useAdminResource';
import { AdminEntityList } from '@/components/admin/AdminEntityList';
import { Drawer } from '@/components/admin/Drawer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/admin/form/FormField';
import { FieldWrapper, Select, Textarea } from '@/components/admin/form/FormField';
import { TagInput } from '@/components/admin/form/TagInput';
import type { TeamMember } from '@/types/entities';

interface FormState {
  name: string;
  position: string;
  profileImage: string;
  shortBio: string;
  linkedin: string;
  github: string;
  skills: string[];
  status: 'active' | 'inactive';
}

const EMPTY: FormState = {
  name: '',
  position: '',
  profileImage: '',
  shortBio: '',
  linkedin: '',
  github: '',
  skills: [],
  status: 'active',
};

export function AdminTeamPage() {
  const resource = useAdminResource<TeamMember>(teamApi, 'team');
  const [items, setItems] = useState<TeamMember[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState<TeamMember | null>(null);

  useEffect(() => setItems(resource.items), [resource.items]);

  const { register, handleSubmit, reset, watch, setValue } = useForm<FormState>({ defaultValues: EMPTY });
  const skills = watch('skills');

  const openCreate = () => {
    setEditing(null);
    reset(EMPTY);
    setDrawerOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditing(member);
    reset({
      name: member.name,
      position: member.position,
      profileImage: member.profileImage,
      shortBio: member.shortBio,
      linkedin: member.linkedin,
      github: member.github,
      skills: member.skills,
      status: member.status,
    });
    setDrawerOpen(true);
  };

  const onSubmit = async (values: FormState) => {
    if (editing) await resource.update({ id: editing._id, payload: values });
    else await resource.create(values);
    setDrawerOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Team</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the people shown on your About and Team pages.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New team member
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={resource.search} onChange={(e) => resource.setSearch(e.target.value)} placeholder="Search team…" className="pl-10" />
      </div>

      <div className="mt-4">
        <AdminEntityList
          items={items}
          isLoading={resource.isLoading}
          emptyLabel="No team members yet."
          onReorder={(reordered) => {
            setItems(reordered);
            resource.reorder(reordered.map((m, i) => ({ id: m._id, displayOrder: i })));
          }}
          onEdit={openEdit}
          onDelete={setDeleting}
          columns={[
            {
              header: 'Name',
              render: (m) => (
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.position}</p>
                </div>
              ),
            },
            { header: 'Skills', render: (m) => <span className="text-sm text-muted-foreground">{m.skills.slice(0, 3).join(', ') || '—'}</span> },
            {
              header: 'Status',
              render: (m) => <Badge variant={m.status === 'active' ? 'success' : 'neutral'}>{m.status}</Badge>,
            },
          ]}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit team member' : 'New team member'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={resource.isCreating || resource.isUpdating}>
              {resource.isCreating || resource.isUpdating ? 'Saving…' : 'Save'}
            </Button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FieldWrapper label="Name" required>
            <Input {...register('name', { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="Position" required>
            <Input {...register('position', { required: true })} placeholder="Lead Engineer" />
          </FieldWrapper>
          <FieldWrapper label="Profile image URL">
            <Input {...register('profileImage')} />
          </FieldWrapper>
          <FieldWrapper label="Short bio">
            <Textarea rows={3} {...register('shortBio')} />
          </FieldWrapper>
          <FieldWrapper label="Skills">
            <TagInput value={skills} onChange={(tags) => setValue('skills', tags)} placeholder="Add and press Enter" />
          </FieldWrapper>
          <div className="grid grid-cols-2 gap-4">
            <FieldWrapper label="LinkedIn">
              <Input {...register('linkedin')} />
            </FieldWrapper>
            <FieldWrapper label="GitHub">
              <Input {...register('github')} />
            </FieldWrapper>
          </div>
          <FieldWrapper label="Status">
            <Select {...register('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FieldWrapper>
        </form>
      </Drawer>

      <ConfirmDialog
        open={!!deleting}
        title={`Delete "${deleting?.name}"?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        isLoading={resource.isDeleting}
        onConfirm={async () => {
          if (deleting) await resource.remove(deleting._id);
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
