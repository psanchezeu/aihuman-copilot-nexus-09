
import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Plus, Search, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Jump, User } from '@/lib/models';
import { getJumps, createJump, updateJump, deleteJump, getUsers } from '@/lib/storageService';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';

// Form schema for Jump
const jumpSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  category: z.string().min(1, "La categoría es requerida"),
  type: z.string().min(1, "El tipo es requerido"),
  modules: z.array(z.string()).min(1, "Al menos un módulo es requerido"),
  basePrice: z.number().min(1, "El precio base debe ser mayor a 0"),
  customizationHours: z.number().min(0, "Las horas deben ser 0 o mayor"),
  documentation: z.string().optional(),
  visibility: z.enum(["admin", "copilot", "client", "all"]),
  status: z.enum(["active", "inactive"]),
  suggestedCopilots: z.array(z.string()).optional(),
});

const Jumps = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [jumps, setJumps] = useState<Jump[]>([]);
  const [filteredJumps, setFilteredJumps] = useState<Jump[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [editingJump, setEditingJump] = useState<Jump | null>(null);
  const [copilots, setCopilots] = useState<User[]>([]);
  const [moduleInput, setModuleInput] = useState("");

  // Form setup
  const form = useForm<z.infer<typeof jumpSchema>>({
    resolver: zodResolver(jumpSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      type: "",
      modules: [],
      basePrice: 0,
      customizationHours: 0,
      documentation: "",
      visibility: "all",
      status: "active",
      suggestedCopilots: [],
    },
  });

  useEffect(() => {
    loadJumps();
    loadCopilots();
  }, [currentUser]);

  useEffect(() => {
    if (editingJump) {
      form.reset({
        name: editingJump.name,
        description: editingJump.description,
        category: editingJump.category,
        type: editingJump.type,
        modules: editingJump.modules,
        basePrice: editingJump.basePrice,
        customizationHours: editingJump.customizationHours,
        documentation: editingJump.documentation || "",
        visibility: editingJump.visibility,
        status: editingJump.status,
        suggestedCopilots: editingJump.suggestedCopilots || [],
      });
    } else {
      form.reset({
        name: "",
        description: "",
        category: "",
        type: "",
        modules: [],
        basePrice: 0,
        customizationHours: 0,
        documentation: "",
        visibility: "all",
        status: "active",
        suggestedCopilots: [],
      });
    }
  }, [editingJump, form]);

  useEffect(() => {
    applyFilters();
  }, [jumps, searchTerm, categoryFilter, visibilityFilter]);

  const loadJumps = () => {
    const allJumps = getJumps();
    
    // Filter jumps based on user role
    let filteredByRole = allJumps;
    if (currentUser && currentUser.role !== 'admin') {
      filteredByRole = allJumps.filter(jump => 
        jump.visibility === 'all' || jump.visibility === currentUser.role
      );
    }
    
    setJumps(filteredByRole);
    setFilteredJumps(filteredByRole);
  };

  const loadCopilots = () => {
    const allCopilots = getUsers().filter(user => user.role === 'copilot');
    setCopilots(allCopilots);
  };

  const applyFilters = () => {
    let result = jumps;
    
    if (searchTerm) {
      result = result.filter(jump => 
        jump.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        jump.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jump.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(jump => jump.category === categoryFilter);
    }
    
    if (visibilityFilter !== 'all') {
      result = result.filter(jump => jump.visibility === visibilityFilter);
    }
    
    setFilteredJumps(result);
  };

  const handleCreateJump = (data: z.infer<typeof jumpSchema>) => {
    try {
      const newJump = createJump({
        ...data,
        basePrice: Number(data.basePrice),
        customizationHours: Number(data.customizationHours),
        image: '/placeholder.svg', // Default placeholder image
      });
      
      setJumps(prev => [...prev, newJump]);
      
      toast({
        title: "Jump creado",
        description: "El Jump fue creado exitosamente",
      });
      
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear el Jump",
        variant: "destructive",
      });
    }
  };

  const handleUpdateJump = (data: z.infer<typeof jumpSchema>) => {
    if (!editingJump) return;
    
    try {
      const updatedJump = updateJump({
        ...editingJump,
        ...data,
        basePrice: Number(data.basePrice),
        customizationHours: Number(data.customizationHours),
      });
      
      setJumps(prev => 
        prev.map(jump => jump.id === updatedJump.id ? updatedJump : jump)
      );
      
      toast({
        title: "Jump actualizado",
        description: "El Jump fue actualizado exitosamente",
      });
      
      setEditingJump(null);
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el Jump",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJump = (id: string) => {
    try {
      deleteJump(id);
      setJumps(prev => prev.filter(jump => jump.id !== id));
      
      if (editingJump && editingJump.id === id) {
        setEditingJump(null);
      }
      
      toast({
        title: "Jump eliminado",
        description: "El Jump fue eliminado exitosamente",
      });
      
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el Jump",
        variant: "destructive",
      });
    }
  };

  const addModule = () => {
    if (!moduleInput.trim()) return;
    
    const currentModules = form.getValues("modules") || [];
    
    if (!currentModules.includes(moduleInput.trim())) {
      form.setValue("modules", [...currentModules, moduleInput.trim()]);
    }
    
    setModuleInput("");
  };

  const removeModule = (module: string) => {
    const currentModules = form.getValues("modules") || [];
    form.setValue("modules", currentModules.filter(m => m !== module));
  };

  const getVisibilityBadge = (visibility: string) => {
    switch (visibility) {
      case 'admin':
        return <Badge variant="outline">Admin</Badge>;
      case 'copilot':
        return <Badge variant="secondary">Copiloto</Badge>;
      case 'client':
        return <Badge variant="default">Cliente</Badge>;
      case 'all':
        return <Badge className="bg-green-600">Todos</Badge>;
      default:
        return <Badge variant="outline">{visibility}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Activo</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactivo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Extract unique categories for filter
  const categories = Array.from(new Set(jumps.map(jump => jump.category)));

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Jumps</h1>
            <p className="text-muted-foreground">
              Desde aqui podras gestionar todos los Jumps disponibles en la plataforma
            </p>
          </div>
          {currentUser?.role === 'admin' && activeTab === "list" && (
            <Button onClick={() => setActiveTab("create")}>
              <Plus className="h-4 w-4 mr-2" /> Nuevo Jump
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Lista de Jumps</TabsTrigger>
            {currentUser?.role === 'admin' && (
              <TabsTrigger value="create">Crear Jump</TabsTrigger>
            )}
            {editingJump && currentUser?.role === 'admin' && (
              <TabsTrigger value="edit">Editar Jump</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="list">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
                
                {currentUser?.role === 'admin' && (
                  <Select
                    value={visibilityFilter}
                    onValueChange={(value) => setVisibilityFilter(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Visibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="copilot">Copiloto</SelectItem>
                      <SelectItem value="client">Cliente</SelectItem>
                      <SelectItem value="all">Todos</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Jumps table */}
            <Card>
              <CardHeader>
                <CardTitle>Jumps Disponibles</CardTitle>
                <CardDescription>
                  {filteredJumps.length} jumps encontrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredJumps.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Precio Base</TableHead>
                        <TableHead>Horas</TableHead>
                        <TableHead>Visibilidad</TableHead>
                        <TableHead>Estado</TableHead>
                        {currentUser?.role === 'admin' && (
                          <TableHead className="text-right">Acciones</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJumps.map((jump) => (
                        <TableRow key={jump.id}>
                          <TableCell className="font-medium">{jump.name}</TableCell>
                          <TableCell>{jump.category}</TableCell>
                          <TableCell>{jump.type}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(jump.basePrice)}
                          </TableCell>
                          <TableCell>{jump.customizationHours}</TableCell>
                          <TableCell>{getVisibilityBadge(jump.visibility)}</TableCell>
                          <TableCell>{getStatusBadge(jump.status)}</TableCell>
                          {currentUser?.role === 'admin' && (
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingJump(jump);
                                    setActiveTab("edit");
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteJump(jump.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold">No se encontraron Jumps</h3>
                    <p className="text-muted-foreground mt-2">
                      Intenta cambiar los filtros o crea un nuevo Jump.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {currentUser?.role === 'admin' && (
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nuevo Jump</CardTitle>
                  <CardDescription>Complete el formulario para crear un nuevo Jump</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleCreateJump)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input placeholder="Nombre del Jump" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoría</FormLabel>
                              <FormControl>
                                <Input placeholder="Categoría" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo</FormLabel>
                              <FormControl>
                                <Input placeholder="Tipo de Jump" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="visibility"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Visibilidad</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar visibilidad" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="copilot">Copiloto</SelectItem>
                                  <SelectItem value="client">Cliente</SelectItem>
                                  <SelectItem value="all">Todos</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="basePrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Precio Base</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0.00" 
                                  {...field} 
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="customizationHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horas de Personalización</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0" 
                                  {...field} 
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="active">Activo</SelectItem>
                                  <SelectItem value="inactive">Inactivo</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Descripción</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Descripción detallada del Jump" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="documentation"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Documentación</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Documentación del Jump (opcional)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="modules"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Módulos</FormLabel>
                                <div className="flex flex-col space-y-4">
                                  <div className="flex gap-2">
                                    <Input 
                                      placeholder="Nombre del módulo" 
                                      value={moduleInput}
                                      onChange={(e) => setModuleInput(e.target.value)}
                                    />
                                    <Button type="button" onClick={addModule}>
                                      Agregar
                                    </Button>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {field.value.map((module, index) => (
                                      <Badge key={index} variant="secondary" className="py-2">
                                        {module}
                                        <Button 
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-4 w-4 ml-1 p-0"
                                          onClick={() => removeModule(module)}
                                        >
                                          <Trash className="h-3 w-3" />
                                        </Button>
                                      </Badge>
                                    ))}
                                  </div>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setActiveTab("list")}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          Crear Jump
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {currentUser?.role === 'admin' && (
            <TabsContent value="edit">
              {editingJump && (
                <Card>
                  <CardHeader>
                    <CardTitle>Editar Jump</CardTitle>
                    <CardDescription>Modifica los detalles del Jump</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleUpdateJump)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Categoría</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="visibility"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Visibilidad</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar visibilidad" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="copilot">Copiloto</SelectItem>
                                    <SelectItem value="client">Cliente</SelectItem>
                                    <SelectItem value="all">Todos</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="basePrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Precio Base</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={e => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="customizationHours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Horas de Personalización</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={e => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar estado" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="inactive">Inactivo</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="documentation"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Documentación</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="md:col-span-2">
                            <FormField
                              control={form.control}
                              name="modules"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Módulos</FormLabel>
                                  <div className="flex flex-col space-y-4">
                                    <div className="flex gap-2">
                                      <Input 
                                        placeholder="Nombre del módulo" 
                                        value={moduleInput}
                                        onChange={(e) => setModuleInput(e.target.value)}
                                      />
                                      <Button type="button" onClick={addModule}>
                                        Agregar
                                      </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {field.value.map((module, index) => (
                                        <Badge key={index} variant="secondary" className="py-2">
                                          {module}
                                          <Button 
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 ml-1 p-0"
                                            onClick={() => removeModule(module)}
                                          >
                                            <Trash className="h-3 w-3" />
                                          </Button>
                                        </Badge>
                                      ))}
                                    </div>
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setEditingJump(null);
                              setActiveTab("list");
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={() => {
                              if (editingJump) {
                                handleDeleteJump(editingJump.id);
                              }
                            }}
                          >
                            Eliminar
                          </Button>
                          <Button type="submit">
                            Actualizar
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Jumps;
