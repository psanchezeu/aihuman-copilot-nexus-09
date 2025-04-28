
import VisitorLayout from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Clock, CreditCard, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JumpCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  image: string;
  category: string;
}

const Jumps = () => {
  const jumpTypes: JumpCard[] = [
    {
      id: "dental",
      title: "CRM Clínicas Dentales",
      icon: "📅",
      description: "Solución preconfigurada para gestionar pacientes, historiales médicos, citas, presupuestos, recordatorios de revisiones y facturación.",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80",
      category: "Salud"
    },
    {
      id: "mecanica",
      title: "CRM Taller de Mecánica",
      icon: "🚗",
      description: "Sistema de gestión para talleres de reparación de vehículos que permite organizar citas, generar presupuestos y gestionar el stock de repuestos.",
      image: "https://images.unsplash.com/photo-1580891438513-9c5d1b50801a?auto=format&fit=crop&q=80",
      category: "Automoción"
    },
    {
      id: "ropa",
      title: "Tienda Online de Ropa",
      icon: "👕",
      description: "Tienda online especializada en el sector de la moda, diseñada para la venta de ropa, accesorios y complementos.",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80",
      category: "eCommerce"
    },
    {
      id: "ferreteria",
      title: "Tienda Online de Ferretería",
      icon: "💨",
      description: "eCommerce para ferreterías pensado para gestionar amplios catálogos de productos técnicos, ventas a particulares y a empresas.",
      image: "https://images.unsplash.com/photo-1621905252472-943afaa20e20?auto=format&fit=crop&q=80",
      category: "eCommerce"
    },
    {
      id: "asesoria",
      title: "CRM Asesoría Contable y Legal",
      icon: "📄",
      description: "Solución integral de gestión para despachos contables y jurídicos, permitiendo la organización de clientes y control documental.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80",
      category: "Servicios profesionales"
    },
    {
      id: "restaurante",
      title: "Agenda y Reservas para Restaurantes",
      icon: "🍽️",
      description: "Sistema online que permite a restaurantes gestionar de forma eficiente las reservas de mesas y publicar menús digitales.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
      category: "Hostelería"
    },
    {
      id: "deportes",
      title: "App Gestión de Clientes Deportivos",
      icon: "🏋️‍♂️",
      description: "Aplicación dirigida a entrenadores personales y centros deportivos, que permite planificar sesiones de entrenamiento.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
      category: "Deporte"
    },
    {
      id: "alimentacion",
      title: "Tienda Online de Alimentación",
      icon: "🛒",
      description: "Solución de comercio electrónico para negocios de alimentación, con categorías especiales para productos frescos, secos y congelados.",
      image: "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?auto=format&fit=crop&q=80",
      category: "eCommerce"
    },
    {
      id: "autonomos",
      title: "CRM para Autónomos",
      icon: "📃",
      description: "Aplicación diseñada para facilitar la vida de los autónomos: facturación, control de gastos e ingresos, cálculo automático del IVA trimestral.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80",
      category: "Servicios profesionales"
    },
    {
      id: "peluqueria",
      title: "CRM Peluquerías y Centros de Estética",
      icon: "💇‍♀️",
      description: "Plataforma que permite a peluquerías, barberías y centros de estética gestionar reservas de citas y historiales de clientes.",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80",
      category: "Belleza"
    }
  ];

  return (
    <VisitorLayout>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-darkBlack py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              Jumps: Aplicaciones Preconfiguradas
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Soluciones listas para usar que aceleran tu transformación digital y reducen costes hasta en un 90%.
            </p>
          </div>
        </div>
      </section>

      {/* What is a Jump */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex items-center gap-12">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                ¿Qué es un Jump?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                En AI Human Copilot, un Jump es una aplicación preconfigurada diseñada para que las empresas salten directamente a disponer de soluciones profesionales sin necesidad de desarrollos costosos ni largos.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Cada Jump ya incluye toda la estructura técnica necesaria: bases de datos, automatizaciones, paneles, flujos de trabajo... Solo requiere unas pocas horas de personalización para adaptarlo a cada negocio.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Gracias a los Jumps, nuestros clientes pueden ahorrar entre un 80% y un 90% respecto al coste tradicional de crear una aplicación desde cero, obteniendo en tiempo récord una solución completa, moderna y adaptada a su sector.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5 text-bloodRed mr-2" />
                  <span className="text-sm font-medium">Implementación rápida</span>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                  <CreditCard className="h-5 w-5 text-bloodRed mr-2" />
                  <span className="text-sm font-medium">Ahorro de costes</span>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                  <BarChart2 className="h-5 w-5 text-bloodRed mr-2" />
                  <span className="text-sm font-medium">Personalizable</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80" 
                alt="Jump concept visualization" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Jump catalog */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Catálogo de Jumps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explora nuestras soluciones preconfiguradas para diversos sectores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jumpTypes.map(jump => (
              <Card key={jump.id} className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={jump.image} 
                    alt={jump.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">
                      <span className="mr-2">{jump.icon}</span> {jump.title}
                    </CardTitle>
                    <Badge>{jump.category}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {jump.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tiempo implementación:</span>
                      <span className="font-medium">2-4 semanas</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Ahorro vs desarrollo:</span>
                      <span className="font-medium">80-90%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Personalización:</span>
                      <span className="font-medium">Alta</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to={`/login?jumpRequest=${jump.id}`}>
                      Solicitar información
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-bloodRed">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Podemos crear una solución personalizada adaptada exactamente a tus necesidades.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/visitor/custom-proposal">Solicitar propuesta personalizada</Link>
          </Button>
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
                  ¿Cuánto tiempo se tarda en poner en marcha un Jump?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  El tiempo medio de implementación es de 2 a 4 semanas, dependiendo de la complejidad 
                  de la personalización requerida y de la rapidez con la que se facilite la información necesaria.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ¿Puedo personalizar un Jump a mis necesidades específicas?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sí, todos los Jumps son personalizables. El nivel de personalización 
                  dependerá de tus necesidades específicas, y nuestro equipo de Copilotos 
                  te guiará durante todo el proceso.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  ¿Qué sucede si necesito funcionalidades adicionales después de la implementación?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ofrecemos paquetes de horas de desarrollo para añadir funcionalidades adicionales 
                  después de la implementación inicial. Tu Copiloto asignado puede ayudarte a 
                  evaluar las necesidades y proponer la mejor solución.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </VisitorLayout>
  );
};

export default Jumps;
