import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, User as UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";
import { User } from "@/lib/models";
import {
  getUsersByRole,
  createUser as storageCreateUser,
  updateUser as storageUpdateUser,
  deleteUser as storageDeleteUser,
} from "@/lib/storageService";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Introduce un email válido.",
  }),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  sector: z.string().optional(),
  address: z.string().optional(),
});

const Clients = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [isApiKeyCopied, setIsApiKeyCopied] = useState(false);

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      avatar: "",
      phone: "",
      company: "",
      sector: "",
      address: "",
    },
  });

  useEffect(() => {
    // Only admins can access this page fully
    if (currentUser?.role === "admin") {
      setClients(getUsersByRole("client"));
    }
  }, [currentUser]);

  // Function to handle client creation
  const createClient = (data: z.infer<typeof formSchema>) => {
    const newClient: Omit<User, "id" | "createdAt"> = {
      name: data.name,
      email: data.email,
      role: "client",
      avatar:
        data.avatar ||
        "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.name),
      phone: data.phone,
      company: data.company,
      sector: data.sector,
      address: data.address,
    };

    storageCreateUser(newClient)
      .then(() => {
        setClients(getUsersByRole("client")); // Refresh client list
        toast({
          title: "Cliente creado",
          description: "El cliente fue creado exitosamente.",
        });
        setOpen(false); // Close the modal
        form.reset(); // Reset the form
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Hubo un problema al crear el cliente.",
          variant: "destructive",
        });
        console.error("Error creating client:", error);
      });
  };

  // Function to handle client update
  const updateClient = (data: z.infer<typeof formSchema>) => {
    if (!selectedClient) return;

    const updatedClient: User = {
      ...selectedClient,
      name: data.name,
      email: data.email,
      avatar:
        data.avatar ||
        "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.name),
      phone: data.phone,
      company: data.company,
      sector: data.sector,
      address: data.address,
    };

    storageUpdateUser(updatedClient)
      .then(() => {
        setClients(getUsersByRole("client")); // Refresh client list
        toast({
          title: "Cliente actualizado",
          description: "El cliente fue actualizado exitosamente.",
        });
        setOpen(false); // Close the modal
        form.reset(); // Reset the form
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Hubo un problema al actualizar el cliente.",
          variant: "destructive",
        });
        console.error("Error updating client:", error);
      });
  };

  // Function to handle client deletion
  const deleteClient = (clientId: string) => {
    storageDeleteUser(clientId)
      .then(() => {
        setClients(getUsersByRole("client")); // Refresh client list
        toast({
          title: "Cliente eliminado",
          description: "El cliente fue eliminado exitosamente.",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Hubo un problema al eliminar el cliente.",
          variant: "destructive",
        });
        console.error("Error deleting client:", error);
      });
  };

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company &&
        client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "company",
      header: "Compañía",
    },
    {
      accessorKey: "sector",
      header: "Sector",
    },
    {
      accessorKey: "createdAt",
      header: "Se unió",
      cell: ({ row }) => (
        <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedClient(client);
                setIsCreateMode(false);
                form.reset({
                  name: client.name,
                  email: client.email,
                  avatar: client.avatar,
                  phone: client.phone,
                  company: client.company,
                  sector: client.sector,
                  address: client.address,
                });
                setOpen(true);
              }}
            >
              Editar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteClient(client.id)}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
              Gestiona todos los clientes de la plataforma
            </p>
          </div>
          {currentUser?.role === "admin" && (
            <Button onClick={() => {
              setIsCreateMode(true);
              form.reset();
              setOpen(true);
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir cliente
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de clientes</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o compañía..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredClients.length > 0 ? (
              <DataTable columns={columns} data={filteredClients} />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <UserIcon className="h-12 w-12 text-muted-foreground mb-2" />
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

        {/* Modal for creating and editing clients */}
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isCreateMode ? "Añadir Cliente" : "Editar Cliente"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isCreateMode
                  ? "Completa el formulario para crear un nuevo cliente."
                  : "Modifica la información del cliente."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...form}>
              <form
                onSubmit={
                  isCreateMode
                    ? form.handleSubmit(createClient)
                    : form.handleSubmit(updateClient)
                }
                className="space-y-4"
              >
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
                        <Input placeholder="Email del cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="URL del avatar (opcional)"
                          {...field}
                        />
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
                        <Input placeholder="Teléfono (opcional)" {...field} />
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
                      <FormLabel>Compañía</FormLabel>
                      <FormControl>
                        <Input placeholder="Compañía (opcional)" {...field} />
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
                        <Input placeholder="Sector (opcional)" {...field} />
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
                        <Input placeholder="Dirección (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => {
                    setOpen(false);
                    form.reset();
                  }}>Cancelar</AlertDialogCancel>
                  <Button type="submit">
                    {isCreateMode ? "Crear" : "Guardar"}
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default Clients;
