
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Clock,
  DollarSign,
  LineChart,
  Package,
  Users,
} from 'lucide-react';
import { getProjects, getTasks, getJumps, getUsersByRole } from '@/lib/storageService';
import { Project, Task, Jump, User } from '@/lib/models';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [jumps, setJumps] = useState<Jump[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [copilots, setCopilots] = useState<User[]>([]);

  useEffect(() => {
    // Load data based on user role
    if (currentUser) {
      if (currentUser.role === 'admin') {
        setProjects(getProjects());
        setTasks(getTasks());
        setJumps(getJumps());
        setClients(getUsersByRole('client'));
        setCopilots(getUsersByRole('copilot'));
      } else if (currentUser.role === 'copilot') {
        setProjects(getProjects().filter(p => p.copilotId === currentUser.id));
        setTasks(getTasks().filter(t => t.copilotId === currentUser.id));
        setJumps(getJumps());
        // Get clients for this copilot's projects
        const clientIds = getProjects()
          .filter(p => p.copilotId === currentUser.id)
          .map(p => p.clientId);
        setClients(getUsersByRole('client').filter(c => clientIds.includes(c.id)));
      } else {
        // Client
        setProjects(getProjects().filter(p => p.clientId === currentUser.id));
        setJumps(getJumps());
        // Get related copilots
        const copilotIds = getProjects()
          .filter(p => p.clientId === currentUser.id)
          .map(p => p.copilotId);
        setCopilots(getUsersByRole('copilot').filter(c => copilotIds.includes(c.id)));
      }
    }
  }, [currentUser]);

  // Stats for dashboard
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const activeJumps = jumps.filter(j => j.status === 'active').length;

  // Calculate total revenue (for admin) or spending (for clients)
  const totalAmount = projects.reduce((sum, project) => sum + project.totalPrice, 0);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Bienvenido, {currentUser?.name}
            </h1>
            <Badge variant="outline" className="text-sm">
              {currentUser?.role === 'admin'
                ? 'Administrador'
                : currentUser?.role === 'copilot'
                ? 'Copiloto'
                : 'Cliente'}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {currentUser?.role === 'admin'
              ? 'Gestiona usuarios, proyectos y jumps desde tu panel.'
              : currentUser?.role === 'copilot'
              ? 'Administra tus proyectos y tareas asignadas.'
              : 'Descubre jumps, supervisa tu progreso y solicita ayuda.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {currentUser?.role === 'admin' || currentUser?.role === 'copilot'
                  ? 'Proyectos Activos'
                  : 'Mis Proyectos'}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedProjects} completados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {currentUser?.role === 'admin' 
                  ? 'Tareas Pendientes' 
                  : currentUser?.role === 'copilot'
                  ? 'Mis Tareas'
                  : 'Tareas en Progreso'}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {tasks.length - pendingTasks} completadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {currentUser?.role === 'admin'
                  ? 'Usuarios'
                  : currentUser?.role === 'copilot'
                  ? 'Clientes'
                  : 'Copilotos Asignados'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentUser?.role === 'admin'
                  ? clients.length + copilots.length
                  : currentUser?.role === 'copilot'
                  ? clients.length
                  : copilots.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentUser?.role === 'admin'
                  ? `${clients.length} clientes, ${copilots.length} copilotos`
                  : 'Asignados a tus proyectos'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {currentUser?.role === 'admin'
                  ? 'Facturación Total'
                  : currentUser?.role === 'copilot'
                  ? 'Facturación Gestionada' 
                  : 'Inversión Total'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentUser?.role === 'admin'
                  ? 'Ingresos acumulados'
                  : currentUser?.role === 'copilot' 
                  ? 'En proyectos asignados'
                  : 'En soluciones implementadas'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Proyectos Recientes</CardTitle>
              <CardDescription>
                {currentUser?.role === 'admin'
                  ? 'Los últimos proyectos en la plataforma'
                  : 'Tus proyectos recientes'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(project.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          project.status === 'completed'
                            ? 'default'
                            : project.status === 'in_progress'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {project.status === 'completed'
                          ? 'Completado'
                          : project.status === 'in_progress'
                          ? 'En Progreso'
                          : 'Planificado'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No hay proyectos recientes.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {currentUser?.role === 'client' ? 'Jumps Recomendados' : 'Jumps Populares'}
              </CardTitle>
              <CardDescription>
                {currentUser?.role === 'client'
                  ? 'Soluciones preconfiguradas para tu negocio'
                  : 'Los jumps más utilizados en la plataforma'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jumps.length > 0 ? (
                <div className="space-y-4">
                  {jumps.slice(0, 5).map((jump) => (
                    <div
                      key={jump.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{jump.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {jump.category} · ${jump.basePrice}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {jump.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No hay jumps disponibles.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {currentUser?.role === 'admin' && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas Generales</CardTitle>
                <CardDescription>Resumen de actividad en la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                  <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">
                    Las visualizaciones de gráficos se cargarán aquí con datos reales.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
