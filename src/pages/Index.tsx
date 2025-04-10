
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Search, BarChart2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const features = [
    {
      icon: <Search className="h-8 w-8 text-websec-blue" />,
      title: 'Analyse complète',
      description: 'Détection de vulnérabilités dans vos sites web avec rapports détaillés',
    },
    {
      icon: <Lock className="h-8 w-8 text-websec-blue" />,
      title: 'Protection avancée',
      description: 'Identification de failles critiques avant qu\'elles ne soient exploitées',
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-websec-blue" />,
      title: 'Statistiques précises',
      description: 'Visualisation de l\'état de sécurité de vos sites en temps réel',
    },
  ];

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-websec-blue text-white">
        <div className="container mx-auto py-12 px-4 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left md:w-1/2">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Shield className="h-12 w-12 mr-3" />
                <h1 className="text-3xl font-bold">WebSec Scanner</h1>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                Sécurisez votre présence en ligne
              </h2>
              <p className="text-lg mb-8 max-w-lg">
                Analysez, identifiez et corrigez les vulnérabilités de vos sites web 
                avec notre outil de scan de sécurité avancé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="bg-white text-websec-blue hover:bg-gray-100">
                  <Link to="/register">S'inscrire</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-blue-900">
                  <Link to="/login">Se connecter</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-websec-blue to-blue-700 opacity-70 rounded-lg transform rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=600&auto=format&fit=crop" 
                  alt="Cybersecurity Visualization" 
                  className="relative rounded-lg shadow-xl z-10 max-w-full max-h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Des fonctionnalités puissantes pour votre sécurité
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-websec-blue hover:bg-blue-900">
              <Link to="/register">Commencer dès maintenant</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <Shield className="h-6 w-6 mr-2" />
            <span className="text-xl font-bold">WebSec Scanner</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} WebSec Scanner. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
