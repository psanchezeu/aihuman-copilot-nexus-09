
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  Bot, 
  CalendarDays, 
  CreditCard, 
  Headphones, 
  Home, 
  LayoutDashboard, 
  MessageSquare, 
  Package, 
  Settings, 
  Ticket, 
  UserRound, 
  Users, 
  X 
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        title: 'Proyectos',
        href: '/projects',
        icon: <Package className="h-5 w-5" />,
      },
      {
        title: 'Mensajes',
        href: '/messages',
        icon: <MessageSquare className="h-5 w-5" />,
      },
    ];

    const adminItems = [
      ...commonItems,
      {
        title: 'Clientes',
        href: '/clients',
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: 'Copilotos',
        href: '/copilots',
        icon: <Bot className="h-5 w-5" />,
      },
      {
        title: 'Jumps',
        href: '/jumps',
        icon: <Package className="h-5 w-5" />,
      },
      {
        title: 'Pagos',
        href: '/payments',
        icon: <CreditCard className="h-5 w-5" />,
      },
      {
        title: 'Estadísticas',
        href: '/statistics',
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        title: 'Configuración',
        href: '/settings',
        icon: <Settings className="h-5 w-5" />,
      },
    ];

    const copilotItems = [
      ...commonItems,
      {
        title: 'Tareas',
        href: '/tasks',
        icon: <CalendarDays className="h-5 w-5" />,
      },
      {
        title: 'Clientes',
        href: '/my-clients',
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: 'Portafolio',
        href: '/portfolio',
        icon: <UserRound className="h-5 w-5" />,
      },
    ];

    const clientItems = [
      ...commonItems,
      {
        title: 'Jumps',
        href: '/jumps-catalog',
        icon: <Package className="h-5 w-5" />,
      },
      {
        title: 'Soporte',
        href: '/support',
        icon: <Headphones className="h-5 w-5" />,
      },
      {
        title: 'Facturas',
        href: '/invoices',
        icon: <CreditCard className="h-5 w-5" />,
      },
    ];

    switch (currentUser?.role) {
      case 'admin':
        return adminItems;
      case 'copilot':
        return copilotItems;
      case 'client':
        return clientItems;
      default:
        return commonItems;
    }
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 shadow-md z-20 h-screen transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="px-4 py-6">
        <div className="flex justify-between items-center">
          {!collapsed && (
            <Link to="/dashboard" className="text-2xl font-bold text-bloodRed">
              {collapsed ? "AC" : "AI HUMAN COPILOT"}
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCollapsed(!collapsed)} 
            className="ml-auto"
          >
            {collapsed ? (
              <Home className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="mt-8 space-y-1">
          {getNavItems().map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 rounded-md",
                "hover:bg-gray-100 hover:text-bloodRed dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
                pathname === item.href && "bg-gray-100 text-bloodRed dark:bg-gray-800 dark:text-white"
              )}
            >
              {item.icon}
              {!collapsed && <span className="mx-4 font-medium">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User'}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                {currentUser?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                {currentUser?.role === 'admin' ? 'Administrador' : 
                 currentUser?.role === 'copilot' ? 'Copiloto' : 'Cliente'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
