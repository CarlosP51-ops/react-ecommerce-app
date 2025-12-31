import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { BellIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            {/* Search */}
            <div className="flex flex-1">
              <div className="w-full max-w-lg lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Rechercher
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="search"
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Rechercher..."
                    type="search"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Voir les notifications</span>
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
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
                    <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 transform px-2 sm:px-0">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          <h3 className="text-sm font-medium text-gray-500">
                            Notifications récentes
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  Produit approuvé
                                </p>
                                <p className="text-sm text-gray-500">
                                  Votre template a été approuvé
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Il y a 2 heures
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>

            {/* Settings */}
            <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span className="sr-only">Paramètres</span>
              <Cog6ToothIcon className="h-6 w-6" />
            </button>

            {/* User Profile */}
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button className="flex items-center space-x-3 rounded-lg bg-white p-1 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
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
                    <Popover.Panel className="absolute right-0 z-10 mt-2 w-48 transform">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-1 bg-white py-1">
                          <a
                            href="/profile"
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Mon profil
                          </a>
                          <a
                            href="/settings"
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Paramètres
                          </a>
                          <button
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            onClick={() => {}}
                          >
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;