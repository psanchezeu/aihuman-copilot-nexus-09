
// Models for our application
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "copilot" | "client";
  avatar?: string;
  createdAt: string;
  phone?: string;
  company?: string;
  sector?: string;
  address?: string;
  paymentMethod?: string;
  commPreferences?: string[];
  bio?: string;
  specialties?: string[];
  portfolio?: string;
  ratings?: number;
  projectsCompleted?: number;
  apiKey?: string;
}

export interface Jump {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  modules: string[];
  basePrice: number;
  customizationHours: number;
  image?: string;
  documentation?: string;
  visibility: "admin" | "copilot" | "client" | "all";
  status: "active" | "inactive";
  suggestedCopilots: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  copilotId: string;
  status: "planned" | "in_progress" | "completed";
  startDate: string;
  estimatedEndDate: string;
  totalPrice: number;
  estimatedHours: number;
  originType: "jump" | "custom";
  jumpId?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  projectId: string;
  copilotId: string;
  status: "pending" | "in_progress" | "completed";
  estimatedHours: number;
  dueDate: string;
  requiresAdminValidation: boolean;
  createdAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  projectId: string;
  concept: string;
  amount: number;
  issueDate: string;
  status: "pending" | "paid" | "overdue";
  paymentMethod: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: "text" | "file" | "system";
  projectId?: string;
  ticketId?: string;
  read: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  clientId: string;
  priority: "low" | "medium" | "high";
  status: "new" | "in_progress" | "resolved";
  createdAt: string;
  assignedAgentId?: string;
}

export interface Rating {
  id: string;
  clientId: string;
  copilotId: string;
  projectId: string;
  score: number;
  comment?: string;
  date: string;
  copilotResponse?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  actionType: string;
  description: string;
  date: string;
  ip?: string;
  browser?: string;
}

export interface CartItem {
  id: string;
  type: "jump" | "hours" | "service";
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  discountCode?: string;
  discountAmount?: number;
}
