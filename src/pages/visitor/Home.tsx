
import VisitorLayout from '@/components/layout/VisitorLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Cpu, HeartHandshake, BarChart3 } from 'lucide-react';

const Home = () => {
  return (
    <VisitorLayout>
      {/* Hero section */}
      <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-darkBlack">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
              <span className="block">AI + Humano:</span>
              <span className="block text-bloodRed">El equilibrio perfecto</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Impulsamos empresas con la potencia de la IA supervisada por expertos humanos. 
              Automatizaciones profesionales sin perder el control humano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/visitor/jumps">
                  Explorar Jumps
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/visitor/copilots">Conocer Copilotos</Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
              alt="AI Human Copilot" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              ¿Cómo funciona AI Human Copilot?
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Combinamos tecnología avanzada con supervisión humana para garantizar 
              resultados excepcionales para tu empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="bg-bloodRed/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-bloodRed" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Tecnología avanzada
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Utilizamos IA y automatización de última generación para optimizar procesos complejos y repetitivos.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="bg-bloodRed/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <HeartHandshake className="h-6 w-6 text-bloodRed" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Supervisión humana
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Copilotos expertos que garantizan resultados precisos, seguros y adaptados a tus necesidades.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="bg-bloodRed/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-bloodRed" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Implementación rápida
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Jumps preconfigurados que reducen meses de desarrollo a días de personalización.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="bg-bloodRed/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-bloodRed" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Resultados medibles
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Métricas claras que demuestran el impacto real en tu productividad y rentabilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Lo que dicen nuestros clientes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Cliente" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Laura Martínez</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Directora, Clínica Dental Sonrisa</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Implementamos el CRM para clínicas dentales y ha transformado nuestra gestión. 
                El ahorro de tiempo es impresionante y nuestros pacientes valoran mucho la mejora en comunicación."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="Cliente" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Carlos Rodríguez</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Propietario, Taller Mecánico CR</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "El Jump para talleres mecánicos nos ha ahorrado horas de trabajo administrativo cada día.
                Nuestro Copiloto entendió perfectamente las necesidades específicas de nuestro taller."
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                  <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Cliente" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Ana Gómez</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">CEO, Boutique Elegance</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Nuestra tienda online de ropa ha multiplicado las ventas desde que implementamos el Jump.
                La personalización que nos ofreció nuestro Copiloto fue clave para adaptarlo a nuestra marca."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Beneficios para tu empresa
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Al combinar la potencia de la IA con la supervisión humana, ofrecemos ventajas únicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Ahorro de tiempo y recursos</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Automatiza tareas repetitivas para que tu equipo se concentre en lo que realmente importa.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Reducción de errores</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  La supervisión humana garantiza la precisión en cada proceso automatizado.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Escalabilidad</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Adapta las soluciones a medida que tu empresa crece sin necesidad de grandes inversiones.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Ventaja competitiva</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Accede a tecnología avanzada que normalmente solo está al alcance de grandes corporaciones.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Mejora en la experiencia del cliente</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Ofrece respuestas más rápidas y personalizadas a tus clientes.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Control total</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Mantén siempre la supervisión humana sobre los procesos automatizados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-bloodRed">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Comienza hoy mismo con una propuesta personalizada o explora nuestros Jumps preconfigurados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/visitor/custom-proposal">Solicitar propuesta personalizada</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link to="/register">Registrarse ahora</Link>
            </Button>
          </div>
        </div>
      </section>
    </VisitorLayout>
  );
};

export default Home;
