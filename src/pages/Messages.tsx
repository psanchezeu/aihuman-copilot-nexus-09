
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SendHorizontal, Search, MessageSquare } from 'lucide-react';
import { getUsers, getMessages, createMessage, getCurrentUser } from '@/lib/storageService';
import { User, Message as MessageType } from '@/lib/models';

const Messages = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users and sort them by role
  useEffect(() => {
    if (currentUser) {
      // Get all users except current user
      const allUsers = getUsers().filter(user => user.id !== currentUser.id);
      
      // Sort users by role priority: client/copilot first, then admin
      const sortedUsers = allUsers.sort((a, b) => {
        if (currentUser.role === 'admin') {
          return 0; // No specific sorting for admin
        } else if (currentUser.role === 'copilot') {
          return a.role === 'client' ? -1 : 1; // Clients first for copilots
        } else { // client
          return a.role === 'copilot' ? -1 : 1; // Copilots first for clients
        }
      });
      
      setUsers(sortedUsers);
      
      // Set first user as active by default if no active user
      if (sortedUsers.length > 0 && !activeUser) {
        setActiveUser(sortedUsers[0]);
      }
    }
  }, [currentUser, activeUser]);

  // Fetch messages when active user changes
  useEffect(() => {
    if (currentUser && activeUser) {
      const allMessages = getMessages();
      const conversation = allMessages.filter(msg => 
        (msg.senderId === currentUser.id && msg.receiverId === activeUser.id) || 
        (msg.senderId === activeUser.id && msg.receiverId === currentUser.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      setMessages(conversation);
    }
  }, [currentUser, activeUser]);

  const sendMessage = () => {
    if (newMessage.trim() === '' || !currentUser || !activeUser) return;

    const message: Omit<MessageType, 'id' | 'timestamp'> = {
      senderId: currentUser.id,
      receiverId: activeUser.id,
      content: newMessage.trim(),
      type: 'text',
      read: false
    };

    createMessage(message);
    setNewMessage('');

    // Refresh messages
    const allMessages = getMessages();
    const conversation = allMessages.filter(msg => 
      (msg.senderId === currentUser.id && msg.receiverId === activeUser.id) || 
      (msg.senderId === activeUser.id && msg.receiverId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    setMessages(conversation);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'copilot':
        return 'Copiloto';
      default:
        return 'Cliente';
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Mensajes</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-230px)]">
          {/* Users list */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Conversaciones</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuario..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-330px)]">
                {filteredUsers.length > 0 ? (
                  <div className="space-y-1 p-2">
                    {filteredUsers.map(user => (
                      <button
                        key={user.id}
                        className={`flex items-center w-full p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                          activeUser?.id === user.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                        }`}
                        onClick={() => setActiveUser(user)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3 text-left">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{getUserRole(user.role)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No se encontraron usuarios
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="md:col-span-2 flex flex-col">
            {activeUser ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activeUser.avatar} />
                      <AvatarFallback>
                        {activeUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <CardTitle className="text-lg">{activeUser.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        <Badge variant="outline" className="ml-0 text-xs">
                          {getUserRole(activeUser.role)}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col">
                  <ScrollArea className="flex-1 h-[calc(100vh-430px)] p-4">
                    {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map(message => {
                          const isCurrentUser = message.senderId === currentUser?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                  isCurrentUser
                                    ? 'bg-bloodRed text-white'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs text-right mt-1 opacity-70">
                                  {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          No hay mensajes en esta conversación
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Envía un mensaje para comenzar
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                      className="flex items-center space-x-2"
                    >
                      <Input
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" size="icon">
                        <SendHorizontal className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="h-full flex flex-col items-center justify-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Selecciona una conversación para comenzar
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Messages;
