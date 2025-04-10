
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Shield, BarChart2, LogOut, Users, LayoutDashboard, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isAuthenticated) return null;

  const navLinks = [
    { 
      to: '/dashboard', 
      label: 'Tableau de Bord', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      to: '/stats', 
      label: 'Statistiques', 
      icon: <BarChart2 className="h-5 w-5" /> 
    },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ 
      to: '/admin', 
      label: 'Gestion Utilisateurs', 
      icon: <Users className="h-5 w-5" /> 
    });
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-websec-blue text-white py-3 px-4 md:px-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8" />
          <Link to="/dashboard" className="text-xl font-bold">WebSec Scanner</Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`flex items-center gap-2 hover:text-blue-200 transition ${
                location.pathname === link.to ? 'text-blue-200 font-medium' : ''
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <Button 
            variant="ghost"
            className="text-white hover:text-blue-200 hover:bg-blue-900"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Déconnexion
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            className="text-white hover:bg-blue-900"  
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden container mx-auto mt-4 pb-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`flex items-center gap-2 py-2 px-3 rounded ${
                location.pathname === link.to 
                  ? 'bg-blue-800 text-white' 
                  : 'hover:bg-blue-800 transition'
              }`}
              onClick={closeMenu}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <Button 
            variant="ghost"
            className="flex justify-start text-white hover:text-blue-200 hover:bg-blue-800"
            onClick={() => { logout(); closeMenu(); }}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Déconnexion
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
