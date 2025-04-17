
import { 
  User, 
  Jump, 
  Project, 
  Task, 
  Invoice, 
  Message, 
  Ticket, 
  Rating, 
  ActivityLog, 
  Cart 
} from './models';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'aihc_users',
  CURRENT_USER: 'aihc_current_user',
  JUMPS: 'aihc_jumps',
  PROJECTS: 'aihc_projects',
  TASKS: 'aihc_tasks',
  INVOICES: 'aihc_invoices',
  MESSAGES: 'aihc_messages',
  TICKETS: 'aihc_tickets',
  RATINGS: 'aihc_ratings',
  LOGS: 'aihc_logs',
  CART: 'aihc_cart',
};

// Helper functions for localStorage
const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
  }
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// User management
export const getUsers = (): User[] => {
  return getItem<User[]>(STORAGE_KEYS.USERS, []);
};

export const getCurrentUser = (): User | null => {
  return getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
};

export const setCurrentUser = (user: User | null): void => {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
};

export const createUser = (user: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getUsers();
  const newUser = { 
    ...user, 
    id: generateId(), 
    createdAt: new Date().toISOString() 
  };
  
  setItem(STORAGE_KEYS.USERS, [...users, newUser]);
  return newUser;
};

export const updateUser = (user: User): User => {
  const users = getUsers();
  const updatedUsers = users.map(u => u.id === user.id ? user : u);
  
  setItem(STORAGE_KEYS.USERS, updatedUsers);
  
  // Update current user if it's the same
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === user.id) {
    setCurrentUser(user);
  }
  
  return user;
};

export const deleteUser = (userId: string): void => {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  
  setItem(STORAGE_KEYS.USERS, filteredUsers);
  
  // Clear current user if it's the same
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    setCurrentUser(null);
  }
};

export const getUserById = (userId: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.id === userId);
};

export const getUsersByRole = (role: 'admin' | 'copilot' | 'client'): User[] => {
  const users = getUsers();
  return users.filter(u => u.role === role);
};

// Jump management
export const getJumps = (): Jump[] => {
  return getItem<Jump[]>(STORAGE_KEYS.JUMPS, []);
};

export const createJump = (jump: Omit<Jump, 'id' | 'createdAt'>): Jump => {
  const jumps = getJumps();
  const newJump = { 
    ...jump, 
    id: generateId(), 
    createdAt: new Date().toISOString() 
  };
  
  setItem(STORAGE_KEYS.JUMPS, [...jumps, newJump]);
  return newJump;
};

export const updateJump = (jump: Jump): Jump => {
  const jumps = getJumps();
  const updatedJumps = jumps.map(j => j.id === jump.id ? jump : j);
  
  setItem(STORAGE_KEYS.JUMPS, updatedJumps);
  return jump;
};

export const deleteJump = (jumpId: string): void => {
  const jumps = getJumps();
  const filteredJumps = jumps.filter(j => j.id !== jumpId);
  
  setItem(STORAGE_KEYS.JUMPS, filteredJumps);
};

export const getJumpById = (jumpId: string): Jump | undefined => {
  const jumps = getJumps();
  return jumps.find(j => j.id === jumpId);
};

// Project management
export const getProjects = (): Project[] => {
  return getItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
};

export const createProject = (project: Omit<Project, 'id' | 'createdAt'>): Project => {
  const projects = getProjects();
  const newProject = { 
    ...project, 
    id: generateId(), 
    createdAt: new Date().toISOString() 
  };
  
  setItem(STORAGE_KEYS.PROJECTS, [...projects, newProject]);
  return newProject;
};

export const updateProject = (project: Project): Project => {
  const projects = getProjects();
  const updatedProjects = projects.map(p => p.id === project.id ? project : p);
  
  setItem(STORAGE_KEYS.PROJECTS, updatedProjects);
  return project;
};

export const deleteProject = (projectId: string): void => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.id !== projectId);
  
  setItem(STORAGE_KEYS.PROJECTS, filteredProjects);
};

export const getProjectById = (projectId: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(p => p.id === projectId);
};

export const getProjectsByClientId = (clientId: string): Project[] => {
  const projects = getProjects();
  return projects.filter(p => p.clientId === clientId);
};

