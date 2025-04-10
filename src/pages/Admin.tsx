
import { useState, useEffect } from 'react';
import { adminService } from '@/services/api';
import { AdminUser, ScanResult } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ScanCard from '@/components/ScanCard';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Users, 
  Loader2, 
  Search, 
  Eye, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import RequireAuth from '@/components/RequireAuth';

const Admin = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userScans, setUserScans] = useState<ScanResult[]>([]);
  const [isLoadingScans, setIsLoadingScans] = useState(false);
  const [showScansDialog, setShowScansDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Impossible de charger la liste des utilisateurs');
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowScans = async (userId: number) => {
    try {
      setSelectedUserId(userId);
      setIsLoadingScans(true);
      setShowScansDialog(true);
      const data = await adminService.getUserScans(userId);
      setUserScans(data);
    } catch (error) {
      console.error('Failed to load user scans:', error);
      toast.error('Erreur lors du chargement des scans de l\'utilisateur');
      setShowScansDialog(false);
    } finally {
      setIsLoadingScans(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    
    try {
      setIsDeleting(true);
      await adminService.deleteUser(selectedUserId);
      setUsers(users.filter(user => user.id !== selectedUserId));
      toast.success('Utilisateur supprimé avec succès');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteUser = (userId: number) => {
    setSelectedUserId(userId);
    setShowDeleteDialog(true);
  };

  const getUserById = (userId: number | null) => {
    if (!userId) return null;
    return users.find(user => user.id === userId);
  };

  const selectedUser = getUserById(selectedUserId);

  return (
    <RequireAuth requiredRole="ADMIN">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Users className="h-6 w-6 mr-3 text-websec-blue" />
          <h1 className="text-2xl md:text-3xl font-bold">Gestion des Utilisateurs</h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-websec-blue" />
            <span className="ml-2 text-lg">Chargement des utilisateurs...</span>
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-websec-red" />
            <h2 className="mt-4 text-xl font-semibold">Erreur</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <Button 
              onClick={loadUsers} 
              className="mt-6 bg-websec-blue hover:bg-blue-900"
            >
              Réessayer
            </Button>
          </Card>
        ) : users.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold">Aucun utilisateur</h2>
            <p className="mt-2 text-gray-600">Aucun utilisateur n'est inscrit dans le système</p>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Nombre de scans</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'ADMIN' ? "default" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.scanCount}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleShowScans(user.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Scans
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-websec-red border-websec-red hover:bg-red-50"
                          onClick={() => confirmDeleteUser(user.id)}
                          disabled={user.role === 'ADMIN'}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        {/* Scans Dialog */}
        <Dialog open={showScansDialog} onOpenChange={setShowScansDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Scans de {selectedUser?.name}
              </DialogTitle>
            </DialogHeader>
            
            {isLoadingScans ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-websec-blue" />
                <span className="ml-2">Chargement des scans...</span>
              </div>
            ) : userScans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-h-[70vh] overflow-y-auto p-1">
                {userScans.map((scan) => (
                  <ScanCard key={scan.id} scan={scan} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">Aucun scan</h3>
                <p className="text-gray-500 mt-1">Cet utilisateur n'a pas encore effectué de scan</p>
              </div>
            )}
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Fermer</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-websec-red">Confirmation de suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser?.name}</strong> ?
                Cette action est irréversible et supprimera également tous ses scans.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RequireAuth>
  );
};

export default Admin;
