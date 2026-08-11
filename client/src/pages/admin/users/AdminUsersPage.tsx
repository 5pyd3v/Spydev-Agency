import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { KeyRound, Plus, Search, Trash2 } from 'lucide-react';
import { usersApi, type AdminUser, type CreateUserInput } from '@/api/users.api';
import { getApiErrorMessage } from '@/api/axiosClient';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input, FieldWrapper, Select } from '@/components/admin/form/FormField';
import { Drawer } from '@/components/admin/Drawer';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Switch } from '@/components/admin/Switch';
import type { UserRole } from '@/types';

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const { data, isLoading } = useQuery({ queryKey: ['users', debouncedSearch], queryFn: () => usersApi.list({ search: debouncedSearch || undefined }) });
  const users = data?.data ?? [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['users'] });

  const createForm = useForm<CreateUserInput>({ defaultValues: { name: '', email: '', password: '', role: 'editor' } });

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserInput) => usersApi.create(payload),
    onSuccess: () => {
      toast.success('User created');
      invalidate();
      setDrawerOpen(false);
      createForm.reset();
    },
    onError: (err) => toast.error(getApiErrorMessage(err, 'Failed to create user')),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => usersApi.update(id, { isActive }),
    onSuccess: invalidate,
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => usersApi.update(id, { role }),
    onSuccess: invalidate,
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) => usersApi.resetPassword(id, newPassword),
    onSuccess: () => {
      toast.success('Password reset');
      setResetTarget(null);
      setNewPassword('');
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      toast.success('User deleted');
      invalidate();
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage admin accounts and roles.</p>
        </div>
        <Button size="sm" onClick={() => setDrawerOpen(true)}>
          <Plus className="h-4 w-4" /> New user
        </Button>
      </div>

      <div className="mt-6 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" className="pl-10" />
      </div>

      <div className="mt-4 overflow-x-auto rounded-3xl border border-border bg-surface">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground/70">
                <th className="py-3 pl-4">Name</th>
                <th className="py-3">Role</th>
                <th className="py-3">Active</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="py-3 pl-4">
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="py-3">
                    <Select
                      value={u.role}
                      onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value as UserRole })}
                      disabled={u.id === currentUser?.id}
                      className="w-32 py-1.5 text-xs"
                    >
                      <option value="superadmin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                    </Select>
                  </td>
                  <td className="py-3">
                    <Switch
                      checked={u.isActive}
                      disabled={u.id === currentUser?.id}
                      onChange={(v) => toggleActiveMutation.mutate({ id: u.id, isActive: v })}
                    />
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setResetTarget(u)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                        aria-label="Reset password"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button
                          type="button"
                          onClick={() => setDeleting(u)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="New admin user"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={createForm.handleSubmit((v) => createMutation.mutate(v))} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create user'}
            </Button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={createForm.handleSubmit((v) => createMutation.mutate(v))}>
          <FieldWrapper label="Name" required>
            <Input {...createForm.register('name', { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="Email" required>
            <Input type="email" {...createForm.register('email', { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="Password" required hint="At least 8 characters, one uppercase letter, one number">
            <Input type="password" {...createForm.register('password', { required: true })} />
          </FieldWrapper>
          <FieldWrapper label="Role">
            <Select {...createForm.register('role')}>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </Select>
          </FieldWrapper>
        </form>
      </Drawer>

      <Drawer
        open={!!resetTarget}
        onClose={() => setResetTarget(null)}
        title={`Reset password for ${resetTarget?.name ?? ''}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setResetTarget(null)}>Cancel</Button>
            <Button
              size="sm"
              disabled={!newPassword || resetPasswordMutation.isPending}
              onClick={() => resetTarget && resetPasswordMutation.mutate({ id: resetTarget.id, newPassword })}
            >
              {resetPasswordMutation.isPending ? 'Saving…' : 'Reset password'}
            </Button>
          </div>
        }
      >
        <FieldWrapper label="New password" hint="At least 8 characters, one uppercase letter, one number">
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </FieldWrapper>
      </Drawer>

      <ConfirmDialog
        open={!!deleting}
        title={`Delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        isLoading={deleteMutation.isPending}
        onConfirm={async () => {
          if (deleting) await deleteMutation.mutateAsync(deleting.id);
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
