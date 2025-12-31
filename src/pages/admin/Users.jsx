import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin';
import Card from '../../components/common/UI/Card';
import Table from '../../components/common/UI/Table';
import Button from '../../components/common/UI/Button';
import Modal from '../../components/common/UI/Modal';
import Input from '../../components/common/Forms/Input';
import Select from '../../components/common/Forms/Select';
import Badge from '../../components/common/UI/Badge';
import Loader from '../../components/common/UI/Loader';
import {
  UserPlusIcon,
  UserMinusIcon,
  ShieldCheckIcon,
  BanIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState('');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', { search, roleFilter, statusFilter }],
    queryFn: () => adminAPI.getUsers({ search, role: roleFilter !== 'all' ? roleFilter : undefined }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminAPI.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    },
  });

  const banMutation = useMutation({
    mutationFn: ({ userId, reason }) => adminAPI.banUser(userId, reason),
    onSuccess: () => {
      setBanModalOpen(false);
      setBanReason('');
      setSelectedUser(null);
      queryClient.invalidateQueries(['admin-users']);
    },
  });

  const handleRoleChange = (userId, newRole) => {
    if (confirm(`Changer le rôle de cet utilisateur en ${newRole} ?`)) {
      updateRoleMutation.mutate({ userId, role: newRole });
    }
  };

  const handleBanUser = (user) => {
    setSelectedUser(user);
    setBanModalOpen(true);
  };

  const submitBan = () => {
    if (!banReason.trim()) {
      alert('Veuillez fournir une raison');
      return;
    }
    banMutation.mutate({
      userId: selectedUser.id,
      reason: banReason,
    });
  };

  const columns = [
    {
      key: 'user',
      title: 'Utilisateur',
      render: (_, user) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="font-medium text-gray-700">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Rôle',
      render: (role) => (
        <Badge
          variant={
            role === 'admin' ? 'danger' :
            role === 'vendor' ? 'warning' : 'primary'
          }
        >
          {role === 'admin' ? 'Administrateur' :
           role === 'vendor' ? 'Vendeur' : 'Client'}
        </Badge>
      ),
    },
    {
      key: 'joined',
      title: 'Inscrit le',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      key: 'status',
      title: 'Statut',
      render: (status) => (
        <Badge
          variant={status === 'active' ? 'success' : 'danger'}
        >
          {status === 'active' ? 'Actif' : 'Banni'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, user) => (
        <div className="flex space-x-2">
          <Select
            value={user.role}
            onChange={(e) => handleRoleChange(user.id, e.target.value)}
            options={[
              { value: 'client', label: 'Client' },
              { value: 'vendor', label: 'Vendeur' },
              { value: 'admin', label: 'Admin' },
            ]}
            className="w-32"
            size="sm"
          />
          <Button
            variant={user.status === 'active' ? 'danger' : 'success'}
            size="sm"
            onClick={() => handleBanUser(user)}
          >
            {user.status === 'active' ? (
              <BanIcon className="h-4 w-4" />
            ) : (
              <UserPlusIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Gestion des Utilisateurs</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gérez les utilisateurs, rôles et permissions
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
          
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Tous les rôles' },
              { value: 'client', label: 'Clients' },
              { value: 'vendor', label: 'Vendeurs' },
              { value: 'admin', label: 'Administrateurs' },
            ]}
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Tous les statuts' },
              { value: 'active', label: 'Actifs' },
              { value: 'banned', label: 'Bannis' },
            ]}
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {users?.length || 0} utilisateurs
          </h3>
          <Button variant="primary">
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>

        <Table
          columns={columns}
          data={users || []}
        />
      </Card>

      {/* Ban Modal */}
      <Modal
        isOpen={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        title={selectedUser?.status === 'active' ? 'Bannir l\'utilisateur' : 'Débannir l\'utilisateur'}
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">
              {selectedUser?.status === 'active'
                ? `Êtes-vous sûr de vouloir bannir ${selectedUser?.name} ?`
                : `Êtes-vous sûr de vouloir débannir ${selectedUser?.name} ?`
              }
            </p>
          </div>
          
          {selectedUser?.status === 'active' && (
            <Input
              label="Raison du bannissement"
              as="textarea"
              rows={4}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Ex: Comportement inapproprié, violation des règles..."
            />
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setBanModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant={selectedUser?.status === 'active' ? 'danger' : 'success'}
              onClick={submitBan}
              loading={banMutation.isLoading}
            >
              {selectedUser?.status === 'active' ? 'Bannir' : 'Débannir'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;