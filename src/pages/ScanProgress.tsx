
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scanService } from '@/services/api';
import { ScanProgress as IScanProgress } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import { Loader2, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ScanProgress = () => {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState<IScanProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scanId) return;

    const scanResultId = parseInt(scanId, 10);
    if (isNaN(scanResultId)) {
      setError('ID de scan invalide');
      setIsLoading(false);
      return;
    }

    // Initial fetch
    fetchProgress(scanResultId);

    // Polling interval
    const interval = setInterval(() => {
      fetchProgress(scanResultId);
    }, 2000);

    return () => clearInterval(interval);
  }, [scanId]);

  const fetchProgress = async (scanResultId: number) => {
    try {
      if (isLoading) setIsLoading(true);
      
      const data = await scanService.getScanProgress(scanResultId);
      setProgressData(data);
      
      // If scan is completed or failed, stop polling
      if (data.status === 'COMPLETED' || data.status === 'FAILED') {
        if (data.status === 'COMPLETED') {
          toast.success('Scan terminé avec succès!');
        }
        if (data.status === 'FAILED') {
          toast.error('Le scan a échoué');
        }
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      setError('Impossible de récupérer la progression du scan');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressMessage = () => {
    if (!progressData) return '';
    
    if (progressData.progress < 50) {
      return `Analyse des pages du site (Spider Scan: ${Math.round(progressData.progress * 2)}%)`;
    } else {
      return `Analyse des vulnérabilités (Active Scan: ${Math.round((progressData.progress - 50) * 2)}%)`;
    }
  };

  const goToReport = () => {
    if (scanId) {
      navigate(`/reports/${scanId}`);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading && !progressData) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-websec-blue" />
          <h2 className="mt-4 text-xl">Chargement de la progression...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-websec-red" />
            <h2 className="mt-4 text-xl font-semibold">Erreur</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <Button 
              onClick={goToDashboard} 
              className="mt-6 bg-websec-blue hover:bg-blue-900"
            >
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Progression du scan</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {progressData && (
              <>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium">Statut:</h2>
                  <Badge 
                    variant="outline"
                    className={`text-sm ${
                      progressData.status === 'COMPLETED' 
                        ? 'text-green-500 border-green-500' 
                        : progressData.status === 'FAILED'
                        ? 'text-red-500 border-red-500'
                        : progressData.status === 'IN_PROGRESS'
                        ? 'text-blue-500 border-blue-500'
                        : 'text-yellow-500 border-yellow-500'
                    }`}
                  >
                    {progressData.status === 'COMPLETED' 
                      ? 'Terminé' 
                      : progressData.status === 'FAILED'
                      ? 'Échoué'
                      : progressData.status === 'IN_PROGRESS'
                      ? 'En cours'
                      : 'En attente'
                    }
                  </Badge>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Progression totale: {progressData.progress}%</span>
                    {progressData.progress === 100 && (
                      <span className="text-sm text-green-500">Terminé!</span>
                    )}
                  </div>
                  <ProgressBar 
                    progress={progressData.progress} 
                    animated={progressData.status === 'IN_PROGRESS'}
                  />
                  <p className="mt-2 text-sm text-gray-600">{getProgressMessage()}</p>
                </div>
                
                {progressData.message && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Message:</p>
                    <p className="text-sm text-gray-600">{progressData.message}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={goToDashboard}
                  >
                    Retour au tableau de bord
                  </Button>
                  
                  {progressData.status === 'COMPLETED' && (
                    <Button 
                      onClick={goToReport} 
                      className="bg-websec-blue hover:bg-blue-900"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Voir le rapport
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanProgress;
