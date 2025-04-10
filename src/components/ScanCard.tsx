
import { ScanResult } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface ScanCardProps {
  scan: ScanResult;
}

const ScanCard: React.FC<ScanCardProps> = ({ scan }) => {
  const navigate = useNavigate();
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-500 hover:bg-red-600';
      case 'MEDIUM':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'LOW':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'INFO':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">En attente</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">En cours</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="text-green-500 border-green-500">Terminé</Badge>;
      case 'FAILED':
        return <Badge variant="outline" className="text-red-500 border-red-500">Échoué</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'MEDIUM':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'LOW':
        return <Info className="h-5 w-5 text-yellow-500" />;
      case 'INFO':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  const viewReport = () => {
    navigate(`/reports/${scan.id}`);
  };

  const resumeScan = () => {
    navigate(`/scan/${scan.id}/progress`);
  };

  return (
    <Card className="p-4 hover:shadow-md transition">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg truncate max-w-xs" title={scan.url}>
              {scan.url}
            </h3>
            <div className="flex items-center mt-1">
              {getStatusBadge(scan.status)}
              <span className="text-sm text-gray-500 ml-2">
                {formatDate(scan.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            {getSeverityIcon(scan.severity)}
            <span className="ml-1 font-medium text-sm">{scan.severity}</span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          {scan.status === 'IN_PROGRESS' && (
            <Button variant="outline" size="sm" onClick={resumeScan}>
              Suivre
            </Button>
          )}
          {scan.status === 'COMPLETED' && (
            <Button variant="default" size="sm" onClick={viewReport} className="bg-websec-blue hover:bg-blue-900">
              <FileText className="h-4 w-4 mr-1" />
              Voir le rapport
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ScanCard;
