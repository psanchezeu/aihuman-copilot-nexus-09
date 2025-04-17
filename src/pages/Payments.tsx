
import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, CreditCard, Download, Eye, Filter, Trash2, X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from "@/lib/storageService";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Invoice } from "@/lib/models";

// Sample invoice data for demonstration
const sampleInvoices = [
  {
    id: "INV-001",
    clientId: "client1",
    projectId: "proj1",
    clientName: "Empresa Tecnológica S.L.",
    concept: "Jump CRM Básico",
    amount: 1200,
    issueDate: "2025-03-15",
    status: "paid",
    paymentMethod: "credit_card",
    createdAt: "2025-03-15"
  },
  {
    id: "INV-002",
    clientId: "client2",
    projectId: "proj2",
    clientName: "Marketing Digital Avanzado",
    concept: "Proyecto Personalizado - Fase 1",
    amount: 3500,
    issueDate: "2025-03-10",
    status: "pending",
    paymentMethod: "transfer",
    createdAt: "2025-03-10"
  },
  {
    id: "INV-003",
    clientId: "client3",
    projectId: "proj3",
    clientName: "Clínica Dental Sonrisa",
    concept: "Jump Gestión Citas",
    amount: 900,
    issueDate: "2025-02-28",
    status: "paid",
    paymentMethod: "credit_card",
    createdAt: "2025-02-28"
  },
  {
    id: "INV-004",
    clientId: "client2",
    projectId: "proj4",
    clientName: "Marketing Digital Avanzado",
    concept: "Horas adicionales - Proyecto CRM",
    amount: 450,
    issueDate: "2025-02-15",
    status: "overdue",
    paymentMethod: "pending",
    createdAt: "2025-02-15"
  },
  {
    id: "INV-005",
    clientId: "client4",
    projectId: "proj5",
    clientName: "Restaurante La Delicia",
    concept: "Jump Sistema de Reservas",
    amount: 1500,
    issueDate: "2025-02-01",
    status: "paid",
    paymentMethod: "credit_card",
    createdAt: "2025-02-01"
  },
];

// Schema for invoice validation
const invoiceSchema = z.object({
  clientName: z.string().min(1, "El nombre del cliente es obligatorio"),
  concept: z.string().min(1, "El concepto es obligatorio"),
  amount: z.coerce.number().min(1, "El importe debe ser mayor a 0"),
  issueDate: z.string().min(1, "La fecha es obligatoria"),
  status: z.enum(["paid", "pending", "overdue"]),
  paymentMethod: z.enum(["credit_card", "transfer", "pending"]),
});

