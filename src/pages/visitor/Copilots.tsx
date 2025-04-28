
import VisitorLayout from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight, Users, Cpu, Shield, Clock, Award, BookOpen } from 'lucide-react';

const Copilots = () => {
  const featuredCopilots = [
    {
      id: 1,
      name: "Laura Sánchez",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Lead Copilot",
      expertise: ["CRM Dentales", "Gestión Clínica", "Automatización"],
      rating: 4.9,
      projects: 34
    },
    {
      id: 2,
      name: "Carlos Martínez",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Technical Copilot",
      expertise: ["eCommerce", "Tiendas online", "Integraciones APIs"],
      rating: 4.8,
      projects: 29
    },
    {
      id: 3,
      name: "Ana Gómez",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      role: "Business Copilot",
      expertise: ["Consultoría", "Procesos", "Automatización"],
      rating: 4.9,
      projects: 41
    },
    {
      id: 4,
      name: "Javier López",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      role: "Data Copilot",
      expertise: ["Analítica", "Dashboards", "Big Data"],
      rating: 4.7,
      projects: 26
    }
  ];

  const benefits = [
    {
      icon: <Shield className="h-6 w-6 text-bloodRed" />,
      title: "Supervisión Legal",
      description: "Cumplimiento estricto de normativas como GDPR."
    },
    {
      icon: <Clock className="h-6 w-6 text-bloodRed" />,
      title: "Agilidad de Implementación",
      description: "Saltos de semanas o meses en cuestión de días."
    },
    {
      icon: <Users className="h-6 w-6 text-bloodRed" />,
      title: "Asistencia Humana",
      description: "Siempre tendrás a una persona real disponible."
    },
    {
      icon: <Award className="h-6 w-6 text-bloodRed" />,
      title: "Precisión Estratégica",
      description: "Las soluciones no se improvisan, se diseñan a medida."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-bloodRed" />,
      title: "Formación continua",
      description: "Tu equipo aprenderá a sacar el máximo partido a las soluciones."
    },
    {
      icon: <Cpu className="h-6 w-6 text-bloodRed" />,
      title: "Aumento de Productividad",
      description: "Más trabajo hecho en menos tiempo, con menos recursos."
    }
  ];

  return (
    <VisitorLayout>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-darkBlack py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
              Copilotos: El factor humano tras la tecnología
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Expertos que impulsan tu transformación digital y garantizan el éxito de tu proyecto.
            </p>
          </div>
        </div>
      </section>

      {/* What is a Copilot */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
                alt="Team of copilots collaborating" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                ¿Qué es un Copiloto de AI Human Copilot?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                En AI Human Copilot, el Copiloto es mucho más que un operador de inteligencia artificial.
                Es tu guía personal, tu aliado estratégico y tu responsable humano en la implementación
                de soluciones inteligentes para tu negocio.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Mientras la IA impulsa las tareas diarias como un potente motor, el Copiloto es quien
                sostiene el timón, asegurándose de que cada acción esté adaptada a tus objetivos, a la
                realidad de tu empresa y a las normativas legales y éticas vigentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What do our copilots do */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 ¿Qué hacen nuestros Copilotos?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Detectan necesidades
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Detectan las necesidades reales de tu negocio, incluso las que tú aún no ves.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Adaptan soluciones
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Adaptan y personalizan los Jumps (aplicaciones preconfiguradas) para que encajen al 100% contigo.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Supervisan automatizaciones
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Supervisan cada automatización, asegurando un uso responsable, legal y orientado a resultados.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Acompañan equipos
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Acompañan a tu equipo durante todo el proceso, facilitando la integración de la tecnología de forma humana y cercana.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Optimizan procesos
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Optimizan continuamente los flujos y herramientas para mejorar tu productividad y tus beneficios.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Garantizan resultados
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Aseguran que las implementaciones tecnológicas se traduzcan en resultados concretos para tu negocio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why do you need a Copilot */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
              🛡️ ¿Por qué necesitas un Copiloto?
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
              Porque la IA, por sí sola, no entiende tus emociones, tu cultura empresarial, ni tu visión de futuro.
              Un Copiloto sí.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bloodRed flex items-center justify-center text-white font-bold mr-3">
                  ✓
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Evitas errores costosos</span> y automatizaciones mal configuradas.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bloodRed flex items-center justify-center text-white font-bold mr-3">
                  ✓
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Garantizas que tus datos estén protegidos</span> y tus procesos cumplan las leyes.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bloodRed flex items-center justify-center text-white font-bold mr-3">
                  ✓
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Disfrutas de una adaptación rápida y natural</span> a las nuevas tecnologías.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-bloodRed flex items-center justify-center text-white font-bold mr-3">
                  ✓
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Aumentas tu eficiencia, ahorras dinero</span> y ganas tranquilidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured copilots */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Conoce a nuestros Copilotos
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Expertos en tecnología y negocio que te acompañarán en todo el proceso
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCopilots.map(copilot => (
              <Card key={copilot.id} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                      <img 
                        src={copilot.avatar} 
                        alt={copilot.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-xl text-center">{copilot.name}</h3>
                    <p className="text-sm text-muted-foreground text-center">{copilot.role}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 font-medium">{copilot.rating}</span>
                      <span className="mx-1 text-gray-400">•</span>
                      <span>{copilot.projects} proyectos</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {copilot.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/login">Ver perfil completo</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🔥 Beneficios de contar con un Copiloto
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="bg-bloodRed/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-bloodRed">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Listo para tener tu Copiloto?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Empieza hoy mismo y descubre cómo un Copiloto puede transformar tu negocio.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">
              Comienza ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </VisitorLayout>
  );
};

export default Copilots;
