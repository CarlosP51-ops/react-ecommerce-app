import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../../api/admin';
import { formatDate } from '../../../utils/helpers';
import Modal from '../../../components/common/UI/Modal';
import Button from '../../../components/common/UI/Button';
import Badge from '../../../components/common/UI/Badge';
import Input from '../../../components/common/Forms/Input';
import Select from '../../../components/common/Forms/Select';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const UserProfileModal = ({ user, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [banReason, setBanReason] = useState('');
  const queryClient = useQueryClient();

  const updateRoleMutation = useMutation({
    mutationFn: (role) => adminAPI.updateUserRole(user.id, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      alert('Rôle mis à jour avec succès');
    },
  });

  const banMutation = useMutation({
    mutationFn: (reason) => adminAPI.banUser(user.id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      setBanReason('');
      alert(`Utilisateur ${user.status === 'active' ? 'banni' : 'débanni'} avec succès`);
    },
  });

  const handleRoleChange = (role) => {
    if (confirm(`Changer le rôle de ${user.name} en ${role} ?`)) {
      updateRoleMutation.mutate(role);
    }
  };

  const handleBanToggle = () => {
    if (user.status === 'active') {
      if (!banReason.trim()) {
        alert('Veuillez fournir une raison');
        return;
      }
      banMutation.mutate(banReason);
    } else {
      banMutation.mutate('');
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profil' },
    { id: 'activity', name: 'Activité' },
    { id: 'purchases', name: 'Achats' },
    { id: 'security', name: 'Sécurité' },
  ];

  const userStats = {
    totalPurchases: user.purchases?.length || 0,
    totalSpent: user.purchases?.reduce((sum, p) => sum + p.amount, 0) || 0,
    averageRating: user.reviews ? 
      (user.reviews.reduce((sum, r) => sum + r.rating, 0) / user.reviews.length).toFixed(1) : 0,
    lastActive: user.lastActive ? formatDate(user.lastActive) : 'Jamais',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Profil: ${user.name}`}
      size="xl"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-6">
          {/* User Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <Badge
                  variant={
                    user.role === 'admin' ? 'danger' :
                    user.role === 'vendor' ? 'warning' : 'primary'
                  }
                  className="mt-1"
                >
                  {user.role}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Inscrit le {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <ShieldCheckIcon className={`h-4 w-4 mr-2 ${
                  user.status === 'active' ? 'text-green-500' : 'text-red-500'
                }`} />
                <span className={`font-medium ${
                  user.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {user.status === 'active' ? 'Actif' : 'Banni'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Statistiques</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Achats</span>
                <span className="font-medium">{userStats.totalPurchases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total dépensé</span>
                <span className="font-medium">${userStats.totalSpent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Note moyenne</span>
                <span className="font-medium">{userStats.averageRating}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dernière activité</span>
                <span className="font-medium">{userStats.lastActive}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Role Management */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Gestion du rôle</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['client', 'vendor', 'admin'].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        className={`p-4 border rounded-lg text-center ${
                          user.role === role
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-medium capitalize">{role}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {role === 'client' ? 'Acheteur' :
                           role === 'vendor' ? 'Vendeur' : 'Administrateur'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ban/Unban */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Gestion du statut</h4>
                  <div className="space-y-4">
                    {user.status === 'active' ? (
                      <div className="space-y-3">
                        <Input
                          label="Raison du bannissement"
                          as="textarea"
                          rows={3}
                          value={banReason}
                          onChange={(e) => setBanReason(e.target.value)}
                          placeholder="Ex: Comportement inapproprié..."
                        />
                        <Button
                          variant="danger"
                          onClick={handleBanToggle}
                          loading={banMutation.isLoading}
                          disabled={!banReason.trim()}
                        >
                          <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                          Bannir l'utilisateur
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm text-red-800">
                          Cet utilisateur est actuellement banni.
                        </p>
                        <Button
                          variant="success"
                          className="mt-3"
                          onClick={handleBanToggle}
                          loading={banMutation.isLoading}
                        >
                          Débannir l'utilisateur
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Activité récente</h4>
                {user.activityLog?.length > 0 ? (
                  <div className="space-y-3">
                    {user.activityLog.slice(0, 10).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.details}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.timestamp, { timeStyle: 'short' })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Aucune activité récente</p>
                )}
              </div>
            )}

            {activeTab === 'purchases' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Historique d'achats</h4>
                {user.purchases?.length > 0 ? (
                  <div className="space-y-3">
                    {user.purchases.slice(0, 5).map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium text-gray-900">{purchase.productName}</p>
                          <p className="text-sm text-gray-600">${purchase.amount} • {purchase.date}</p>
                        </div>
                        <Badge variant={purchase.status === 'completed' ? 'success' : 'warning'}>
                          {purchase.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Aucun achat</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;