export const getProjectsByCopilotId = (copilotId: string): Project[] => {
  const projects = getProjects();
  return projects.filter(p => p.copilotId === copilotId);
};

// Task management
export const getTasks = (): Task[] => {
  return getItem<Task[]>(STORAGE_KEYS.TASKS, []);
};

export const createTask = (task: Omit<Task, 'id' | 'createdAt'>): Task => {
  const tasks = getTasks();
  const newTask = { 
    ...task, 
    id: generateId(), 
    createdAt: new Date().toISOString() 
  };
  
  setItem(STORAGE_KEYS.TASKS, [...tasks, newTask]);
  return newTask;
};

export const updateTask = (task: Task): Task => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
  
  setItem(STORAGE_KEYS.TASKS, updatedTasks);
  return task;
};

export const deleteTask = (taskId: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(t => t.id !== taskId);
  
  setItem(STORAGE_KEYS.TASKS, filteredTasks);
};

export const getTaskById = (taskId: string): Task | undefined => {
  const tasks = getTasks();
  return tasks.find(t => t.id === taskId);
};

export const getTasksByProjectId = (projectId: string): Task[] => {
  const tasks = getTasks();
  return tasks.filter(t => t.projectId === projectId);
};

export const getTasksByCopilotId = (copilotId: string): Task[] => {
  const tasks = getTasks();
  return tasks.filter(t => t.copilotId === copilotId);
};

// Invoice management
export const getInvoices = (): Invoice[] => {
  return getItem<Invoice[]>(STORAGE_KEYS.INVOICES, []);
};

export const createInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>): Invoice => {
  const invoices = getInvoices();
  const newInvoice = { 
    ...invoice, 
    id: generateId(), 
    createdAt: new Date().toISOString() 
  };
  
  setItem(STORAGE_KEYS.INVOICES, [...invoices, newInvoice]);
  return newInvoice;
};

export const updateInvoice = (invoice: Invoice): Invoice => {
  const invoices = getInvoices();
  const updatedInvoices = invoices.map(i => i.id === invoice.id ? invoice : i);
  
  setItem(STORAGE_KEYS.INVOICES, updatedInvoices);
  return invoice;
};

export const deleteInvoice = (invoiceId: string): void => {
  const invoices = getInvoices();
  const filteredInvoices = invoices.filter(i => i.id !== invoiceId);
  
  setItem(STORAGE_KEYS.INVOICES, filteredInvoices);
};

export const getInvoiceById = (invoiceId: string): Invoice | undefined => {
  const invoices = getInvoices();
  return invoices.find(i => i.id === invoiceId);
};

export const getInvoicesByClientId = (clientId: string): Invoice[] => {
  const invoices = getInvoices();
  return invoices.filter(i => i.clientId === clientId);
};

export const getInvoicesByProjectId = (projectId: string): Invoice[] => {
  const invoices = getInvoices();
  return invoices.filter(i => i.projectId === projectId);
};

// Message management
export const getMessages = (): Message[] => {
  return getItem<Message[]>(STORAGE_KEYS.MESSAGES, []);
};

export const createMessage = (message: Omit<Message, 'id' | 'timestamp'>): Message => {
  const messages = getMessages();
  const newMessage = { 
    ...message, 
    id: generateId(), 
    timestamp: new Date().toISOString() 
  };
  
  setItem(STORAGE_KEYS.MESSAGES, [...messages, newMessage]);
  return newMessage;
};

export const updateMessage = (message: Message): Message => {
  const messages = getMessages();
  const updatedMessages = messages.map(m => m.id === message.id ? message : m);
  
  setItem(STORAGE_KEYS.MESSAGES, updatedMessages);
  return message;
};

export const deleteMessage = (messageId: string): void => {
  const messages = getMessages();
  const filteredMessages = messages.filter(m => m.id !== messageId);
  
  setItem(STORAGE_KEYS.MESSAGES, filteredMessages);
};

export const getMessageById = (messageId: string): Message | undefined => {
  const messages = getMessages();
  return messages.find(m => m.id === messageId);
};

export const getMessagesBySenderId = (senderId: string): Message[] => {
  const messages = getMessages();
  return messages.filter(m => m.senderId === senderId);
};

