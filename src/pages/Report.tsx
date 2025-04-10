
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scanService } from '@/services/api';
import { ReportHtml } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, Loader2, AlertTriangle } from 'lucide-react';

const Report = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportHtml | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;

    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const scanResultId = parseInt(reportId, 10);
        if (isNaN(scanResultId)) {
          throw new Error('ID de rapport invalide');
        }
        
        const data = await scanService.getHtmlReport(scanResultId);
        setReport(data);
      } catch (error) {
        console.error('Failed to fetch report:', error);
        setError('Impossible de récupérer le rapport');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const downloadPdfReport = async () => {
    if (!reportId) return;
    
    try {
      setIsDownloading(true);
      const scanResultId = parseInt(reportId, 10);
      const blob = await scanService.downloadPdfReport(scanResultId);
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `websec-report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Téléchargement du rapport PDF réussi');
    } catch (error) {
      console.error('Failed to download PDF report:', error);
      toast.error('Échec du téléchargement du rapport PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-websec-blue" />
          <h2 className="mt-4 text-xl">Chargement du rapport...</h2>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={goBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Rapport</h1>
        </div>
        
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-websec-red" />
          <h2 className="mt-4 text-xl font-semibold">Erreur</h2>
          <p className="mt-2 text-gray-600">{error || 'Le rapport est indisponible'}</p>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="mt-6 bg-websec-blue hover:bg-blue-900"
          >
            Retour au tableau de bord
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={goBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Rapport de sécurité</h1>
        </div>
        
        <Button
          onClick={downloadPdfReport}
          disabled={isDownloading}
          className="bg-websec-blue hover:bg-blue-900"
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Téléchargement...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Télécharger PDF
            </>
          )}
        </Button>
      </div>
      
      <Card className="overflow-hidden">
        <div 
          className="p-6"
          dangerouslySetInnerHTML={{ __html: report.content }}
        />
      </Card>
    </div>
  );
};

export default Report;
