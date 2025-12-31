import { Link } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';

const PendingApprovals = ({ approvals = [] }) => {
  if (approvals.length === 0) {
    return (
      <div className="text-center py-8">
        <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Aucun produit en attente
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Tous les produits ont été validés.
        </p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-my-5 divide-y divide-gray-200">
        {approvals.slice(0, 5).map((product) => (
          <li key={product.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-lg object-cover"
                  src={product.previewUrl || '/placeholder.png'}
                  alt={product.name}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="truncate text-sm text-gray-500">
                  Soumis par {product.vendor.name}
                </p>
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  ${product.price}
                </span>
              </div>
              <div>
                <Link
                  to={`/admin/moderation`}
                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Vérifier
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {approvals.length > 5 && (
        <div className="mt-6">
          <Link
            to="/admin/moderation"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Voir tous ({approvals.length})
          </Link>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;