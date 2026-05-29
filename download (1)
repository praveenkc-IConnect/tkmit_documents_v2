import { ActiveTab } from '../types';
import { Bell, User, Menu, X, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unreadNotificationsCount?: number;
  adminLoggedIn: boolean;
  onLogoutAdmin: () => void;
  onShowNotifications: () => void;
}

export default function Header({
  activeTab,
  onTabChange,
  unreadNotificationsCount = 2,
  adminLoggedIn,
  onLogoutAdmin,
  onShowNotifications
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'documents', label: 'Documents' },
    { id: 'admin', label: 'Admin' }
  ] as const;

  const handleNavClick = (tabId: ActiveTab) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LOGO SECTION */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavClick('home')}
          id="header-brand-logo"
        >
          <img 
            alt="TKMIT Logo" 
            className="h-9 sm:h-11 object-contain" 
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrKhEH7wZhofhZ5q1lLgKLWSsxyx0feoVKHDqOKLukykhnfgOu2N6IBdCzJDv3WA2wQiI7_1QuneaH1uClcIjiyiG_KMwZxixg-1L_jOlw16tw-EVuhIn5h9S1hKv-6Oj8TWmi43alwuu5JfRLSXNQ2z_LSIsynNQysyzI9tFwKfda_cExZgEbgEXaL5-DyzLeDsFZemjvEvsxiIjvu8ZDsrLbnf0LAs3EfhS0Dr1kfMHsH-oT93anx1QwAapYnC40G2ZMkZWvbGRV"
          />
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex items-center space-x-8 h-full" id="desktop-nav">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-medium h-16 px-1 flex items-center border-b-2 text-[14px] transition-colors relative cursor-pointer ${
                  isActive
                    ? 'border-blue-800 text-blue-900 font-bold'
                    : 'border-transparent text-gray-500 hover:text-blue-800'
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
                {item.id === 'admin' && adminLoggedIn && (
                  <span className="ml-1.5 flex h-2 w-2 rounded-full bg-green-500" title="Connected as admin" />
                )}
              </button>
            );
          })}
        </nav>

        {/* QUICK ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4" id="header-actions">
          {/* Notifications Trigger */}
          <button
            onClick={onShowNotifications}
            className="p-2 text-gray-500 hover:text-blue-900 hover:bg-gray-100 rounded-full transition-all relative active:scale-95 cursor-pointer"
            title="Notifications"
            id="btn-nav-notifications"
          >
            <Bell className="h-5.5 w-5.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-600 text-[10px] font-bold text-white flex items-center justify-center rounded-full border border-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User/Account Quick Info */}
          {adminLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="hidden sm:flex flex-col text-right cursor-pointer"
              >
                <span className="text-xs font-semibold text-blue-900">Admin Live</span>
                <span className="text-[10px] text-gray-400">admin@tkmit.edu.in</span>
              </button>
              <button
                onClick={onLogoutAdmin}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                title="Sign Out Admin"
                id="btn-admin-logout"
              >
                <ShieldAlert className="h-5.5 w-5.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('admin')}
              className="p-2 text-gray-500 hover:text-blue-900 hover:bg-gray-100 rounded-full transition-all active:scale-95 cursor-pointer"
              title="Admin Access"
              id="btn-nav-account"
            >
              <User className="h-5.5 w-5.5" />
            </button>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-gray-500 hover:text-blue-950 focus:outline-none cursor-pointer"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fade-in">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                id={`mobile-nav-${item.id}`}
              >
                <span>{item.label}</span>
                {item.id === 'admin' && adminLoggedIn && (
                  <span className="text-xs bg-green-500 text-white font-bold px-2 py-0.5 rounded-full scale-90">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
