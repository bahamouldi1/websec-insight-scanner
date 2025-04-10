
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-bold text-websec-blue">404</h1>
        <h2 className="text-2xl md:text-3xl font-medium">Page introuvable</h2>
        <p className="max-w-md text-gray-600">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild className="mt-4 bg-websec-blue hover:bg-blue-900">
          <Link to={isAuthenticated ? '/dashboard' : '/'}>
            <Home className="mr-2 h-4 w-4" />
            Retourner à l'accueil
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
