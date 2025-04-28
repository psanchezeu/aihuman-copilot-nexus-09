
import React from 'react';
import VisitorLayout from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, MessageSquare, Calendar, Code, Layers, BarChart3 } from 'lucide-react';

const CustomProposal = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Solicitud enviada",
      description: "Gracias por tu interés. Nos pondremos en contacto contigo pronto.",
    });
  };

  const services = [
    {
      icon: <Code className="h-8 w-8 text-bloodRed" />,
      title: 'Desarrollo a medida',
      description: 'Soluciones completamente personalizadas para necesidades específicas que no encajan en los Jumps preconfigurados.'
    },
    {
      icon: <Layers className="h-8 w-8 text-bloodRed" />,
      title: 'Integración de sistemas',
      description: 'Conectamos sus sistemas existentes con nuevas soluciones para un flujo de trabajo sin interrupciones.'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-bloodRed" />,
      title: 'Analítica y BI',
      description: 'Transforme sus datos en información accionable con dashboards intuitivos y reportes personalizados.'
    },
    {
      icon: <Calendar className="h-8 w-8 text-bloodRed" />,
      title: 'Consultoría estratégica',
      description: 'Expertos analizan su negocio y proponen soluciones tecnológicas alineadas con sus objetivos.'
    }
  ];

  return (
    <VisitorLayout>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-darkBlack py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              Propuesta Personalizada
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              ¿No encuentras exactamente lo que necesitas? Creamos soluciones a medida.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Cuéntanos tu caso y te ayudaremos a encontrar la mejor solución para tu negocio.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestros servicios personalizados
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Además de nuestros Jumps preconfigurados, ofrecemos servicios adicionales para adaptarnos a tus necesidades específicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="border-0 shadow-md">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 sm:p-10">
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Solicita tu propuesta personalizada
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input id="name" placeholder="Tu nombre" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input id="company" placeholder="Nombre de tu empresa" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email profesional</Label>
                      <Input id="email" type="email" placeholder="tu@empresa.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" placeholder="+34 600 000 000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Salud</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="education">Educación</SelectItem>
                        <SelectItem value="finance">Finanzas</SelectItem>
                        <SelectItem value="manufacturing">Fabricación</SelectItem>
                        <SelectItem value="technology">Tecnología</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_type">¿Qué tipo de proyecto necesitas?</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom_jump">Jump personalizado</SelectItem>
                        <SelectItem value="custom_development">Desarrollo a medida</SelectItem>
                        <SelectItem value="integration">Integración de sistemas</SelectItem>
                        <SelectItem value="analytics">Analítica y BI</SelectItem>
                        <SelectItem value="consulting">Consultoría</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Cuéntanos sobre tu proyecto</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Describe brevemente tu necesidad o proyecto..."
                      rows={5}
                      required 
                    />
                  </div>

                  <div className="flex items-start">
                    <Checkbox id="terms" className="mt-1" />
                    <Label 
                      htmlFor="terms" 
                      className="ml-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      He leído y acepto la política de privacidad y términos de servicio
                    </Label>
                  </div>

                  <Button type="submit" className="w-full">
                    Enviar solicitud
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact alternatives */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                También puedes contactarnos directamente:
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-5 w-5" /> Chat en vivo
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  asChild
                >
                  <a href="tel:+34900123456">
                    <Calendar className="h-5 w-5" /> Agendar una llamada
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Preguntas frecuentes
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ¿Cómo es el proceso de creación de una solución personalizada?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  El proceso comienza con una consulta inicial para entender tus necesidades. Luego, creamos
                  una propuesta detallada con alcance, tiempo y presupuesto. Una vez aprobada, asignamos un
                  equipo dedicado liderado por un Copiloto que te guiará durante todo el desarrollo.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ¿Cuánto tiempo lleva desarrollar una solución a medida?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Los tiempos varían según la complejidad del proyecto. Las soluciones basadas en Jumps 
                  personalizados pueden estar listas en 2-6 semanas. Los desarrollos completamente a medida 
                  pueden llevar entre 2-6 meses. Tu Copiloto te proporcionará plazos precisos tras la consulta inicial.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ¿Es posible integrar las soluciones con nuestros sistemas actuales?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sí, diseñamos todas nuestras soluciones pensando en la integración. Podemos conectar con la
                  mayoría de los sistemas empresariales comunes mediante APIs y middleware especializado. Durante
                  la fase de consultoría evaluaremos tus sistemas actuales para garantizar una integración fluida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </VisitorLayout>
  );
};

export default CustomProposal;
