
import { 
  User, 
  Jump, 
  Project, 
  Task, 
  Invoice, 
  Message, 
  Ticket, 
  Rating, 
  ActivityLog 
} from './models';

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getJumps,
  getJumpById,
  createJump,
  updateJump,
  deleteJump,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByClientId,
  getProjectsByCopilotId,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByProjectId,
  getMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  getConversation,
} from './storageService';

// User related functions with data integrity checks
export const getAllUsers = () => getUsers();
export const getUserByIdSafe = (id: string) => getUserById(id);
export const getAllClients = () => getUsers().filter(u => u.role === 'client');
export const getAllCopilots = () => getUsers().filter(u => u.role === 'copilot');
export const getAllAdmins = () => getUsers().filter(u => u.role === 'admin');

export const deleteUserSafe = (userId: string) => {
  // Check if user is associated with any projects
  const associatedProjects = getProjects().filter(
    p => p.clientId === userId || p.copilotId === userId
  );
  
  if (associatedProjects.length > 0) {
    throw new Error("No se puede eliminar el usuario porque está asociado a proyectos existentes");
  }
  
  // Check if user is associated with any tasks
  const associatedTasks = getTasks().filter(t => t.copilotId === userId);
  if (associatedTasks.length > 0) {
    throw new Error("No se puede eliminar el usuario porque está asociado a tareas existentes");
  }
  
  return deleteUser(userId);
};

// Jump related functions with data integrity
export const getAllJumps = () => getJumps();
export const getJumpByIdSafe = (id: string) => getJumpById(id);

export const deleteJumpSafe = (jumpId: string) => {
  // Check if jump is used in any projects
  const associatedProjects = getProjects().filter(p => p.jumpId === jumpId);
  if (associatedProjects.length > 0) {
    throw new Error("No se puede eliminar el jump porque está asociado a proyectos existentes");
  }
  
  return deleteJump(jumpId);
};

// Project related functions with data integrity
export const getAllProjects = () => getProjects();
export const getProjectByIdSafe = (id: string) => getProjectById(id);
export const getProjectsForClient = (clientId: string) => getProjectsByClientId(clientId);
export const getProjectsForCopilot = (copilotId: string) => getProjectsByCopilotId(copilotId);

export const createProjectSafe = (project: Omit<Project, 'id' | 'createdAt'>) => {
  // Validate client exists
  const client = getUserById(project.clientId);
  if (!client || client.role !== 'client') {
    throw new Error("El cliente especificado no existe o no es válido");
  }
  
  // Validate copilot exists
  const copilot = getUserById(project.copilotId);
  if (!copilot || copilot.role !== 'copilot') {
    throw new Error("El copiloto especificado no existe o no es válido");
  }
  
  // If project is based on a jump, validate jump exists
  if (project.originType === 'jump' && project.jumpId) {
    const jump = getJumpById(project.jumpId);
    if (!jump) {
      throw new Error("El jump especificado no existe");
    }
  }
  
  return createProject(project);
};

export const updateProjectSafe = (project: Project) => {
  // Validate client exists
  const client = getUserById(project.clientId);
  if (!client || client.role !== 'client') {
    throw new Error("El cliente especificado no existe o no es válido");
  }
  
  // Validate copilot exists
  const copilot = getUserById(project.copilotId);
  if (!copilot || copilot.role !== 'copilot') {
    throw new Error("El copiloto especificado no existe o no es válido");
  }
  
  // If project is based on a jump, validate jump exists
  if (project.originType === 'jump' && project.jumpId) {
    const jump = getJumpById(project.jumpId);
    if (!jump) {
      throw new Error("El jump especificado no existe");
    }
  }
  
  return updateProject(project);
};

export const deleteProjectSafe = (projectId: string) => {
  // Check if project has associated tasks
  const associatedTasks = getTasks().filter(t => t.projectId === projectId);
  if (associatedTasks.length > 0) {
    // Option 1: Delete all associated tasks
    associatedTasks.forEach(task => deleteTask(task.id));
  }
  
  return deleteProject(projectId);
};

