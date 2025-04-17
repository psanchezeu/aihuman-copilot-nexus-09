
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Clock, Filter, MoreHorizontal, Plus, Search } from 'lucide-react';
import { Project, Jump, User } from '@/lib/models';
import { getProjects, getJumpById, getUserById, getTasksByProjectId } from '@/lib/storageService';
import { useAuth } from '@/contexts/AuthContext';

const Projects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (currentUser) {
      let projectList: Project[] = [];
      
      switch (currentUser.role) {
        case 'admin':
          projectList = getProjects();
          break;
        case 'copilot':
          projectList = getProjects().filter(p => p.copilotId === currentUser.id);
          break;
        case 'client':
          projectList = getProjects().filter(p => p.clientId === currentUser.id);
          break;
      }
      
      setProjects(projectList);
      setFilteredProjects(projectList);
    }
  }, [currentUser]);

  useEffect(() => {
    let result = projects;

    // Apply search term filter
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    setFilteredProjects(result);
  }, [searchTerm, statusFilter, projects]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline">Planificado</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">En progreso</Badge>;
      case 'completed':
        return <Badge>Completado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getProjectDetails = (project: Project) => {
    const client = getUserById(project.clientId);
    const copilot = getUserById(project.copilotId);
    const jump = project.jumpId ? getJumpById(project.jumpId) : null;
    const tasks = getTasksByProjectId(project.id);
    
    return {
      clientName: client?.name || 'Cliente desconocido',
      copilotName: copilot?.name || 'Copiloto desconocido',
      jumpName: jump?.name || 'Proyecto personalizado',
      tasksCount: tasks.length,
      completedTasksCount: tasks.filter(t => t.status === 'completed').length,
    };
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Proyectos</h1>
            {currentUser?.role !== 'client' && (
              <Button className="bg-bloodRed hover:bg-red-800">
                <Plus className="h-4 w-4 mr-2" /> Nuevo Proyecto
              </Button>
            )}
          </div>
          <p className="text-muted-foreground">
            {currentUser?.role === 'admin'
              ? 'Gestiona todos los proyectos de la plataforma'
              : currentUser?.role === 'copilot'
              ? 'Administra los proyectos asignados a ti'
              : 'Visualiza tus proyectos activos'}
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px] gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="planned">Planificado</SelectItem>
                  <SelectItem value="in_progress">En progreso</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Projects list */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Proyectos</CardTitle>
              <CardDescription>
                {filteredProjects.length} proyectos encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProjects.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        {currentUser?.role === 'admin' && (
                          <>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Copiloto</TableHead>
                          </>
                        )}
                        {currentUser?.role === 'client' && (
                          <TableHead>Copiloto</TableHead>
                        )}
                        {currentUser?.role === 'copilot' && (
                          <TableHead>Cliente</TableHead>
                        )}
                        <TableHead>Tipo</TableHead>
                        <TableHead>Inicio</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Progreso</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProjects.map((project) => {
                        const details = getProjectDetails(project);
                        const progress = details.tasksCount > 0
                          ? Math.round((details.completedTasksCount / details.tasksCount) * 100)
                          : 0;
                          
                        return (
                          <TableRow key={project.id}>
                            <TableCell className="font-medium">{project.name}</TableCell>
                            {currentUser?.role === 'admin' && (
                              <>
                                <TableCell>{details.clientName}</TableCell>
                                <TableCell>{details.copilotName}</TableCell>
                              </>
                            )}
                            {currentUser?.role === 'client' && (
                              <TableCell>{details.copilotName}</TableCell>
                            )}
                            {currentUser?.role === 'copilot' && (
                              <TableCell>{details.clientName}</TableCell>
                            )}
                            <TableCell>{details.jumpName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDate(project.startDate)}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(project.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-bloodRed"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {progress}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                  <DropdownMenuItem>Ver tareas</DropdownMenuItem>
                                  <DropdownMenuItem>Mensajes</DropdownMenuItem>
                                  {currentUser?.role !== 'client' && (
                                    <DropdownMenuItem>Editar proyecto</DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">No se encontraron proyectos</h3>
                  <p className="text-muted-foreground mt-2">
                    Intenta cambiar los filtros o crea un nuevo proyecto.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14 días</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Duración promedio por proyecto
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredProjects.filter(p => p.status === 'in_progress').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  De {filteredProjects.length} proyectos totales
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Completados</CardTitle>
                <Filter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredProjects.filter(p => p.status === 'completed').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Proyectos finalizados exitosamente
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Projects;
