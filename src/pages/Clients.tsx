
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  getAllClients, 
  getUserByIdSafe, 
  createUser, 
  updateUser, 
  deleteUserSafe 
} from "@/lib/dataService";
import { User } from "@/lib/models";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, UserRound, Mail, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ActionButtons from "@/components/shared/ActionButtons";

// Client form dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Client schema
const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  company: z.string().optional(),
  sector: z.string().optional(),
  address: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

const Clients = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<User | null>(null);

  // Form setup
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      sector: "",
      address: "",
    },
  });

  useEffect(() => {
    loadClients();
  }, [currentUser]);

  useEffect(() => {
    if (editingClient) {
      form.reset({
        name: editingClient.name,
        email: editingClient.email,
        phone: editingClient.phone || "",
        company: editingClient.company || "",
        sector: editingClient.sector || "",
        address: editingClient.address || "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        sector: "",
        address: "",
      });
    }
  }, [editingClient, form]);

  const loadClients = () => {
    // Only admins and copilots can access this page
    if (currentUser?.role === "admin" || currentUser?.role === "copilot") {
      setClients(getAllClients());
    }
  };

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.sector && client.sector.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateClient = (data: ClientFormValues) => {
    try {
      const newClient = createUser({
        ...data,
        role: "client",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`,
      });
      
      setClients(prevClients => [...prevClients, newClient]);
      
      toast({
        title: "Cliente creado",
        description: `${data.name} ha sido creado exitosamente`,
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el cliente. Inténtalo de nuevo.",
      });
    }
  };

  const handleUpdateClient = (data: ClientFormValues) => {
    if (!editingClient) return;
    
    try {
      const updatedClient = updateUser({
        ...editingClient,
        ...data,
      });
      
      setClients(prevClients => 
        prevClients.map(client => client.id === updatedClient.id ? updatedClient : client)
      );
      
      toast({
        title: "Cliente actualizado",
        description: `${data.name} ha sido actualizado exitosamente`,
      });
      
      setEditingClient(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el cliente. Inténtalo de nuevo.",
      });
    }
  };

  const handleDeleteClient = (clientId: string) => {
    try {
      deleteUserSafe(clientId);
      
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
      
      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente",
      });
    } catch (error) {
      let errorMessage = "No se pudo eliminar el cliente";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const handleViewClient = (clientId: string) => {
    toast({
      title: "Función en desarrollo",
      description: "La vista detallada de clientes estará disponible próximamente",
    });
  };

  const handleEditClient = (client: User) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: ClientFormValues) => {
    if (editingClient) {
      handleUpdateClient(data);
    } else {
      handleCreateClient(data);
    }
  };

  // Table columns definition
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={client.avatar} alt={client.name} />
              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{client.name}</p>
              <p className="text-sm text-muted-foreground">{client.company || "N/A"}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.phone || "No disponible"}</span>
        </div>
      ),
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.sector || "No especificado"}</Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de registro",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        // Only admins can edit and delete clients
        const canEditDelete = currentUser?.role === "admin";
        
        return (
          <ActionButtons
            onView={() => handleViewClient(row.original.id)}
            onEdit={canEditDelete ? () => handleEditClient(row.original) : undefined}
            onDelete={canEditDelete ? () => handleDeleteClient(row.original.id) : undefined}
            hideEdit={!canEditDelete}
            hideDelete={!canEditDelete}
            itemName="cliente"
          />
        );
      },
    },
  ];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-muted-foreground">
              {currentUser?.role === "admin" 
                ? "Gestiona todos los clientes registrados en la plataforma" 
                : "Clientes asignados a tus proyectos"}
            </p>
          </div>
          {currentUser?.role === "admin" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingClient(null)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingClient ? "Editar Cliente" : "Añadir Cliente"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingClient 
                      ? "Modifica los detalles del cliente" 
                      : "Completa el formulario para crear un nuevo cliente"}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del cliente" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@ejemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input placeholder="+34 600 000 000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre de la empresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sector</FormLabel>
                            <FormControl>
                              <Input placeholder="Tecnología, Salud, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                              <Input placeholder="Dirección física" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {editingClient ? "Guardar cambios" : "Crear cliente"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de clientes</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email, empresa o sector..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredClients.length > 0 ? (
              <DataTable 
                columns={columns} 
                data={filteredClients} 
                searchKey="name"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <UserRound className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No se encontraron clientes</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery 
                    ? "No hay resultados para tu búsqueda" 
                    : "Aún no hay clientes registrados"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Clients;
