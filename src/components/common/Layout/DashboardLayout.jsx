import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Dialog, Transition } from '@headlessui/react';
import { 
  HomeIcon, 
  ChartBarIcon, 
  CubeIcon, 
  UserGroupIcon, 
  CogIcon, 
  CreditCardIcon,
  ShoppingBagIcon,
  XMarkIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin, isVendor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Navigation selon le rôle
  const getNavigation = () => {
    const baseNav = [
      { 
        name: 'Tableau de bord', 
        href: isAdmin ? '/admin' : isVendor ? '/vendor' : '/dashboard/purchases', 
        icon: HomeIcon 
      },
    ];

    if (isAdmin) {
      return [
        ...baseNav,
        { name: 'Modération', href: '/admin/moderation', icon: CubeIcon },
        { name: 'Utilisateurs', href: '/admin/users', icon: UserGroupIcon },
        { name: 'Finance', href: '/admin/finance', icon: CreditCardIcon },
        { name: 'Paramètres', href: '/admin/settings', icon: CogIcon },
      ];
    }

    if (isVendor) {
      return [
        ...baseNav,
        { name: 'Mes Produits', href: '/vendor/products', icon: CubeIcon },
        { name: 'Paiements', href: '/vendor/payouts', icon: CreditCardIcon },
        { name: 'Statistiques', href: '/vendor/analytics', icon: ChartBarIcon },
      ];
    }

    // Client
    return [
      ...baseNav,
      { name: 'Mes Achats', href: '/dashboard/purchases', icon: ShoppingBagIcon },
      { name: 'Téléchargements', href: '/dashboard/downloads', icon: CubeIcon },
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-indigo-600">
                      {isAdmin ? 'Admin' : isVendor ? 'Vendeur' : 'Mon Espace'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="ml-2 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                <div className="mt-8 flex-1 space-y-1">
                  {getNavigation().map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex items-center px-4 py-3 text-sm font-medium ${
                          isActive
                            ? 'bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Sidebar Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-xl font-bold text-indigo-600">
                {isAdmin ? 'Admin Panel' : isVendor ? 'Vendor Panel' : 'Mon Espace'}
              </span>
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-4">
              {getNavigation().map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center rounded-lg px-3 py-3 text-sm font-medium ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:pl-64">
        {/* Header Mobile */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <span className="text-lg font-semibold text-gray-900">
                {isAdmin ? 'Admin' : isVendor ? 'Vendeur' : 'Mon Espace'}
              </span>
            </div>
            <div className="ml-4 flex items-center">
              <button
                onClick={handleLogout}
                className="rounded-full p-1 text-gray-400 hover:text-gray-500"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 pb-8">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;