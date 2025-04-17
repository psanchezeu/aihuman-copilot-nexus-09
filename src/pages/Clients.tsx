
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getUsersByRole } from "@/lib/storageService";
import { User } from "@/lib/models";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, UserRound, Mail, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Clients = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Only admins and copilots can access this page
    if (currentUser?.role === "admin" || currentUser?.role === "copilot") {
      setClients(getUsersByRole("client"));
    }
  }, [currentUser]);

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
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
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => toast({
              title: "Función en desarrollo",
              description: `Ver perfil de ${row.original.name}`
            })}
          >
            Ver perfil
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({
              title: "Función en desarrollo",
              description: `Asignar proyecto a ${row.original.name}`
            })}
          >
            Asignar proyecto
          </Button>
        </div>
      ),
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
            <Button>
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
                placeholder="Buscar por nombre o email..."
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
