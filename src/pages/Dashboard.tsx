
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scanService } from '@/services/api';
import { ScanResult } from '@/types';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import ScanCard from '@/components/ScanCard';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const urlSchema = z.object({
  url: z.string()
    .url({ message: "URL invalide, exemple: https://exemple.com" })
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: "L'URL doit commencer par http:// ou https://",
    }),
});

type ScanFormValues = z.infer<typeof urlSchema>;

const Dashboard = () => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [filteredScans, setFilteredScans] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ScanFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
  });

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredScans(
        scans.filter(scan => 
          scan.url.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredScans(scans);
    }
  }, [searchTerm, scans]);

  const loadScans = async () => {
    try {
      setIsLoading(true);
      const data = await scanService.getUserScans();
      // Sort by creation date (newest first)
      const sortedData = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setScans(sortedData);
      setFilteredScans(sortedData);
    } catch (error) {
      console.error('Failed to load scans:', error);
      toast.error('Erreur lors du chargement des scans');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewScan = async (values: ScanFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await scanService.startScan(values.url);
      toast.success('Scan lancé avec succès!');
      setIsDialogOpen(false);
      form.reset();
      navigate(`/scan/${response.scanResultId}/progress`);
    } catch (error: any) {
      console.error('Failed to start scan:', error);
      toast.error(error.response?.data?.message || 'Échec du lancement du scan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Tableau de Bord</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              className="pl-9" 
              placeholder="Rechercher par URL" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-websec-blue hover:bg-blue-900">
                <Plus className="h-5 w-5 mr-1" />
                Nouveau Scan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lancer un nouveau scan</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(startNewScan)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL à scanner</FormLabel>
                        <FormControl>
                          <Input placeholder="https://exemple.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-websec-blue hover:bg-blue-900" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Lancement...
                      </>
                    ) : 'Lancer le scan'}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-websec-blue" />
          <span className="ml-2 text-lg">Chargement des scans...</span>
        </div>
      ) : filteredScans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScans.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <Search className="h-12 w-12 text-gray-400" />
            {searchTerm ? (
              <div>
                <h3 className="text-lg font-medium">Aucun scan correspondant</h3>
                <p className="text-gray-500 mt-1">Essayez d'autres termes de recherche</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium">Aucun scan disponible</h3>
                <p className="text-gray-500 mt-1">Commencez par lancer votre premier scan</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)} 
                  className="mt-4 bg-websec-blue hover:bg-blue-900"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Nouveau Scan
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
