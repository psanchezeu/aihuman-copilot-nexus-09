
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Users,
  CreditCard,
  Mail,
  PaletteIcon,
  Globe,
  FileText,
  Save,
} from "lucide-react";

const Settings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Only admins can access all settings
  const isAdmin = currentUser?.role === "admin";

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "AI Human Copilot",
    siteDescription: "Plataforma de copilotos humanos expertos asistidos por IA",
    contactEmail: "info@aihumancopilot.com",
    platformCurrency: "EUR",
    language: "es",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    systemNotifications: true,
    marketingEmails: false,
    newClientAlert: true,
    paymentNotifications: true,
    projectUpdates: true,
  });

  const handleSaveSettings = () => {
    toast({
      title: "Configuración guardada",
      description: "Los cambios se han aplicado correctamente",
    });
  };

  // If not admin, restrict access
  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <SettingsIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acceso restringido</h1>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            La configuración del sistema solo está disponible para administradores.
          </p>
          <Button onClick={() => window.history.back()}>
            Volver
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Configuración</h1>
            <p className="text-muted-foreground">
              Administra los ajustes globales de la plataforma
            </p>
          </div>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Guardar cambios
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64">
              <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                <TabsTrigger value="general" className="w-full justify-start gap-2 px-3">
                  <SettingsIcon className="h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="users" className="w-full justify-start gap-2 px-3">
                  <Users className="h-4 w-4" />
                  Usuarios
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start gap-2 px-3">
                  <Bell className="h-4 w-4" />
                  Notificaciones
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start gap-2 px-3">
                  <Shield className="h-4 w-4" />
                  Seguridad
                </TabsTrigger>
                <TabsTrigger value="billing" className="w-full justify-start gap-2 px-3">
                  <CreditCard className="h-4 w-4" />
                  Facturación
                </TabsTrigger>
                <TabsTrigger value="appearance" className="w-full justify-start gap-2 px-3">
                  <PaletteIcon className="h-4 w-4" />
                  Apariencia
                </TabsTrigger>
                <TabsTrigger value="legal" className="w-full justify-start gap-2 px-3">
                  <FileText className="h-4 w-4" />
                  Legal
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1">
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración General</CardTitle>
                    <CardDescription>
                      Configuración básica de la plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Nombre de la plataforma</Label>
                      <Input 
                        id="siteName" 
                        value={generalSettings.siteName} 
                        onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Descripción</Label>
                      <Input 
                        id="siteDescription" 
                        value={generalSettings.siteDescription} 
                        onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email de contacto</Label>
                      <Input 
                        id="contactEmail" 
                        value={generalSettings.contactEmail} 
                        onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                      />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Moneda</Label>
                        <Select 
                          value={generalSettings.platformCurrency}
                          onValueChange={(value) => setGeneralSettings({...generalSettings, platformCurrency: value})}
                        >
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Selecciona una moneda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="USD">Dólar ($)</SelectItem>
                            <SelectItem value="GBP">Libra (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Idioma predeterminado</Label>
                        <Select 
                          value={generalSettings.language}
                          onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Selecciona un idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">Inglés</SelectItem>
                            <SelectItem value="fr">Francés</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Módulos Activos</CardTitle>
                    <CardDescription>
                      Activa o desactiva las funcionalidades de la plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="client-registration" defaultChecked />
                      <Label htmlFor="client-registration">Registro de clientes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="copilot-registration" defaultChecked />
                      <Label htmlFor="copilot-registration">Registro de copilotos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="jump-purchase" defaultChecked />
                      <Label htmlFor="jump-purchase">Compra de Jumps</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="custom-project" defaultChecked />
                      <Label htmlFor="custom-project">Proyectos personalizados</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="payment-system" defaultChecked />
                      <Label htmlFor="payment-system">Sistema de pagos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="chat-system" defaultChecked />
                      <Label htmlFor="chat-system">Chat interno</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="rating-system" defaultChecked />
                      <Label htmlFor="rating-system">Sistema de valoraciones</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="api-access" defaultChecked />
                      <Label htmlFor="api-access">Acceso API para copilotos</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Notificaciones</CardTitle>
                    <CardDescription>
                      Administra los ajustes de notificaciones para todos los usuarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Notificaciones del sistema</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="email-notifications" 
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, emailNotifications: checked})
                            }
                          />
                          <Label htmlFor="email-notifications">Notificaciones por email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="system-notifications"
                            checked={notificationSettings.systemNotifications}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, systemNotifications: checked})
                            }
                          />
                          <Label htmlFor="system-notifications">Notificaciones del sistema</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="marketing-emails"
                            checked={notificationSettings.marketingEmails}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, marketingEmails: checked})
                            }
                          />
                          <Label htmlFor="marketing-emails">Emails de marketing</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Eventos que generan notificaciones</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="new-client-alert"
                            checked={notificationSettings.newClientAlert}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, newClientAlert: checked})
                            }
                          />
                          <Label htmlFor="new-client-alert">Nuevo cliente registrado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="payment-notifications"
                            checked={notificationSettings.paymentNotifications}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, paymentNotifications: checked})
                            }
                          />
                          <Label htmlFor="payment-notifications">Pagos recibidos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="project-updates"
                            checked={notificationSettings.projectUpdates}
                            onCheckedChange={(checked) => 
                              setNotificationSettings({...notificationSettings, projectUpdates: checked})
                            }
                          />
                          <Label htmlFor="project-updates">Actualizaciones de proyectos</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Button 
                        onClick={() => toast({
                          title: "Configuración guardada",
                          description: "Las preferencias de notificaciones se han actualizado"
                        })}
                      >
                        Guardar preferencias
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Plantillas de Email</CardTitle>
                    <CardDescription>
                      Personaliza las plantillas usadas para las notificaciones por email
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="email-template">Plantilla seleccionada</Label>
                      <Select defaultValue="default">
                        <SelectTrigger id="email-template">
                          <SelectValue placeholder="Selecciona una plantilla" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Por defecto</SelectItem>
                          <SelectItem value="minimal">Minimalista</SelectItem>
                          <SelectItem value="custom">Personalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        variant="outline"
                        onClick={() => toast({
                          title: "Función en desarrollo",
                          description: "El editor de plantillas estará disponible próximamente"
                        })}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Editar plantillas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Seguridad</CardTitle>
                    <CardDescription>
                      Gestiona los parámetros de seguridad de la plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-4">Autenticación</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="2fa" defaultChecked />
                          <Label htmlFor="2fa">Habilitar autenticación de dos factores (2FA)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="google-auth" defaultChecked />
                          <Label htmlFor="google-auth">Permitir login con Google</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="passwordless" defaultChecked />
                          <Label htmlFor="passwordless">Permitir login sin contraseña (por email)</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-4">Políticas de contraseña</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="min-length">Longitud mínima:</Label>
                          <Select defaultValue="8">
                            <SelectTrigger id="min-length" className="w-20">
                              <SelectValue placeholder="8" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="12">12</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="require-special" defaultChecked />
                          <Label htmlFor="require-special">Requerir caracteres especiales</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="require-upper" defaultChecked />
                          <Label htmlFor="require-upper">Requerir mayúsculas y minúsculas</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="require-number" defaultChecked />
                          <Label htmlFor="require-number">Requerir números</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-4">Límites de intento y bloqueo</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="max-attempts">Intentos máximos de login:</Label>
                          <Select defaultValue="5">
                            <SelectTrigger id="max-attempts" className="w-20">
                              <SelectValue placeholder="5" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="lockout-mins">Tiempo de bloqueo (minutos):</Label>
                          <Select defaultValue="15">
                            <SelectTrigger id="lockout-mins" className="w-20">
                              <SelectValue placeholder="15" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="15">15</SelectItem>
                              <SelectItem value="30">30</SelectItem>
                              <SelectItem value="60">60</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Button onClick={handleSaveSettings}>
                        Guardar configuración de seguridad
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Registro de actividades</CardTitle>
                    <CardDescription>
                      Configuración del sistema de logs y auditoría
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="login-log" defaultChecked />
                        <Label htmlFor="login-log">Registrar intentos de login</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="access-log" defaultChecked />
                        <Label htmlFor="access-log">Registrar accesos a secciones sensibles</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="admin-actions" defaultChecked />
                        <Label htmlFor="admin-actions">Registrar acciones administrativas</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="payment-actions" defaultChecked />
                        <Label htmlFor="payment-actions">Registrar operaciones de pago</Label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <Label htmlFor="log-retention">Retención de logs:</Label>
                      <Select defaultValue="12">
                        <SelectTrigger id="log-retention" className="w-32">
                          <SelectValue placeholder="12 meses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 meses</SelectItem>
                          <SelectItem value="6">6 meses</SelectItem>
                          <SelectItem value="12">12 meses</SelectItem>
                          <SelectItem value="24">24 meses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        variant="outline"
                        onClick={() => toast({
                          title: "Función en desarrollo",
                          description: "El visor de logs estará disponible próximamente"
                        })}
                      >
                        Ver registro de actividades
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Placeholder for other tabs */}
              {["users", "billing", "appearance", "legal"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración de {tab.charAt(0).toUpperCase() + tab.slice(1)}</CardTitle>
                      <CardDescription>
                        Esta sección está en desarrollo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Globe className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-center text-muted-foreground max-w-md">
                        La configuración detallada de esta sección estará disponible próximamente
                      </p>
                      <Button 
                        variant="outline"
                        className="mt-4"
                        onClick={() => toast({
                          title: "Función en desarrollo",
                          description: `La sección de ${tab} estará disponible pronto`
                        })}
                      >
                        Notificarme cuando esté disponible
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
