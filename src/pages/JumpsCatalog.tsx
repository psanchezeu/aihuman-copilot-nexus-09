
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Tag } from 'lucide-react';
import { getJumps, addToCart } from '@/lib/storageService';
import { Jump } from '@/lib/models';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const JumpsCatalog = () => {
  const [jumps, setJumps] = useState<Jump[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const allJumps = getJumps().filter(jump => jump.status === 'active');
    setJumps(allJumps);

    // Extract unique categories
    const uniqueCategories = [...new Set(allJumps.map(jump => jump.category))];
    setCategories(uniqueCategories);
  }, []);

  const handleAddToCart = (jump: Jump) => {
    addToCart({
      type: 'jump',
      name: jump.name,
      price: jump.basePrice,
      quantity: 1,
    });

    toast({
      title: "Añadido al carrito",
      description: `${jump.name} ha sido añadido al carrito.`,
    });
  };

  // Filter jumps based on search term and category
  const filteredJumps = jumps.filter(jump => {
    const matchesSearch = jump.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          jump.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || jump.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Catálogo de Jumps</h1>
          </div>
          <p className="text-muted-foreground">
            Explora soluciones preconfiguradas para implementar en tu negocio
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar jumps..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
              <Button variant="outline" className="gap-2">
                <Tag className="h-4 w-4" />
                Etiquetas
              </Button>
            </div>
          </div>

          {/* Category tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 overflow-auto">
              <TabsTrigger value="all" onClick={() => setFilterCategory('all')}>
                Todos
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  onClick={() => setFilterCategory(category)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {filteredJumps.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredJumps.map((jump) => (
                    <Card key={jump.id} className="overflow-hidden flex flex-col">
                      <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
                        <img
                          src={jump.image || '/placeholder.svg'}
                          alt={jump.name}
                          className="h-full w-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2">
                          {jump.category}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle>{jump.name}</CardTitle>
                        <CardDescription>{jump.type}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">
                          {jump.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {jump.modules.map((module, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 px-6 py-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-lg">${jump.basePrice}</p>
                          <p className="text-xs text-muted-foreground">
                            Incluye {jump.customizationHours} horas de personalización
                          </p>
                        </div>
                        <Button
                          variant="default"
                          className="bg-bloodRed hover:bg-red-800"
                          onClick={() => handleAddToCart(jump)}
                        >
                          Añadir
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">
                    No se encontraron jumps con los filtros actuales.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Category-specific tabs */}
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                {filteredJumps.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJumps.map((jump) => (
                      <Card key={jump.id} className="overflow-hidden flex flex-col">
                        <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
                          <img
                            src={jump.image || '/placeholder.svg'}
                            alt={jump.name}
                            className="h-full w-full object-cover"
                          />
                          <Badge className="absolute top-2 right-2">
                            {jump.category}
                          </Badge>
                        </div>
                        <CardHeader>
                          <CardTitle>{jump.name}</CardTitle>
                          <CardDescription>{jump.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                          <p className="text-sm text-muted-foreground">
                            {jump.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {jump.modules.map((module, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {module}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/50 px-6 py-4 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-lg">${jump.basePrice}</p>
                            <p className="text-xs text-muted-foreground">
                              Incluye {jump.customizationHours} horas de personalización
                            </p>
                          </div>
                          <Button
                            variant="default"
                            className="bg-bloodRed hover:bg-red-800"
                            onClick={() => handleAddToCart(jump)}
                          >
                            Añadir
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xl text-muted-foreground">
                      No se encontraron jumps con los filtros actuales.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default JumpsCatalog;
