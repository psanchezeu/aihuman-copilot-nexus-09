
import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { DataTable } from '@/components/ui/data-table';
import { useAuth } from '@/contexts/AuthContext';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice, getUserById } from '@/lib/storageService';
import { Invoice } from '@/lib/models';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, Download, Filter, Plus, Trash } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';

// Extended Invoice type with clientName
interface ExtendedInvoice extends Invoice {
  clientName: string;
}

// Form schema
const invoiceSchema = z.object({
  concept: z.string().min(1, "El concepto es requerido"),
  amount: z.number().min(1, "El monto debe ser mayor a 0"),
  issueDate: z.string().min(1, "La fecha es requerida"),
  status: z.enum(["pending", "paid", "overdue"]),
  paymentMethod: z.string().min(1, "El método de pago es requerido"),
  clientId: z.string().min(1, "El cliente es requerido"),
  projectId: z.string().min(1, "El proyecto es requerido"),
});

const Payments = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [invoices, setInvoices] = useState<ExtendedInvoice[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingInvoice, setEditingInvoice] = useState<ExtendedInvoice | null>(null);

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      concept: "",
      amount: 0,
      issueDate: new Date().toISOString().split("T")[0],
      status: "pending",
      paymentMethod: "credit_card",
      clientId: "",
      projectId: "",
    },
  });

  useEffect(() => {
    loadInvoices();
  }, [currentUser, filterStatus, searchTerm]);

  useEffect(() => {
    if (editingInvoice) {
      form.reset({
        concept: editingInvoice.concept,
        amount: editingInvoice.amount,
        issueDate: new Date(editingInvoice.issueDate).toISOString().split("T")[0],
        status: editingInvoice.status as "pending" | "paid" | "overdue",
        paymentMethod: editingInvoice.paymentMethod,
        clientId: editingInvoice.clientId,
        projectId: editingInvoice.projectId,
      });
    } else {
      form.reset({
        concept: "",
        amount: 0,
        issueDate: new Date().toISOString().split("T")[0],
        status: "pending",
        paymentMethod: "credit_card",
        clientId: "",
        projectId: "",
      });
    }
  }, [editingInvoice, form]);

  const loadInvoices = () => {
    // Get the raw invoices from storage
    const rawInvoices = getInvoices();
    
    // Map the invoices to include clientName
    const extendedInvoices: ExtendedInvoice[] = rawInvoices.map(invoice => {
      const client = getUserById(invoice.clientId);
      return {
        ...invoice,
        clientName: client?.name || 'Cliente desconocido'
      };
    });

    // Apply filters
    let filtered = [...extendedInvoices];
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(inv => inv.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(inv => 
        inv.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setInvoices(filtered);
  };

  const handleCreateInvoice = (data: z.infer<typeof invoiceSchema>) => {
    try {
      const newInvoice = createInvoice({
        ...data,
        amount: Number(data.amount),
      });
      
      const client = getUserById(newInvoice.clientId);
      const extendedInvoice: ExtendedInvoice = {
        ...newInvoice,
        clientName: client?.name || 'Cliente desconocido'
      };
      
      setInvoices(prev => [...prev, extendedInvoice]);
      
      toast({
        title: "Factura creada",
        description: "La factura fue creada exitosamente",
      });
      
      setActiveTab("list");
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear la factura",
        variant: "destructive",
      });
    }
  };

  const handleUpdateInvoice = (data: z.infer<typeof invoiceSchema>) => {
    if (!editingInvoice) return;
    
    try {
      const updatedInvoice = updateInvoice({
        ...editingInvoice,
        ...data,
        amount: Number(data.amount),
      });
      
      const client = getUserById(updatedInvoice.clientId);
      const extendedInvoice: ExtendedInvoice = {
        ...updatedInvoice,
        clientName: client?.name || 'Cliente desconocido'
      };
      
      setInvoices(prev => 
        prev.map(inv => inv.id === extendedInvoice.id ? extendedInvoice : inv)
      );
      
      toast({
        title: "Factura actualizada",
        description: "La factura fue actualizada exitosamente",
      });
      
      setEditingInvoice(null);
      setActiveTab("list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la factura",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvoice = (id: string) => {
    try {
      deleteInvoice(id);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      
      toast({
        title: "Factura eliminada",
        description: "La factura fue eliminada exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la factura",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<ExtendedInvoice>[] = [
    {
      accessorKey: "concept",
      header: "Concepto",
    },
    {
      accessorKey: "clientName",
      header: "Cliente",
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
        }).format(amount);
        return formatted;
      },
    },
    {
      accessorKey: "issueDate",
      header: "Fecha",
      cell: ({ row }) => {
        return new Date(row.getValue("issueDate")).toLocaleDateString("es-ES");
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                status === "paid" 
                  ? "bg-green-500" 
                  : status === "pending" 
                  ? "bg-yellow-500" 
                  : "bg-red-500"
              }`}
            />
            {status === "paid" 
              ? "Pagado" 
              : status === "pending" 
              ? "Pendiente" 
              : "Vencido"}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEditingInvoice(invoice);
                setActiveTab("edit");
              }}
            >
              Editar
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDeleteInvoice(invoice.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Pagos</h1>
            <p className="text-muted-foreground">
              Gestiona las facturas y pagos de tu plataforma
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Lista de Facturas</TabsTrigger>
            <TabsTrigger value="create">Crear Nueva Factura</TabsTrigger>
            {editingInvoice && <TabsTrigger value="edit">Editar Factura</TabsTrigger>}
          </TabsList>
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Facturas</CardTitle>
                <CardDescription>
                  Lista de todas las facturas en el sistema
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Buscar por concepto o cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px] gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="paid">Pagado</SelectItem>
                        <SelectItem value="overdue">Vencido</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                    <Button onClick={() => setActiveTab("create")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={invoices}
                  searchKey="concept"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Crear Nueva Factura</CardTitle>
                <CardDescription>
                  Completa el formulario para crear una nueva factura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateInvoice)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="concept"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Concepto</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Descripción de la factura" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00" 
                                {...field} 
                                onChange={e => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="issueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de Emisión</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="paid">Pagado</SelectItem>
                                <SelectItem value="overdue">Vencido</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Método de Pago</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar método" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                                <SelectItem value="transfer">Transferencia</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cliente</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="client1">Cliente Demo</SelectItem>
                                <SelectItem value="client2">Cliente Ejemplo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="projectId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proyecto</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar proyecto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="project1">Proyecto Demo</SelectItem>
                                <SelectItem value="project2">Proyecto Ejemplo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("list")}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">
                        Crear Factura
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit">
            {editingInvoice && (
              <Card>
                <CardHeader>
                  <CardTitle>Editar Factura</CardTitle>
                  <CardDescription>
                    Modifica los detalles de la factura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateInvoice)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="concept"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Concepto</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monto</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="issueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de Emisión</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pending">Pendiente</SelectItem>
                                  <SelectItem value="paid">Pagado</SelectItem>
                                  <SelectItem value="overdue">Vencido</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Método de Pago</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar método" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                                  <SelectItem value="transfer">Transferencia</SelectItem>
                                  <SelectItem value="pending">Pendiente</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="clientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cliente</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar cliente" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="client1">Cliente Demo</SelectItem>
                                  <SelectItem value="client2">Cliente Ejemplo</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="projectId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proyecto</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar proyecto" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="project1">Proyecto Demo</SelectItem>
                                  <SelectItem value="project2">Proyecto Ejemplo</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setEditingInvoice(null);
                            setActiveTab("list");
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={() => {
                            if (editingInvoice) {
                              handleDeleteInvoice(editingInvoice.id);
                              setEditingInvoice(null);
                              setActiveTab("list");
                            }
                          }}
                        >
                          Eliminar
                        </Button>
                        <Button type="submit">
                          Actualizar
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Payments;
