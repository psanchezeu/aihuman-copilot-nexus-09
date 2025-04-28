
import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowRight, PlusCircle, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { addToCart } from '@/lib/storageService';
import { 
  getAllJumps, 
  getJumpWithDetails, 
  getAllCopilots 
} from '@/lib/dataService';
import { Jump, User } from '@/lib/models';

// Jump detail dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const JumpsCatalog = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [jumps, setJumps] = useState<Jump[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedJump, setSelectedJump] = useState<Jump | null>(null);
  const [copilots, setCopilots] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadJumps();
    loadCopilots();
  }, [currentUser]);

  const loadJumps = () => {
    const allJumps = getAllJumps();
    
    // Filter by visibility based on user role
    let userJumps = allJumps;
    if (currentUser && currentUser.role !== 'admin') {
      userJumps = allJumps.filter(jump =>
        jump.visibility === 'all' || jump.visibility === currentUser.role
      );
    }
    
    setJumps(userJumps);
  };

  const loadCopilots = () => {
    setCopilots(getAllCopilots());
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(jumps.map(jump => jump.category)));

  // Filter jumps based on search and category
  const filteredJumps = jumps.filter(jump => {
    const matchesSearch = 
      jump.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jump.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || jump.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleViewJumpDetails = (jump: Jump) => {
    const jumpWithDetails = getJumpWithDetails(jump.id);
    setSelectedJump(jumpWithDetails);
    setIsDialogOpen(true);
  };

  const handleAddToCart = (jump: Jump) => {
    try {
      addToCart({
        type: 'jump',
        name: jump.name,
        price: jump.basePrice,
        quantity: 1,
      });
      
      toast({
        title: "Jump añadido al carrito",
        description: `${jump.name} ha sido añadido a tu carrito`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al añadir el jump al carrito",
      });
    }
  };

  const handleRequestQuote = (jump: Jump) => {
    toast({
      title: "Solicitud de presupuesto",
      description: `Se ha solicitado un presupuesto personalizado para ${jump.name}`,
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Catálogo de Jumps</h1>
            <p className="text-muted-foreground">
              Descubre soluciones pre-configuradas para tu negocio
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar jumps..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Jump cards */}
        {filteredJumps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJumps.map((jump) => (
              <Card key={jump.id} className="overflow-hidden flex flex-col">
                <div 
                  className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden"
                >
                  {jump.image ? (
                    <img 
                      src={jump.image} 
                      alt={jump.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl font-bold text-gray-400">{jump.name.charAt(0)}</div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{jump.name}</CardTitle>
                    <Badge>{jump.category}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {jump.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tipo:</span>
                      <span>{jump.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Precio base:</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(jump.basePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Personalización:</span>
                      <span>{jump.customizationHours} horas</span>
                    </div>
                    <div className="pt-2">
                      <div className="text-sm text-muted-foreground mb-1">Incluye:</div>
                      <div className="flex flex-wrap gap-1">
                        {jump.modules.slice(0, 3).map((module, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
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
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    onClick={() => handleViewJumpDetails(jump)}
                  >
                    Ver detalles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleAddToCart(jump)}>
                    Añadir al carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No se encontraron Jumps</h3>
            <p className="text-muted-foreground mt-2">
              {searchTerm || categoryFilter !== "all"
                ? "Intenta cambiar los criterios de búsqueda"
                : "No hay Jumps disponibles actualmente"}
            </p>
          </div>
        )}

        {/* Jump details dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            {selectedJump && (
              <>
                <DialogHeader>
                  <div className="flex justify-between items-start">
                    <DialogTitle className="text-2xl">{selectedJump.name}</DialogTitle>
                    <Badge>{selectedJump.category}</Badge>
                  </div>
                  <DialogDescription>
                    {selectedJump.description}
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="details">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="details">Detalles</TabsTrigger>
                    <TabsTrigger value="modules">Módulos</TabsTrigger>
                    <TabsTrigger value="experts">Expertos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Tipo</h4>
                        <p>{selectedJump.type}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Precio base</h4>
                        <p className="font-bold text-lg">
                          {new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(selectedJump.basePrice)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Horas de personalización</h4>
                        <p>{selectedJump.customizationHours} horas</p>
                      </div>
                    </div>
                    
                    {selectedJump.documentation && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Documentación</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedJump.documentation}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-4 pt-4">
                      <Button 
                        className="flex-1" 
                        onClick={() => {
                          handleAddToCart(selectedJump);
                          setIsDialogOpen(false);
                        }}
                      >
                        Añadir al carrito
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          handleRequestQuote(selectedJump);
                          setIsDialogOpen(false);
                        }}
                      >
                        Solicitar presupuesto
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="modules">
                    <div className="space-y-4">
                      <h3 className="font-medium">Módulos incluidos</h3>
                      <ul className="space-y-2">
                        {selectedJump.modules.map((module, idx) => (
                          <li key={idx} className="flex items-start">
                            <PlusCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                            <span>{module}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="experts">
                    <div className="space-y-4">
                      <h3 className="font-medium">Copilotos expertos recomendados</h3>
                      {selectedJump.suggestedCopilots && selectedJump.suggestedCopilots.length > 0 ? (
                        <div className="space-y-3">
                          {selectedJump.suggestedCopilots.map(copilotId => {
                            const copilot = copilots.find(c => c.id === copilotId);
                            
                            return copilot ? (
                              <div key={copilot.id} className="flex items-center p-3 border rounded-md">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={copilot.avatar} alt={copilot.name} />
                                  <AvatarFallback>{copilot.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="ml-3 flex-1">
                                  <p className="font-medium">{copilot.name}</p>
                                  <div className="flex items-center text-sm">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                    <span>{copilot.ratings || "4.8"}</span>
                                    <span className="mx-1">•</span>
                                    <span>{copilot.projectsCompleted || "20"}+ proyectos</span>
                                  </div>
                                </div>
                                <Button variant="secondary" size="sm">
                                  Solicitar
                                </Button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          No hay copilotos específicamente recomendados para este Jump.
                          Cualquier copiloto en nuestro equipo puede ayudarte con la implementación.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default JumpsCatalog;
