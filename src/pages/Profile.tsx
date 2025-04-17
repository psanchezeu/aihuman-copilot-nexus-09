
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Key,
  Briefcase,
  Star,
  Bell,
  Shield,
  BookUser,
  Upload,
  UserCog,
} from "lucide-react";

const Profile = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    company: currentUser?.company || "",
    sector: currentUser?.sector || "",
    address: currentUser?.address || "",
    bio: currentUser?.bio || "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    projectUpdates: true,
    paymentNotifications: true,
    marketingEmails: false,
  });

  const handleSaveProfile = () => {
    // Here we would update the user profile in the storage service
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios se han guardado correctamente",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferencias guardadas",
      description: "Tus preferencias de notificaciones han sido actualizadas",
    });
  };

  const handleGenerateApiKey = () => {
    toast({
      title: "API Key generada",
      description: "Tu nueva API Key ha sido generada correctamente"
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Mi perfil</h1>
            <p className="text-muted-foreground">
              Administra tu perfil y preferencias de cuenta
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                    <AvatarFallback className="text-3xl">
                      {currentUser?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{currentUser?.name}</CardTitle>
                  <Badge className="mt-2">
                    {currentUser?.role === 'admin' ? 'Administrador' : 
                     currentUser?.role === 'copilot' ? 'Copiloto' : 'Cliente'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Miembro desde {new Date(currentUser?.createdAt || "").toLocaleDateString()}
                </p>
                <Button className="w-full mt-4" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Cambiar foto
                </Button>
              </CardContent>
              {currentUser?.role === 'copilot' && (
                <CardFooter className="flex-col gap-4 text-center border-t pt-4">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                    <span className="font-medium">{currentUser?.ratings || 4.8} / 5</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.projectsCompleted || 15} proyectos completados
                  </p>
                </CardFooter>
              )}
            </Card>

            {currentUser?.role === 'admin' && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Acceso administrativo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => toast({
                      title: "Panel administrativo",
                      description: "Accediendo al panel de administración"
                    })}
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    Panel de administración
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentUser?.role === 'copilot' && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">API Key</CardTitle>
                  <CardDescription>
                    Para integraciones personalizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-3 bg-gray-50 text-xs font-mono truncate">
                    {currentUser?.apiKey || "No hay API Key generada"}
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateApiKey}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Generar nueva API Key
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Información</TabsTrigger>
                <TabsTrigger value="preferences">Preferencias</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Información personal</CardTitle>
                    <CardDescription>
                      Actualiza tu información de contacto y personal
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="name" 
                          className="pl-10" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          className="pl-10" 
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          className="pl-10" 
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="company" 
                            className="pl-10" 
                            value={profileData.company}
                            onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sector">Sector</Label>
                        <Input 
                          id="sector" 
                          value={profileData.sector}
                          onChange={(e) => setProfileData({...profileData, sector: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="address" 
                          className="pl-10" 
                          value={profileData.address}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button onClick={handleSaveProfile}>
                      Guardar cambios
                    </Button>
                  </CardFooter>
                </Card>

                {(currentUser?.role === 'copilot' || currentUser?.role === 'admin') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Perfil profesional</CardTitle>
                      <CardDescription>
                        Información visible para clientes y otros usuarios
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografía profesional</Label>
                        <Textarea 
                          id="bio" 
                          placeholder="Describe tu experiencia profesional y especialidades..."
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          className="min-h-[120px]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="specialties">Especialidades</Label>
                        <Input 
                          id="specialties" 
                          placeholder="Ej: IA, Automatización, CRM, Web Apps (separadas por comas)"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="portfolio">URL de portfolio</Label>
                        <Input 
                          id="portfolio" 
                          placeholder="https://tuportfolio.com"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => toast({
                          title: "Vista previa",
                          description: "Función en desarrollo"
                        })}
                      >
                        <BookUser className="mr-2 h-4 w-4" />
                        Ver perfil público
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        Guardar perfil
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias de notificación</CardTitle>
                    <CardDescription>
                      Personaliza las notificaciones que recibes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="email-notif" className="flex-1">
                        <div className="font-medium">Notificaciones por email</div>
                        <p className="text-sm text-muted-foreground">
                          Recibir alertas importantes en tu correo electrónico
                        </p>
                      </Label>
                      <Switch
                        id="email-notif"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, emailNotifications: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="project-update" className="flex-1">
                        <div className="font-medium">Actualizaciones de proyectos</div>
                        <p className="text-sm text-muted-foreground">
                          Cuando hay cambios en tus proyectos asignados
                        </p>
                      </Label>
                      <Switch
                        id="project-update"
                        checked={notificationSettings.projectUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, projectUpdates: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="payment-notif" className="flex-1">
                        <div className="font-medium">Notificaciones de pagos</div>
                        <p className="text-sm text-muted-foreground">
                          Avisos sobre facturas y transacciones
                        </p>
                      </Label>
                      <Switch
                        id="payment-notif"
                        checked={notificationSettings.paymentNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, paymentNotifications: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="marketing-email" className="flex-1">
                        <div className="font-medium">Emails de marketing</div>
                        <p className="text-sm text-muted-foreground">
                          Novedades, ofertas y actualizaciones promocionales
                        </p>
                      </Label>
                      <Switch
                        id="marketing-email"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, marketingEmails: checked})
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button onClick={handleSaveNotifications}>
                      <Bell className="mr-2 h-4 w-4" />
                      Guardar preferencias
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias de aplicación</CardTitle>
                    <CardDescription>
                      Personaliza tu experiencia en la plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="dark-mode" className="flex-1">
                        <div className="font-medium">Modo oscuro</div>
                        <p className="text-sm text-muted-foreground">
                          Interfaz con tema oscuro
                        </p>
                      </Label>
                      <Switch
                        id="dark-mode"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="compact-view" className="flex-1">
                        <div className="font-medium">Vista compacta</div>
                        <p className="text-sm text-muted-foreground">
                          Reduce el espaciado entre elementos
                        </p>
                      </Label>
                      <Switch
                        id="compact-view"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button onClick={() => toast({
                      title: "Preferencias guardadas",
                      description: "Tus preferencias de aplicación han sido actualizadas"
                    })}>
                      Guardar preferencias
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Seguridad de la cuenta</CardTitle>
                    <CardDescription>
                      Gestiona tus credenciales y seguridad
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Cambiar contraseña</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="current-password">Contraseña actual</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new-password">Nueva contraseña</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      <Button className="mt-4" onClick={() => toast({
                        title: "Contraseña actualizada",
                        description: "Tu contraseña ha sido cambiada con éxito"
                      })}>
                        Actualizar contraseña
                      </Button>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <h3 className="font-medium mb-3">Autenticación de dos factores</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Activa la verificación en dos pasos para mayor seguridad
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => toast({
                          title: "2FA",
                          description: "Función en desarrollo"
                        })}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Configurar 2FA
                      </Button>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <h3 className="font-medium mb-3">Sesiones activas</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Dispositivos conectados actualmente a tu cuenta
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => toast({
                          title: "Sesiones",
                          description: "Función en desarrollo"
                        })}
                      >
                        Ver sesiones activas
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Zona de peligro</CardTitle>
                    <CardDescription>
                      Acciones irreversibles para tu cuenta
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Exportar mis datos</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Descarga toda tu información personal
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => toast({
                            title: "Exportación de datos",
                            description: "La exportación comenzará en breve"
                          })}
                        >
                          Solicitar datos
                        </Button>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="font-medium text-red-600 mb-2">Eliminar mi cuenta</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Esta acción es permanente y no puede deshacerse
                        </p>
                        <Button 
                          variant="destructive"
                          onClick={() => toast({
                            title: "Precaución",
                            description: "Esta acción requiere confirmación adicional",
                            variant: "destructive"
                          })}
                        >
                          Eliminar cuenta
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
