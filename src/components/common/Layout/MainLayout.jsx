import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../../contexts/AuthContext';

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Produits', href: '/products' },
    { name: 'Catégories', href: '/categories' },
    { name: 'Vendeurs', href: '/vendors' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">DigitalMarket</span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden ml-10 space-x-8 lg:flex">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-base font-medium text-gray-700 hover:text-indigo-600"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden flex-1 max-w-lg mx-10 lg:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Rechercher des produits..."
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              <Link to="/cart" className="text-gray-700 hover:text-gray-900">
                <ShoppingCartIcon className="h-6 w-6" />
              </Link>
              
              {isAuthenticated ? (
                <Popover className="relative">
                  {({ open }) => (
                    <>
                      <Popover.Button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        <span>{user?.name}</span>
                        <ChevronDownIcon className="h-5 w-5" />
                      </Popover.Button>
                      
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute right-0 z-10 mt-3 w-48 transform px-2 sm:px-0">
                          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                              <Link
                                to={user?.role === 'admin' ? '/admin' : user?.role === 'vendor' ? '/vendor' : '/dashboard/purchases'}
                                className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                              >
                                <div className="ml-4">
                                  <p className="text-base font-medium text-gray-900">Tableau de bord</p>
                                </div>
                              </Link>
                              <Link
                                to="/profile"
                                className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                              >
                                <div className="ml-4">
                                  <p className="text-base font-medium text-gray-900">Mon profil</p>
                                </div>
                              </Link>
                              <button
                                onClick={handleLogout}
                                className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50 w-full text-left"
                              >
                                <div className="ml-4">
                                  <p className="text-base font-medium text-gray-900">Déconnexion</p>
                                </div>
                              </button>
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/auth"
                    className="text-base font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/auth?tab=register"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Search */}
        <div className="lg:hidden border-t border-gray-200 px-4 py-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Rechercher des produits..."
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold text-indigo-600">DigitalMarket</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-gray-900">
                      Connecté en tant que {user?.name}
                    </div>
                    <Link
                      to={user?.role === 'admin' ? '/admin' : user?.role === 'vendor' ? '/vendor' : '/dashboard/purchases'}
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      to="/cart"
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Panier
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/auth?tab=register"
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      S'inscrire
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                DigitalMarket
              </h3>
              <p className="mt-4 text-sm text-gray-500">
                La marketplace numérique de confiance pour vos produits digitaux.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Acheteurs
              </h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/products" className="text-sm text-gray-500 hover:text-gray-900">Produits</Link></li>
                <li><Link to="/categories" className="text-sm text-gray-500 hover:text-gray-900">Catégories</Link></li>
                <li><Link to="/how-it-works" className="text-sm text-gray-500 hover:text-gray-900">Comment ça marche</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Vendeurs
              </h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/become-vendor" className="text-sm text-gray-500 hover:text-gray-900">Devenir vendeur</Link></li>
                <li><Link to="/vendor/guidelines" className="text-sm text-gray-500 hover:text-gray-900">Guide du vendeur</Link></li>
                <li><Link to="/pricing" className="text-sm text-gray-500 hover:text-gray-900">Tarifs</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/help" className="text-sm text-gray-500 hover:text-gray-900">Centre d'aide</Link></li>
                <li><Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link></li>
                <li><Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">Conditions d'utilisation</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500 text-center">
              &copy; {new Date().getFullYear()} DigitalMarket. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;