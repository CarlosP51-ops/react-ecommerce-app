import { formatDate } from '../../../utils/helpers';
import {
  CheckCircleIcon,
  XCircleIcon,
  UserPlusIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const RecentActivities = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'product_approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'product_rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'user_registered':
        return <UserPlusIcon className="h-5 w-5 text-blue-500" />;
      case 'payout_processed':
        return <CurrencyDollarIcon className="h-5 w-5 text-purple-500" />;
      case 'purchase_made':
        return <ShoppingCartIcon className="h-5 w-5 text-indigo-500" />;
      case 'dispute_opened':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'product_approved':
        return `Produit "${activity.data.productName}" approuvé`;
      case 'product_rejected':
        return `Produit "${activity.data.productName}" rejeté`;
      case 'user_registered':
        return `Nouvel utilisateur: ${activity.data.userName}`;
      case 'payout_processed':
        return `Paiement de $${activity.data.amount} traité`;
      case 'purchase_made':
        return `Vente de "${activity.data.productName}"`;
      case 'dispute_opened':
        return `Litige ouvert pour la commande #${activity.data.orderId}`;
      default:
        return activity.message;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">Aucune activité récente</p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.slice(0, 8).map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900">
                      {getActivityText(activity)}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    {formatDate(activity.createdAt, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;