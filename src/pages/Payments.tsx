
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
import { Search, CreditCard, Download, Eye, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

const Payments = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
            onClick={() => toast({
              title: "Función en desarrollo",
              description: `Ver factura ${row.original.id}`
            })}
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
            <Button onClick={() => toast({
              title: "Función en desarrollo",
              description: "Registrar nuevo pago"
            })}>
              <CreditCard className="mr-2 h-4 w-4" />
              Registrar pago
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      </div>
    </AppLayout>
  );
};

export default Payments;
