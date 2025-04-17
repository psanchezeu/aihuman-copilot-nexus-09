
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getJumps } from "@/lib/storageService";
import { Jump } from "@/lib/models";
import { Package, Search, PlusCircle, ChevronRight, Tag } from "lucide-react";

const Jumps = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [jumps, setJumps] = useState<Jump[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Get unique categories for filtering
  const categories = Array.from(
    new Set(jumps.map((jump) => jump.category))
  );
  
  useEffect(() => {
    // Load all jumps
    setJumps(getJumps());
  }, []);

  // Filter jumps based on search query and category
  const filteredJumps = jumps.filter(
    (jump) => {
      const matchesSearch = jump.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           jump.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || jump.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    }
  );

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Jumps</h1>
            <p className="text-muted-foreground">
              Gestiona las soluciones preconfiguradas disponibles en la plataforma
            </p>
          </div>
          {currentUser?.role === "admin" && (
            <Button onClick={() => toast({
              title: "Función en desarrollo",
              description: "Crear nuevo Jump"
            })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Jump
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar jumps..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Select 
              value={categoryFilter} 
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredJumps.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJumps.map((jump) => (
              <Card key={jump.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{jump.name}</CardTitle>
                    <Badge variant={jump.status === "active" ? "default" : "outline"}>
                      {jump.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    <span>{jump.category}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {jump.description}
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Precio base</span>
                      <span className="font-medium">${jump.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Horas incluidas</span>
                      <span className="font-medium">{jump.customizationHours}h</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {jump.modules.slice(0, 3).map((module, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                      {jump.modules.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{jump.modules.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4 pb-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toast({
                      title: "Función en desarrollo",
                      description: `Ver detalles de ${jump.name}`
                    })}
                  >
                    Ver detalles
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => toast({
                      title: "Función en desarrollo",
                      description: currentUser?.role === "admin" 
                        ? `Editar ${jump.name}` 
                        : `Asignar ${jump.name}`
                    })}
                    className="gap-1"
                  >
                    {currentUser?.role === "admin" ? "Editar" : "Asignar"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-3" />
            <h3 className="text-xl font-medium">No se encontraron Jumps</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {searchQuery || categoryFilter !== "all"
                ? "No hay resultados para los filtros aplicados. Intenta con otros criterios."
                : "Aún no hay Jumps disponibles en la plataforma. Crea uno nuevo para comenzar."}
            </p>
            {currentUser?.role === "admin" && (
              <Button 
                className="mt-6"
                onClick={() => toast({
                  title: "Función en desarrollo",
                  description: "Crear nuevo Jump"
                })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear nuevo Jump
              </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Jumps;
