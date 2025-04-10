
import { useState, useEffect } from 'react';
import { statsService } from '@/services/api';
import { ScanStats } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AlertTriangle, Loader2 } from 'lucide-react';

const COLORS = ['#EF4444', '#F97316', '#FBBF24', '#3B82F6', '#10B981'];

const SeverityLabels: Record<string, string> = {
  HIGH: 'Haute',
  MEDIUM: 'Moyenne',
  LOW: 'Faible',
  INFO: 'Information',
  UNKNOWN: 'Inconnue'
};

const Stats = () => {
  const [stats, setStats] = useState<ScanStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await statsService.getStats();
        
        // Transform data to use French labels for severity
        const transformedData = {
          ...data,
          bySeverity: data.bySeverity.map(item => ({
            ...item,
            name: SeverityLabels[item.severity] || item.severity,
          })),
          byType: data.byType.map(item => ({
            ...item,
            name: item.type,
          })),
        };
        
        setStats(transformedData as any);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        setError('Impossible de récupérer les statistiques');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border shadow-md rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            Nombre: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-websec-blue" />
          <h2 className="mt-4 text-xl">Chargement des statistiques...</h2>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Statistiques</h1>
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-websec-red" />
          <h2 className="mt-4 text-xl font-semibold">Erreur</h2>
          <p className="mt-2 text-gray-600">{error || 'Les statistiques sont indisponibles'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Statistiques</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total des scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.scanCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Vulnérabilités critiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-websec-red">
              {stats.bySeverity.find(s => s.severity === 'HIGH')?.count || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Types de vulnérabilités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.byType.length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par sévérité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.bySeverity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                  >
                    {stats.bySeverity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Répartition par type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.byType}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 50,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                    tick={{fontSize: 10}}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Nombre" fill="#3B82F6" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
