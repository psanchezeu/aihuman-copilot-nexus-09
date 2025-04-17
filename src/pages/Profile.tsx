
import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Key, Lock, Save, Trash, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUserById, updateUser } from '@/lib/storageService';

// Form schema for Profile
const profileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().optional(),
  company: z.string().optional(),
  sector: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  portfolio: z.string().optional(),
  commPreferences: z.array(z.string()).optional(),
});

// Form schema for Password
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(6, "La confirmación de contraseña es requerida"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Form schema for API Key
const apiKeySchema = z.object({
  apiKey: z.string().optional(),
});

const Profile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("info");
  const [specialtyInput, setSpecialtyInput] = useState("");
  
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      company: currentUser?.company || "",
      sector: currentUser?.sector || "",
      address: currentUser?.address || "",
      bio: currentUser?.bio || "",
      specialties: currentUser?.specialties || [],
      portfolio: currentUser?.portfolio || "",
      commPreferences: currentUser?.commPreferences || [],
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const apiKeyForm = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      apiKey: currentUser?.apiKey || "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone || "",
        company: currentUser.company || "",
        sector: currentUser.sector || "",
        address: currentUser.address || "",
        bio: currentUser.bio || "",
        specialties: currentUser.specialties || [],
        portfolio: currentUser.portfolio || "",
        commPreferences: currentUser.commPreferences || [],
      });
      
      apiKeyForm.reset({
        apiKey: currentUser.apiKey || "",
      });
    }
  }, [currentUser]);

  const handleUpdateProfile = (data: z.infer<typeof profileSchema>) => {
    if (!currentUser) return;
    
    try {
      const updatedUser = updateUser({
        ...currentUser,
        ...data,
      });
      
      setCurrentUser(updatedUser);
      
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar tu perfil",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePassword = (data: z.infer<typeof passwordSchema>) => {
    // This would normally verify the current password against the stored password
    // and then update with the new password. For this demo, we'll just simulate success.
    
    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido actualizada correctamente",
    });
    
    passwordForm.reset();
  };

  const handleGenerateApiKey = () => {
    if (!currentUser || currentUser.role !== 'copilot') return;
    
    const newApiKey = generateRandomApiKey();
    
    try {
      const updatedUser = updateUser({
        ...currentUser,
        apiKey: newApiKey,
      });
      
      setCurrentUser(updatedUser);
      apiKeyForm.setValue("apiKey", newApiKey);
      
      toast({
        title: "API Key generada",
        description: "Tu nueva API Key ha sido generada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al generar la API Key",
        variant: "destructive",
      });
    }
  };

  const generateRandomApiKey = () => {
    return 'aihc_' + Array(32)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('');
  };

  const addSpecialty = () => {
    if (!specialtyInput.trim()) return;
    
    const currentSpecialties = profileForm.getValues("specialties") || [];
    
    if (!currentSpecialties.includes(specialtyInput.trim())) {
      profileForm.setValue("specialties", [...currentSpecialties, specialtyInput.trim()]);
    }
    
    setSpecialtyInput("");
  };

  const removeSpecialty = (specialty: string) => {
    const currentSpecialties = profileForm.getValues("specialties") || [];
    profileForm.setValue("specialties", currentSpecialties.filter(s => s !== specialty));
  };

  const toggleCommPreference = (pref: string) => {
    const currentPrefs = profileForm.getValues("commPreferences") || [];
    const updated = currentPrefs.includes(pref)
      ? currentPrefs.filter(p => p !== pref)
      : [...currentPrefs, pref];
    
    profileForm.setValue("commPreferences", updated);
  };

  if (!currentUser) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>No has iniciado sesión</CardTitle>
              <CardDescription>
                Por favor inicia sesión para ver tu perfil
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href="/login">Iniciar Sesión</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona y actualiza tu información personal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentUser.avatar || ""} alt={currentUser.name} />
                  <AvatarFallback className="text-2xl">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold">{currentUser.name}</h2>
                <Badge className="mt-2">{
                  currentUser.role === 'admin' ? 'Administrador' : 
                  currentUser.role === 'copilot' ? 'Copiloto' : 'Cliente'
                }</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{currentUser.email}</span>
                </div>
                {currentUser.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{currentUser.phone}</span>
                  </div>
                )}
                {currentUser.company && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{currentUser.company}</span>
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Fecha de registro</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(currentUser.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
              
              {currentUser.role === 'copilot' && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Estadísticas</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Valoración</p>
                        <p className="font-medium">
                          {currentUser.ratings || 0} / 5
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Proyectos</p>
                        <p className="font-medium">
                          {currentUser.projectsCompleted || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
                {currentUser.role === 'copilot' && (
                  <TabsTrigger value="apikey">API Key</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                      Actualiza tu información personal y preferencias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
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
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {currentUser.role === 'client' && (
                            <>
                              <FormField
                                control={profileForm.control}
                                name="company"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Empresa</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={profileForm.control}
                                name="sector"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Sector</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )}

                          <FormField
                            control={profileForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className={currentUser.role === 'client' ? "" : "md:col-span-2"}>
                                <FormLabel>Dirección</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Biografía</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Cuéntanos un poco sobre ti"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {currentUser.role === 'copilot' && (
                            <>
                              <FormField
                                control={profileForm.control}
                                name="portfolio"
                                render={({ field }) => (
                                  <FormItem className="md:col-span-2">
                                    <FormLabel>Portfolio URL</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="https://tuportfolio.com"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="md:col-span-2">
                                <FormField
                                  control={profileForm.control}
                                  name="specialties"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Especialidades</FormLabel>
                                      <div className="flex flex-col space-y-4">
                                        <div className="flex gap-2">
                                          <Input 
                                            placeholder="Añadir especialidad" 
                                            value={specialtyInput}
                                            onChange={(e) => setSpecialtyInput(e.target.value)}
                                          />
                                          <Button type="button" onClick={addSpecialty}>
                                            Agregar
                                          </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {field.value?.map((specialty, index) => (
                                            <Badge key={index} variant="secondary" className="py-2">
                                              {specialty}
                                              <Button 
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-4 w-4 ml-1 p-0"
                                                onClick={() => removeSpecialty(specialty)}
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
                            </>
                          )}

                          <div className="md:col-span-2">
                            <FormField
                              control={profileForm.control}
                              name="commPreferences"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Preferencias de Comunicación</FormLabel>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge 
                                      variant={field.value?.includes('email') ? 'default' : 'outline'}
                                      className="cursor-pointer py-2"
                                      onClick={() => toggleCommPreference('email')}
                                    >
                                      Email
                                    </Badge>
                                    <Badge 
                                      variant={field.value?.includes('sms') ? 'default' : 'outline'}
                                      className="cursor-pointer py-2"
                                      onClick={() => toggleCommPreference('sms')}
                                    >
                                      SMS
                                    </Badge>
                                    <Badge 
                                      variant={field.value?.includes('app') ? 'default' : 'outline'}
                                      className="cursor-pointer py-2"
                                      onClick={() => toggleCommPreference('app')}
                                    >
                                      App
                                    </Badge>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit">
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Cambios
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Seguridad</CardTitle>
                    <CardDescription>
                      Gestiona tu contraseña y opciones de seguridad
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(handleUpdatePassword)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contraseña Actual</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nueva Contraseña</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit">
                            <Lock className="h-4 w-4 mr-2" />
                            Cambiar Contraseña
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {currentUser.role === 'copilot' && (
                <TabsContent value="apikey">
                  <Card>
                    <CardHeader>
                      <CardTitle>API Key</CardTitle>
                      <CardDescription>
                        Administra tu API Key para integrar nuestros servicios
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...apiKeyForm}>
                        <div className="space-y-6">
                          <FormField
                            control={apiKeyForm.control}
                            name="apiKey"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tu API Key</FormLabel>
                                <FormDescription>
                                  Esta clave te permite conectar tus aplicaciones con nuestra plataforma
                                </FormDescription>
                                <div className="flex gap-2">
                                  <FormControl>
                                    <Input 
                                      readOnly
                                      value={field.value || "No hay API Key generada"}
                                      className="font-mono text-xs"
                                    />
                                  </FormControl>
                                  <Button type="button" onClick={handleGenerateApiKey}>
                                    <Key className="h-4 w-4 mr-2" />
                                    {field.value ? "Regenerar" : "Generar"}
                                  </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md dark:bg-amber-950 dark:border-amber-900">
                            <h4 className="font-medium text-sm text-amber-800 dark:text-amber-300">
                              ¡Importante!
                            </h4>
                            <p className="text-xs text-amber-700 mt-1 dark:text-amber-400">
                              Mantén tu API Key segura. No la compartas públicamente ni la incluyas en repositorios de código.
                            </p>
                          </div>
                        </div>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