// Task related functions
export const getAllTasks = () => getTasks();
export const getTaskByIdSafe = (id: string) => getTaskById(id);
export const getTasksForProject = (projectId: string) => getTasksByProjectId(projectId);

export const createTaskSafe = (task: Omit<Task, 'id' | 'createdAt'>) => {
  // Validate project exists
  const project = getProjectById(task.projectId);
  if (!project) {
    throw new Error("El proyecto especificado no existe");
  }
  
  // Validate copilot exists and is assigned to the project
  const copilot = getUserById(task.copilotId);
  if (!copilot || copilot.role !== 'copilot') {
    throw new Error("El copiloto especificado no existe o no es válido");
  }
  
  if (project.copilotId !== task.copilotId) {
    throw new Error("El copiloto especificado no está asignado a este proyecto");
  }
  
  return createTask(task);
};

export const updateTaskSafe = (task: Task) => {
  // Validate project exists
  const project = getProjectById(task.projectId);
  if (!project) {
    throw new Error("El proyecto especificado no existe");
  }
  
  // Validate copilot exists and is assigned to the project
  const copilot = getUserById(task.copilotId);
  if (!copilot || copilot.role !== 'copilot') {
    throw new Error("El copiloto especificado no existe o no es válido");
  }
  
  return updateTask(task);
};

// Message related functions
export const getAllMessages = () => getMessages();
export const getMessageByIdSafe = (id: string) => getMessageById(id);
export const getConversationBetweenUsers = (user1Id: string, user2Id: string) => getConversation(user1Id, user2Id);

export const createMessageSafe = (message: Omit<Message, 'id' | 'timestamp'>) => {
  // Validate sender exists
  const sender = getUserById(message.senderId);
  if (!sender) {
    throw new Error("El remitente especificado no existe");
  }
  
  // Validate receiver exists
  const receiver = getUserById(message.receiverId);
  if (!receiver) {
    throw new Error("El destinatario especificado no existe");
  }
  
  // If message is related to a project, validate project exists
  if (message.projectId) {
    const project = getProjectById(message.projectId);
    if (!project) {
      throw new Error("El proyecto especificado no existe");
    }
    
    // Verify that sender and receiver are involved in the project
    if (project.clientId !== message.senderId && 
        project.clientId !== message.receiverId && 
        project.copilotId !== message.senderId && 
        project.copilotId !== message.receiverId) {
      throw new Error("El remitente o destinatario no están asociados a este proyecto");
    }
  }
  
  return createMessage(message);
};

// Enhanced data loading for comprehensive views
export const getProjectWithDetails = (projectId: string) => {
  const project = getProjectById(projectId);
  if (!project) return null;
  
  const client = getUserById(project.clientId);
  const copilot = getUserById(project.copilotId);
  const jump = project.jumpId ? getJumpById(project.jumpId) : null;
  const tasks = getTasksByProjectId(projectId);
  
  return {
    ...project,
    client,
    copilot,
    jump,
    tasks
  };
};

export const getUserWithProjects = (userId: string) => {
  const user = getUserById(userId);
  if (!user) return null;
  
  let projects;
  if (user.role === 'client') {
    projects = getProjectsByClientId(userId);
  } else if (user.role === 'copilot') {
    projects = getProjectsByCopilotId(userId);
  } else {
    projects = []; // Admin doesn't have directly assigned projects
  }
  
  return {
    ...user,
    projects
  };
};

export const getJumpWithDetails = (jumpId: string) => {
  const jump = getJumpById(jumpId);
  if (!jump) return null;
  
  const projects = getProjects().filter(p => p.jumpId === jumpId);
  const suggestedCopilots = jump.suggestedCopilots
    ? jump.suggestedCopilots.map(id => getUserById(id)).filter(Boolean)
    : [];
  
  return {
    ...jump,
    projects,
    suggestedCopilots
  };
};