const Payments = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("list");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Initialize the form
  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: "",
      concept: "",
      amount: 0,
      issueDate: new Date().toISOString().slice(0, 10),
      status: "pending",
      paymentMethod: "pending",
    },
  });

  // Update form values when selected invoice changes
  useEffect(() => {
    if (selectedInvoice) {
      form.reset({
        clientName: selectedInvoice.clientName,
        concept: selectedInvoice.concept,
        amount: selectedInvoice.amount,
        issueDate: selectedInvoice.issueDate.slice(0, 10),
        status: selectedInvoice.status as "paid" | "pending" | "overdue",
        paymentMethod: selectedInvoice.paymentMethod as "credit_card" | "transfer" | "pending",
      });
    } else {
      form.reset({
        clientName: "",
        concept: "",
        amount: 0,
        issueDate: new Date().toISOString().slice(0, 10),
        status: "pending",
        paymentMethod: "pending",
      });
    }
  }, [selectedInvoice, form]);

  // Handle form submission
  const onSubmit = (data: z.infer<typeof invoiceSchema>) => {
    if (selectedInvoice) {
      // Update existing invoice
      const updatedInvoice = {
        ...selectedInvoice,
        ...data,
      };
      
      const updatedInvoices = invoices.map(inv => 
        inv.id === selectedInvoice.id ? updatedInvoice : inv
      );
      
      setInvoices(updatedInvoices);
      
      toast({
        title: "Factura actualizada",
        description: `La factura ${selectedInvoice.id} ha sido actualizada correctamente.`
      });
    } else {
      // Create new invoice
      const newInvoice = {
        id: `INV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        clientId: `client${Math.floor(Math.random() * 10)}`,
        projectId: `proj${Math.floor(Math.random() * 10)}`,
        ...data,
        createdAt: new Date().toISOString()
      };
      
      setInvoices([newInvoice, ...invoices]);
      
      toast({
        title: "Factura creada",
        description: `La factura ${newInvoice.id} ha sido creada correctamente.`
      });
    }
    
    setActiveTab("list");
    setSelectedInvoice(null);
  };

  // Handle delete invoice
  const handleDelete = (invoice: any) => {
    const filteredInvoices = invoices.filter(inv => inv.id !== invoice.id);
    setInvoices(filteredInvoices);
    
    toast({
      title: "Factura eliminada",
      description: `La factura ${invoice.id} ha sido eliminada correctamente.`
    });
  };

  // Filter invoices based on search query and status
  const filteredInvoices = invoices.filter(
    (invoice) => {
      const matchesSearch = invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           invoice.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );
  
  // Function to get badge style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pagado</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pendiente</Badge>;
      case "overdue":
        return <Badge variant="destructive">Vencido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Table columns definition
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Factura",
      cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: "clientName",
      header: "Cliente",
    },
    {
      accessorKey: "concept",
      header: "Concepto",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.concept}>
          {row.original.concept}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Importe",
      cell: ({ row }) => (
        <span className="font-medium">${row.original.amount.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "issueDate",
      header: "Fecha",
      cell: ({ row }) => new Date(row.original.issueDate).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              setSelectedInvoice(row.original);
              setActiveTab("edit");
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => toast({
              title: "Función en desarrollo",
              description: `Descargar factura ${row.original.id}`
            })}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Pagos y Facturas</h1>
            <p className="text-muted-foreground">
              {currentUser?.role === "admin" 
                ? "Gestiona todos los pagos y facturas de la plataforma" 
                : "Consulta tus facturas y estado de pagos"}
            </p>
          </div>
          {currentUser?.role === "admin" && (
            <Button onClick={() => {
              setSelectedInvoice(null);
              setActiveTab("create");
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva factura
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Listado de facturas</TabsTrigger>
            <TabsTrigger value="create" disabled={activeTab === 'edit'}>
              Nueva factura
            </TabsTrigger>
            {activeTab === 'edit' && (
              <TabsTrigger value="edit">
                Editar factura
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="list" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total facturado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En {invoices.length} facturas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pendiente de cobro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${invoices
                      .filter(inv => inv.status === "pending" || inv.status === "overdue")
                      .reduce((sum, inv) => sum + inv.amount, 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En {invoices.filter(inv => inv.status === "pending" || inv.status === "overdue").length} facturas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Facturas vencidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ${invoices
                      .filter(inv => inv.status === "overdue")
                      .reduce((sum, inv) => sum + inv.amount, 0)
                      .toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En {invoices.filter(inv => inv.status === "overdue").length} facturas
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Listado de facturas</CardTitle>
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                  <div className="relative md:w-1/2">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por cliente, factura o concepto..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="md:w-1/3">
                    <Select 
                      value={statusFilter} 
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Filtrar por estado" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="paid">Pagados</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="overdue">Vencidos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable 
                  columns={columns} 
                  data={filteredInvoices} 
                  searchKey="clientName"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Nueva factura</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setActiveTab("list")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cliente</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del cliente" {...field} />
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
                            <FormLabel>Importe</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="concept"
                        render={({ field }) => (
                          <FormItem className="col-span-1 md:col-span-2">
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
                        name="issueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de emisión</FormLabel>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="paid">Pagado</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
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
                            <FormLabel>Método de pago</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => setActiveTab("list")}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        Crear factura
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            {selectedInvoice && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Editar factura {selectedInvoice.id}</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setActiveTab("list");
                      setSelectedInvoice(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="clientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cliente</FormLabel>
                              <FormControl>
                                <Input placeholder="Nombre del cliente" {...field} />
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
                              <FormLabel>Importe</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="concept"
                          render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
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
                          name="issueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fecha de emisión</FormLabel>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="paid">Pagado</SelectItem>
                                  <SelectItem value="pending">Pendiente</SelectItem>
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
                              <FormLabel>Método de pago</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between gap-4">
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={() => {
                            handleDelete(selectedInvoice);
                            setActiveTab("list");
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar factura
                        </Button>
                        
                        <div className="flex gap-4">
                          <Button type="button" variant="outline" onClick={() => {
                            setActiveTab("list");
                            setSelectedInvoice(null);
                          }}>
                            Cancelar
                          </Button>
                          <Button type="submit">
                            Guardar cambios
                          </Button>
                        </div>
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