export const getMessagesByReceiverId = (receiverId: string): Message[] => {
  const messages = getMessages();
  return messages.filter(m => m.receiverId === receiverId);
};

export const getMessagesByProjectId = (projectId: string): Message[] => {
  const messages = getMessages();
  return messages.filter(m => m.projectId === projectId);
};

export const getMessagesByTicketId = (ticketId: string): Message[] => {
  const messages = getMessages();
  return messages.filter(m => m.ticketId === ticketId);
};

export const getConversation = (user1Id: string, user2Id: string): Message[] => {
  const messages = getMessages();
  return messages.filter(m => 
    (m.senderId === user1Id && m.receiverId === user2Id) || 
    (m.senderId === user2Id && m.receiverId === user1Id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Ticket management
export const getTickets = (): Ticket[] => {
  return getItem<Ticket[]>(STORAGE_KEYS.TICKETS, []);
};

export const createTicket = (ticket: Omit<Ticket, 'id' | 'createdAt'>): Ticket => {
  const tickets = getTickets();
  const newTicket = { 
    ...ticket, 
    id: generateId(), 
    createdAt: new Date().toISOString() 
  };
  
  setItem(STORAGE_KEYS.TICKETS, [...tickets, newTicket]);
  return newTicket;
};

export const updateTicket = (ticket: Ticket): Ticket => {
  const tickets = getTickets();
  const updatedTickets = tickets.map(t => t.id === ticket.id ? ticket : t);
  
  setItem(STORAGE_KEYS.TICKETS, updatedTickets);
  return ticket;
};

export const deleteTicket = (ticketId: string): void => {
  const tickets = getTickets();
  const filteredTickets = tickets.filter(t => t.id !== ticketId);
  
  setItem(STORAGE_KEYS.TICKETS, filteredTickets);
};

export const getTicketById = (ticketId: string): Ticket | undefined => {
  const tickets = getTickets();
  return tickets.find(t => t.id === ticketId);
};

export const getTicketsByClientId = (clientId: string): Ticket[] => {
  const tickets = getTickets();
  return tickets.filter(t => t.clientId === clientId);
};

export const getTicketsByAgentId = (agentId: string): Ticket[] => {
  const tickets = getTickets();
  return tickets.filter(t => t.assignedAgentId === agentId);
};

// Rating management
export const getRatings = (): Rating[] => {
  return getItem<Rating[]>(STORAGE_KEYS.RATINGS, []);
};

export const createRating = (rating: Omit<Rating, 'id'>): Rating => {
  const ratings = getRatings();
  const newRating = { 
    ...rating, 
    id: generateId()
  };
  
  setItem(STORAGE_KEYS.RATINGS, [...ratings, newRating]);
  return newRating;
};

export const updateRating = (rating: Rating): Rating => {
  const ratings = getRatings();
  const updatedRatings = ratings.map(r => r.id === rating.id ? rating : r);
  
  setItem(STORAGE_KEYS.RATINGS, updatedRatings);
  return rating;
};

export const deleteRating = (ratingId: string): void => {
  const ratings = getRatings();
  const filteredRatings = ratings.filter(r => r.id !== ratingId);
  
  setItem(STORAGE_KEYS.RATINGS, filteredRatings);
};

export const getRatingById = (ratingId: string): Rating | undefined => {
  const ratings = getRatings();
  return ratings.find(r => r.id === ratingId);
};

export const getRatingsByCopilotId = (copilotId: string): Rating[] => {
  const ratings = getRatings();
  return ratings.filter(r => r.copilotId === copilotId);
};

export const getRatingsByClientId = (clientId: string): Rating[] => {
  const ratings = getRatings();
  return ratings.filter(r => r.clientId === clientId);
};

export const getRatingsByProjectId = (projectId: string): Rating[] => {
  const ratings = getRatings();
  return ratings.filter(r => r.projectId === projectId);
};

// Activity log management
export const getLogs = (): ActivityLog[] => {
  return getItem<ActivityLog[]>(STORAGE_KEYS.LOGS, []);
};

export const createLog = (log: Omit<ActivityLog, 'id' | 'date'>): ActivityLog => {
  const logs = getLogs();
  const newLog = { 
    ...log, 
    id: generateId(), 
    date: new Date().toISOString() 
  };
  
  setItem(STORAGE_KEYS.LOGS, [...logs, newLog]);
  return newLog;
};

export const getLogsByUserId = (userId: string): ActivityLog[] => {
  const logs = getLogs();
  return logs.filter(l => l.userId === userId);
};

// Cart management
export const getCart = (): Cart => {
  return getItem<Cart>(STORAGE_KEYS.CART, { items: [], total: 0 });
};

export const setCart = (cart: Cart): void => {
  setItem(STORAGE_KEYS.CART, cart);
};

export const addToCart = (item: Omit<CartItem, 'id'>): Cart => {
  const cart = getCart();
  const newItem = { ...item, id: generateId() };
  const newCart = { 
    ...cart, 
    items: [...cart.items, newItem],
    total: cart.total + (newItem.price * newItem.quantity)
  };
  
  setItem(STORAGE_KEYS.CART, newCart);
  return newCart;
};

export const removeFromCart = (itemId: string): Cart => {
  const cart = getCart();
  const itemToRemove = cart.items.find(item => item.id === itemId);
  
  if (itemToRemove) {
    const newCart = {
      ...cart,
      items: cart.items.filter(item => item.id !== itemId),
      total: cart.total - (itemToRemove.price * itemToRemove.quantity)
    };
    
    setItem(STORAGE_KEYS.CART, newCart);
    return newCart;
  }
  
  return cart;
};

export const clearCart = (): void => {
  setItem(STORAGE_KEYS.CART, { items: [], total: 0 });
};

// Initialize localStorage with sample data if needed
export const initializeData = (): void => {
  // Check if users are already initialized
  if (getUsers().length === 0) {
    // Add default admin user
    const adminUser: Omit<User, 'id' | 'createdAt'> = {
      name: 'Admin User',
      email: 'admin@aihcopilot.com',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User',
    };
    createUser(adminUser);
    
    // Add sample copilot
    const copilotUser: Omit<User, 'id' | 'createdAt'> = {
      name: 'Sample Copilot',
      email: 'copilot@aihcopilot.com',
      role: 'copilot',
      avatar: 'https://ui-avatars.com/api/?name=Sample+Copilot',
      bio: 'Experienced AI copilot with expertise in automation and integration.',
      specialties: ['CRM', 'Automation', 'API Integration'],
      portfolio: 'https://example.com/portfolio',
      ratings: 4.8,
      projectsCompleted: 34,
      apiKey: generateId()
    };
    createUser(copilotUser);
    
    // Add sample client
    const clientUser: Omit<User, 'id' | 'createdAt'> = {
      name: 'Sample Client',
      email: 'client@example.com',
      role: 'client',
      avatar: 'https://ui-avatars.com/api/?name=Sample+Client',
      company: 'Example Corp',
      sector: 'Technology',
    };
    createUser(clientUser);

    // Add sample jumps
    const jumps: Omit<Jump, 'id' | 'createdAt'>[] = [
      {
        name: 'CRM for Clinics',
        description: 'Complete CRM solution optimized for medical clinics with patient management.',
        category: 'Healthcare',
        type: 'CRM',
        modules: ['Patient Management', 'Appointment Scheduling', 'Billing Integration'],
        basePrice: 2500,
        customizationHours: 10,
        image: '/placeholder.svg',
        visibility: 'all',
        status: 'active',
        suggestedCopilots: [],
      },
      {
        name: 'Legal Document Automation',
        description: 'Automate legal document generation and management for law firms.',
        category: 'Legal',
        type: 'Document Automation',
        modules: ['Template Builder', 'Document Generation', 'Digital Signature'],
        basePrice: 1800,
        customizationHours: 8,
        image: '/placeholder.svg',
        visibility: 'all',
        status: 'active',
        suggestedCopilots: [],
      },
      {
        name: 'E-commerce Analytics',
        description: 'Advanced analytics dashboard for online stores with sales prediction.',
        category: 'Retail',
        type: 'Analytics',
        modules: ['Sales Dashboard', 'Customer Behavior', 'Predictive Analytics'],
        basePrice: 3200,
        customizationHours: 12,
        image: '/placeholder.svg',
        visibility: 'all',
        status: 'active',
        suggestedCopilots: [],
      }
    ];
    
    jumps.forEach(jump => createJump(jump));
  }
};
