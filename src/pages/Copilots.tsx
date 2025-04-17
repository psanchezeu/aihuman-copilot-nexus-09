
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
import { PlusCircle, Search, Bot, Star, Briefcase } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Copilots = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [copilots, setCopilots] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Only admins can access this page fully
    if (currentUser?.role === "admin") {
      setCopilots(getUsersByRole("copilot"));
    }
  }, [currentUser]);

  // Filter copilots based on search query
  const filteredCopilots = copilots.filter(
    (copilot) =>
      copilot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      copilot.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (copilot.specialties &&
        copilot.specialties.some(specialty =>
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  // Table columns definition
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => {
        const copilot = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={copilot.avatar} alt={copilot.name} />
              <AvatarFallback>{copilot.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{copilot.name}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
                <span>{copilot.ratings || "4.5"}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "specialties",
      header: "Especialidades",
      cell: ({ row }) => {
        const specialties = row.original.specialties || ["AI", "Web Dev"];
        return (
          <div className="flex flex-wrap gap-1">
            {specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{specialties.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "projectsCompleted",
      header: "Proyectos",
      cell: ({ row }) => {
        const count = row.original.projectsCompleted || 0;
        return (
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{count} completados</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Se unió",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: () => (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Activo
        </Badge>
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
            <h1 className="text-3xl font-bold">Copilotos</h1>
            <p className="text-muted-foreground">
              Gestiona todos los copilotos expertos de la plataforma
            </p>
          </div>
          {currentUser?.role === "admin" && (
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir copiloto
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de copilotos</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o especialidad..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredCopilots.length > 0 ? (
              <DataTable 
                columns={columns} 
                data={filteredCopilots} 
                searchKey="name"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bot className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No se encontraron copilotos</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery 
                    ? "No hay resultados para tu búsqueda" 
                    : "Aún no hay copilotos registrados"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Copilots;
