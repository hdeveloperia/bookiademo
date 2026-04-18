import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, CheckCircle2, Bot, Clock, CalendarDays, Users, MessageSquare, Share2, Layout, Sparkles, Globe, X, Database, Lock, UtensilsCrossed, Scissors, Activity, PawPrint, Stethoscope, Heart } from 'lucide-react';

const businessTypes = [
  { id: 'restaurante', label: 'Restaurante',      emoji: '🍽️', Icon: UtensilsCrossed },
  { id: 'dental',      label: 'Clínica Dental',   emoji: '🦷', Icon: Stethoscope },
  { id: 'peluqueria',  label: 'Peluquería',       emoji: '✂️', Icon: Scissors },
  { id: 'estetica',    label: 'Clínica Estética', emoji: '💫', Icon: Heart },
  { id: 'veterinaria', label: 'Veterinaria',      emoji: '🐾', Icon: PawPrint },
  { id: 'fisioterapia',label: 'Fisioterapia',     emoji: '💪', Icon: Activity },
];

const demoFlows = {
  restaurante: {
    agentName: 'Bookia — Restaurante',
    steps: [
      { botMessage: "¡Hola! 👋 Soy el asistente virtual de tu restaurante. ¿Para qué día quieres hacer tu reserva?", options: ["Hoy", "Mañana", "Este fin de semana"], benefitText: "Respuesta inmediata 24/7. El cliente no espera al teléfono ni a que alguien conteste un email." },
      { botMessage: "Perfecto. ¿A qué hora preferís venir?", options: ["20:00h", "21:00h", "21:30h"], benefitText: "El bot consulta la disponibilidad real en tiempo real. Cero overbooking. Cero errores humanos." },
      { botMessage: "¿Cuántas personas seréis?", options: ["2 personas", "4 personas", "6 personas", "Grupo +8"], benefitText: "Asigna automáticamente la mesa adecuada según el tamaño y tu configuración de sala." },
      { botMessage: "¿Tenéis alguna preferencia de ubicación?", options: ["Terraza ☀️", "Interior", "Sin preferencia"], benefitText: "El cliente siente atención personalizada. Sin hacer nada extra por tu parte." },
      { botMessage: "¿Hay alguna alergia o celebración especial que debamos tener en cuenta?", options: ["Sin alergias", "Celíaco / Gluten", "Vegetariano / Vegano", "Cumpleaños 🎂"], benefitText: "El bot recopila información clave para que tu equipo esté preparado y el servicio sea impecable." },
      { botMessage: "¡Todo listo! Tu reserva está confirmada ✔️\n\n📅 Mañana · 21:00h · 4 personas · Terraza\n\nRecibirás confirmación por WhatsApp en instantes.", options: [], benefitText: "Reserva cerrada en menos de 60 segundos. El local no ha hecho absolutamente nada." },
      { botMessage: "Por cierto, ¿quieres recibir nuestra carta digital para ir abriendo boca? 😋", options: ["¡Sí, envíame la carta!", "No, gracias"], benefitText: "Upsell automático post-reserva. El bot puede enviar la carta, el menú del día o una oferta especial sin que tú lo gestiones." }
    ]
  },
  dental: {
    agentName: 'Bookia — Clínica Dental',
    steps: [
      { botMessage: "¡Hola! Soy el asistente de la clínica. ¿Qué tipo de consulta necesitas? 🦷", options: ["Revisión anual", "Limpieza dental", "Urgencia / Dolor", "Estética dental"], benefitText: "El bot filtra y clasifica el tipo de consulta antes de agendar, optimizando la agenda del dentista." },
      { botMessage: "¿Eres paciente nuevo o ya tienes historial en nuestra clínica?", options: ["Soy paciente nuevo", "Ya soy paciente"], benefitText: "Diferencia nuevos pacientes de existentes para preparar el expediente antes de la cita." },
      { botMessage: "¿Tienes alguna molestia o síntoma en este momento?", options: ["Sin molestias", "Dolor o sensibilidad", "Encías inflamadas", "Diente roto / fracturado"], benefitText: "El bot hace de triaje clínico, priorizando urgencias y reduciendo la carga del equipo en recepción." },
      { botMessage: "¿Qué día te viene mejor para la cita?", options: ["Esta semana", "La próxima semana", "Necesito cita urgente hoy"], benefitText: "Gestión de prioridades automática. Las urgencias se señalan para atención inmediata." },
      { botMessage: "¿Prefieres turno de mañana o de tarde?", options: ["Mañana (9-14h)", "Tarde (15-20h)"], benefitText: "El bot completa la información necesaria para asignar el hueco correcto sin intervención humana." },
      { botMessage: "¡Cita registrada! ✔️\n\nEl Dr. García te contactará para confirmar el horario exacto. Recibirás un recordatorio 24h antes por WhatsApp.", options: [], benefitText: "Confirmación instantánea y recordatorio automático. Reducción del 80% de las citas no asistidas." },
      { botMessage: "¿Te gustaría recibir información sobre nuestros tratamientos de estética dental? ✨ (Blanqueamiento, carillas, ortodoncia invisible...)", options: ["Sí, me interesa", "No, por ahora no"], benefitText: "Generación automática de interés en servicios de mayor ticket. El bot trabaja como tu mejor comercial." }
    ]
  },
  peluqueria: {
    agentName: 'Bookia — Peluquería',
    steps: [
      { botMessage: "¡Hola! 💇 Bienvenido/a. ¿Qué servicio estás buscando hoy?", options: ["Corte de pelo", "Color / Mechas", "Tratamiento capilar", "Manicura / Pedicura"], benefitText: "El cliente elige su servicio de forma guiada. Sin esperas ni llamadas perdidas en el salón." },
      { botMessage: "¡Genial! ¿Tienes preferencia por algún estilista?", options: ["Ana ⭐ (disponible)", "Marcos ⭐ (disponible)", "Sin preferencia"], benefitText: "Los clientes fidelizados siempre reservan con su estilista favorito. Fidelización automática." },
      { botMessage: "¿Buscas un cambio de look o es un retoque de mantenimiento?", options: ["Cambio de look 🔥", "Retoque / mantenimiento", "Quiero asesoramiento"], benefitText: "El bot recaba contexto que el estilista necesita para preparar la sesión con antelación." },
      { botMessage: "¿Qué día prefieres para tu cita?", options: ["Martes", "Miércoles", "Jueves", "Viernes"], benefitText: "El bot muestra solo días con disponibilidad real, evitando huecos imposibles." },
      { botMessage: "¿A qué hora te va mejor?", options: ["10:00h", "12:00h", "17:00h", "19:00h"], benefitText: "Cada respuesta se sincroniza con la agenda del salón. Sin doble reserva. Nunca." },
      { botMessage: "¡Reserva confirmada! 💇‍♀️✔️\n\nJueves · 17:00h · Color/Mechas con Ana\n\n¡Te esperamos con muchas ganas!", options: [], benefitText: "Confirmación profesional e instantánea. El cliente ya se siente atendido antes de llegar." },
      { botMessage: "¿Quieres ver nuestros últimos trabajos en Instagram antes de venir? ✨", options: ["¡Sí, quiero ver! 🔗", "No, ya os conozco 😊"], benefitText: "Redirección automática a RRSS. Aumenta seguidores y genera expectativa antes de la visita." }
    ]
  },
  estetica: {
    agentName: 'Bookia — Clínica Estética',
    steps: [
      { botMessage: "¡Hola! ✨ Bienvenida/o a nuestra clínica. ¿Qué tratamiento te interesa?", options: ["Botox / Relleno", "Depilación láser", "HydraFacial", "Mesoterapia facial", "Consulta general"], benefitText: "Clasificación automática del tipo de tratamiento. El especialista ya sabe qué esperar antes de la consulta." },
      { botMessage: "¿Es tu primera visita a nuestra clínica?", options: ["Sí, es mi primera vez", "Ya soy cliente/a"], benefitText: "Flujo diferenciado para nuevos y existentes. Los nuevos reciben más información, los habituales agendan más rápido." },
      { botMessage: "¿Te gustaría empezar con una consulta gratuita sin compromiso para valorar tu caso? 💆", options: ["Sí, quiero consulta gratuita ✅", "No, ya sé lo que quiero"], benefitText: "Captación de leads de alto valor. La consulta gratuita es el gancho perfecto para convertir indecisos." },
      { botMessage: "¿Para qué fecha te viene bien la cita?", options: ["Esta semana", "La próxima semana", "Dentro de 2 semanas"], benefitText: "Gestión de agenda a futuro sin intervención del equipo. La clínica llena su calendario sola." },
      { botMessage: "¿Prefieres turno de mañana o tarde?", options: ["Mañana (9-14h)", "Tarde (15-19h)"], benefitText: "Optimización de la agenda por franjas horarias. Menos huecos vacíos, más productividad diaria." },
      { botMessage: "¡Perfecta! 💆‍♀️✔️ Cita registrada.\n\nLa Dra. López te enviará la confirmación y las indicaciones previas al tratamiento en menos de 1 hora.", options: [], benefitText: "Protocolo de pre-tratamiento enviado automáticamente. El paciente llega preparado y la cita es más eficiente." },
      { botMessage: "¿Quieres recibir nuestras promociones mensuales y novedades de tratamientos? 🌟", options: ["Sí, suscríbeme 💌", "No, gracias"], benefitText: "Base de datos de leads cualificados. Cada respuesta alimenta tu CRM de forma automática." }
    ]
  },
  veterinaria: {
    agentName: 'Bookia — Veterinaria',
    steps: [
      { botMessage: "¡Hola! 🐾 Bienvenido/a. ¿En qué podemos ayudarte hoy?", options: ["Revisión general", "Vacunación / Desparasitación", "Urgencia veterinaria 🚨", "Peluquería canina"], benefitText: "Triaje automático para separar urgencias de consultas ordinarias. El veterinario gestiona mejor su tiempo." },
      { botMessage: "¿Qué tipo de mascota tienes?", options: ["Perro 🐕", "Gato 🐱", "Conejo / Roedor 🐰", "Ave / Reptil / Otro"], benefitText: "Información de especie capturada automáticamente. El veterinario ya sabe qué médico o protocolo aplicar." },
      { botMessage: "¿Tu mascota ya es paciente de nuestra clínica?", options: ["Sí, tiene historial aquí", "No, es la primera vez"], benefitText: "Diferenciación de nuevos pacientes para agilizar el proceso de alta y preparar el historial clínico." },
      { botMessage: "¿Con qué urgencia necesitas la cita?", options: ["Hoy si es posible ⚡", "Cualquier día esta semana", "La próxima semana"], benefitText: "Gestión de prioridades sin que recepción tenga que mediar. Las urgencias se marcan automáticamente." },
      { botMessage: "¿Prefieres cita de mañana o de tarde?", options: ["Mañana (9-13h)", "Tarde (16-20h)"], benefitText: "Distribución equilibrada del flujo de pacientes a lo largo del día." },
      { botMessage: "¡Cita reservada! 🐾✔️\n\nEl Dr. Ramos atenderá a tu mascota. Recibirás confirmación y las indicaciones previas a la visita por WhatsApp.", options: [], benefitText: "El dueño ya sabe qué llevar a la cita. Menos tiempo perdido en consulta, más satisfacción del cliente." },
      { botMessage: "¿Quieres recibir recordatorios automáticos de vacunas y desparasitaciones? Así nunca se os olvidará. 💉", options: ["Sí, me apunto ✅", "No, yo me acuerdo"], benefitText: "Marketing preventivo totalmente automatizado. Récord de retención de clientes y visitas recurrentes." }
    ]
  },
  fisioterapia: {
    agentName: 'Bookia — Fisioterapia',
    steps: [
      { botMessage: "¡Hola! 💪 Soy el asistente de la clínica. ¿Qué tipo de molestia tienes?", options: ["Dolor de espalda / Cuello", "Lesión deportiva", "Recuperación post-operatoria", "Fisio preventiva"], benefitText: "Clasificación clínica previa. El fisioterapeuta llega a la cita ya con contexto del caso del paciente." },
      { botMessage: "¿Cuánto tiempo llevas con esta molestia?", options: ["Reciente (menos de 1 semana)", "Varias semanas", "Crónico (más de 3 meses)"], benefitText: "El nivel de cronicidad determina el tipo y duración del tratamiento. El bot lo captura sin intervención." },
      { botMessage: "¿Has recibido algún tratamiento previo para esta lesión?", options: ["Sí, ya he ido al fisio antes", "No, es la primera vez", "He tomado medicación"], benefitText: "Historial rápido del paciente. Permite al profesional ajustar el enfoque desde el primer minuto." },
      { botMessage: "¿Qué día te viene mejor para la primera sesión?", options: ["Lunes", "Miércoles", "Viernes", "Sábado"], benefitText: "Gestión de agenda sin llamadas. El paciente elige en su tiempo libre, no en horario de clínica." },
      { botMessage: "¿A qué hora prefieres la sesión?", options: ["9:00h", "11:00h", "16:00h", "18:00h"], benefitText: "Huecos de sesión asignados automáticamente respetando la duración de cada tratamiento." },
      { botMessage: "¡Cita confirmada! 💪✔️\n\nEl fisioterapeuta Miguel te atenderá con valoración inicial incluida. Recibirás un recordatorio el día anterior por WhatsApp.", options: [], benefitText: "El recordatorio automático reduce el no-show (pacientes que no aparecen) hasta en un 70%." },
      { botMessage: "¿Quieres que te enviemos ejercicios de calentamiento recomendados para hacer antes de tu sesión? 🏃", options: ["Sí, envíame los ejercicios ✅", "No, ya lo sé manejar"], benefitText: "Value-add automático pre-sesión. El paciente llega activado, la sesión es más efectiva, el cliente más feliz." }
    ]
  }
};

export default function App() {
  const [selectedBusiness, setSelectedBusiness] = useState('restaurante');
  const [currentStep, setCurrentStep] = useState(0);
  const [isFlowComplete, setIsFlowComplete] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: demoFlows['restaurante'].steps[0].botMessage, id: 'bot-0' }
  ]);

  // Lead Generation Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Admin Leads State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);
  const [leadsData, setLeadsData] = useState([]);

  const chatScrollRef = useRef(null);

  // Lockout timer effect
  useEffect(() => {
    let interval;
    if (isAdminModalOpen) {
      const checkLockout = () => {
        const expiry = parseInt(localStorage.getItem('admin_lockout_expiry') || '0', 10);
        const now = Date.now();
        if (expiry > now) {
          setLockoutTimeLeft(Math.ceil((expiry - now) / 1000));
        } else {
          setLockoutTimeLeft(0);
        }
      };
      checkLockout();
      interval = setInterval(checkLockout, 1000);
    } else {
      setLockoutTimeLeft(0);
    }
    return () => clearInterval(interval);
  }, [isAdminModalOpen]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Auto-advance on confirmation steps (options: [])
  useEffect(() => {
    const flow = demoFlows[selectedBusiness];
    const step = flow.steps[currentStep];
    if (step && step.options.length === 0 && !isFlowComplete) {
      const nextIdx = currentStep + 1;
      if (nextIdx < flow.steps.length) {
        const timer = setTimeout(() => {
          setChatHistory(prev => [
            ...prev,
            { role: 'bot', text: flow.steps[nextIdx].botMessage, id: `bot-${nextIdx}-${Date.now()}` }
          ]);
          setCurrentStep(nextIdx);
        }, 1600);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStep, selectedBusiness, isFlowComplete]);

  const handleOptionClick = (optionText) => {
    const flow = demoFlows[selectedBusiness];
    setChatHistory(prev => [...prev, { role: 'user', text: optionText, id: `user-${currentStep}-${Date.now()}` }]);
    const nextIdx = currentStep + 1;
    setTimeout(() => {
      if (nextIdx < flow.steps.length) {
        setChatHistory(prev => [...prev, { role: 'bot', text: flow.steps[nextIdx].botMessage, id: `bot-${nextIdx}-${Date.now()}` }]);
        setCurrentStep(nextIdx);
      } else {
        setIsFlowComplete(true);
      }
    }, 700);
  };

  const resetDemo = (newBusiness) => {
    const biz = newBusiness || selectedBusiness;
    const flow = demoFlows[biz];
    setCurrentStep(0);
    setIsFlowComplete(false);
    setSelectedBusiness(biz);
    setChatHistory([{ role: 'bot', text: flow.steps[0].botMessage, id: `bot-0-${Date.now()}` }]);
  };

  const currentBenefit = demoFlows[selectedBusiness].steps[currentStep]?.benefitText || '';
  const currentFlowLength = demoFlows[selectedBusiness].steps.length;
  const currentStepOptions = demoFlows[selectedBusiness].steps[currentStep]?.options || [];

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setIsSubmitted(false);
    setEmail('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset submitted state slightly after close animation
    setTimeout(() => setIsSubmitted(false), 300);
  };

  const openAdminModal = () => {
    setIsAdminModalOpen(true);
    setAdminPassword('');
    setLoginError('');
  };

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
    setTimeout(() => {
      setIsAuthenticatedAdmin(false);
      setAdminPassword('');
    }, 300);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (lockoutTimeLeft > 0) return; // Prevention
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(adminPassword);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Hash of "1992"
      const targetHash = "3f83e9ad5be63bd5bf2fd009fffe6b7dd4066243975bc962edc37459c17e65b9";
      
      if (hashHex === targetHash) {
        setIsAuthenticatedAdmin(true);
        setLoginError('');
        localStorage.removeItem('admin_failed_attempts');
        localStorage.removeItem('admin_lockout_expiry');
        const saved = JSON.parse(localStorage.getItem('reserva_bot_leads') || '[]');
        setLeadsData(saved.reverse());
      } else {
        const attempts = parseInt(localStorage.getItem('admin_failed_attempts') || '0', 10) + 1;
        localStorage.setItem('admin_failed_attempts', attempts.toString());
        
        // 60 seconds * 2^(attempts - 1)
        const penaltyMs = 60000 * Math.pow(2, attempts - 1);
        const expiry = Date.now() + penaltyMs;
        localStorage.setItem('admin_lockout_expiry', expiry.toString());
        setLockoutTimeLeft(Math.ceil(penaltyMs / 1000));
        setLoginError('');
        setAdminPassword('');
      }
    } catch (err) {
      setLoginError('Error validando credenciales.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Save lead to localStorage
    const newLead = {
      email,
      service: selectedService,
      date: new Date().toLocaleString()
    };
    const savedLeads = JSON.parse(localStorage.getItem('reserva_bot_leads') || '[]');
    localStorage.setItem('reserva_bot_leads', JSON.stringify([...savedLeads, newLead]));

    setIsSubmitted(true);
    // Auto-close modal after showing success
    setTimeout(() => {
      closeModal();
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col font-sans">

      {/* Background Glow Effects - Subtle dark minimal */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-zinc-900/30 to-[#050505] pointer-events-none" />

      {/* Header */}
      <header className="px-8 py-6 w-full max-w-7xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="relative w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.15)]">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          {/* Wordmark */}
          <div className="flex items-baseline gap-1">
            <span className="text-white font-extrabold tracking-tight text-xl leading-none">Bookia</span>
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest leading-none">AI</span>
          </div>
        </div>
        <button 
          onClick={openAdminModal}
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer"
        >
          Iniciar Sesión
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-start relative z-10">

        {/* Hero Section */}
        <div className="text-center max-w-4xl mb-12 md:mb-16 relative z-20">

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-700/60 rounded-full px-4 py-2 mb-8"
          >
            <span className="flex -space-x-1.5">
              {['#e879f9','#38bdf8','#fb923c'].map((c, i) => (
                <span key={i} className="w-6 h-6 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold" style={{backgroundColor: c}}>✓</span>
              ))}
            </span>
            <span className="text-zinc-300 text-sm font-medium">+47 restaurantes ya lo usan este mes</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-[64px] font-extrabold tracking-tight text-white mb-5 leading-[1.1]"
          >
            Deja de perder reservas<br className="hidden sm:block" />
            <span className="text-zinc-500"> mientras duermes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Instalamos un <strong className="text-zinc-200">recepcionista con IA</strong> en tu restaurante en 48h.
            Atiende y confirma reservas por WhatsApp, Instagram o tu web —<strong className="text-zinc-200">sin que tú hagas nada.</strong>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-10"
          >
            <button 
              onClick={() => openModal('Pack Full + Rediseño')}
              className="relative bg-white text-black font-bold px-10 py-4 rounded-full hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] cursor-pointer text-[17px]"
            >
              Quiero verlo en mi restaurante →
            </button>
            <button 
              onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-transparent border border-zinc-700 text-zinc-300 font-semibold px-8 py-4 rounded-full hover:border-zinc-500 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              Ver demo en vivo ↓
            </button>
          </motion.div>

          {/* Social Proof Metrics Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-3"
          >
            {[
              { value: '3.2x', label: 'más reservas en 30 días' },
              { value: '0€', label: 'coste por reserva gestionada' },
              { value: '48h', label: 'para estar operativo' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-white font-extrabold text-lg">{stat.value}</span>
                <span className="text-zinc-500 text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Business Type Selector */}
        <div className="w-full max-w-5xl mb-12">
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest text-center mb-5">
            🎯 Elige el tipo de negocio para ver la demo personalizada
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {businessTypes.map((biz) => {
              const isActive = selectedBusiness === biz.id;
              const BizIcon = biz.Icon;
              return (
                <button
                  key={biz.id}
                  onClick={() => resetDemo(biz.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
                  }`}
                >
                  <span>{biz.emoji}</span>
                  <span>{biz.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Demo Section - Two Columns */}
        <div id="demo-section" className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left Column: Phone Simulator */}
          <motion.div
            key={selectedBusiness}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            {/* Phone Frame */}
            <div className="w-full max-w-[320px] sm:max-w-[360px] h-[610px] sm:h-[700px] bg-black rounded-[2.5rem] sm:rounded-[3rem] p-2 sm:p-2.5 shadow-2xl relative overflow-hidden border border-zinc-800">

              {/* Phone Top Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 sm:h-7 bg-black rounded-b-xl sm:rounded-b-2xl z-20 flex justify-center items-end pb-1 sm:pb-1.5 border-b border-l border-r border-zinc-800">
                <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-zinc-800 rounded-full"></div>
              </div>

              {/* Phone Screen */}
              <div className="w-full h-full bg-zinc-900 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col relative chat-scroll">

                {/* Chat Header */}
                <div className="bg-black/90 backdrop-blur-md px-4 py-5 pt-10 border-b border-zinc-800 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-2 shadow-sm">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-[15px]">{demoFlows[selectedBusiness].agentName}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-1.5 h-1.5 rounded-full bg-green-400"
                    />
                    <span className="text-xs text-zinc-400 font-medium">En línea ahora</span>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 pb-32 chat-scroll">
                  <AnimatePresence>
                    {chatHistory.map((msg, idx) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`
                          max-w-[85%] p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm whitespace-pre-line
                          ${msg.role === 'user'
                            ? 'bg-white text-black rounded-tr-sm'
                            : 'bg-zinc-800 text-white border border-zinc-700/50 rounded-tl-sm'}
                        `}>
                          {msg.text}
                          {msg.role === 'bot' && isFlowComplete && idx === chatHistory.length - 1 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', delay: 0.3 }}
                              className="mt-3 flex justify-center"
                            >
                              <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-green-400" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />

                {/* Options Area */}
                <div className="absolute bottom-0 left-0 w-full p-4 pb-8 bg-black/90 backdrop-blur-xl border-t border-zinc-800 z-10">
                  <AnimatePresence mode="wait">
                    {isFlowComplete ? (
                      <motion.div key="complete" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 items-center">
                        <button
                          onClick={() => resetDemo()}
                          className="text-zinc-500 hover:text-white font-medium text-sm py-2.5 px-6 rounded-full border border-zinc-800 hover:bg-zinc-900 transition-all cursor-pointer"
                        >
                          ↩ Reiniciar Demo
                        </button>
                      </motion.div>
                    ) : currentStepOptions.length > 0 ? (
                      <motion.div
                        key={`opts-${selectedBusiness}-${currentStep}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-wrap gap-2 justify-end"
                      >
                        {currentStepOptions.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionClick(opt)}
                            className="bg-zinc-900 hover:bg-zinc-700 text-white font-medium text-xs py-2 px-4 rounded-full border border-zinc-700 shadow-sm transition-all active:scale-95 cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-1">
                        <div className="flex gap-1.5 items-center">
                          {[0, 0.2, 0.4].map((d, i) => (
                            <motion.span key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: d }} className="w-2 h-2 bg-zinc-600 rounded-full" />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Right Column: Context + Benefit Card */}
          <div className="flex justify-center lg:justify-start pt-6 lg:pt-0 lg:sticky lg:top-8">
            <div className="w-full max-w-[400px]">

              {/* Step counter */}
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    {isFlowComplete ? '✅ Demo completada' : `Paso ${currentStep + 1} de ${currentFlowLength}`}
                  </span>
                </div>
              </div>

              {/* Benefit card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`benefit-${selectedBusiness}-${currentStep}-${isFlowComplete}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-8 rounded-3xl relative overflow-hidden mb-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-black" />
                      </div>
                    </div>
                    <p className="text-zinc-200 text-[17px] leading-relaxed font-medium">
                      {isFlowComplete
                        ? '🎉 ¡Conversación completada! El cliente tiene su cita confirmada y tú no has hecho absolutamente nada.'
                        : currentBenefit}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-7">
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        animate={{ width: `${((currentStep + (isFlowComplete ? 1 : 0)) / currentFlowLength) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-zinc-600 text-xs mt-2">
                      {Math.round(((currentStep + (isFlowComplete ? 1 : 0)) / currentFlowLength) * 100)}% del flujo completado
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* CTA after completion */}
              {isFlowComplete && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <button
                    onClick={() => openModal('Pack Full + Rediseño')}
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 cursor-pointer text-[15px] mb-3"
                  >
                    Quiero esto para mi negocio →
                  </button>
                  <p className="text-zinc-600 text-xs text-center">Sin permanencia · Activo en 48h · Soporte incluido</p>
                </motion.div>
              )}

            </div>
          </div>

        </div>

        {/* Testimonials Section */}
        <section className="w-full max-w-5xl mt-28 mb-0 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-zinc-500 text-sm font-semibold uppercase tracking-widest mb-3">Lo que dicen nuestros clientes</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Resultados reales en negocios reales</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                quote: "Antes perdíamos reservas los fines de semana porque no dábamos abasto con el teléfono. Ahora el bot lo gestiona todo. Hemos subido un 40% la ocupación.",
                author: "Marco T.",
                role: "Propietario, Restaurante La Volta",
                metric: "+40% ocupación"
              },
              {
                quote: "La instalación fue en dos días. Sin complicaciones. Ahora mis clientes reservan por WhatsApp a las 2am y yo me entero por la mañana con todo confirmado.",
                author: "Ana R.",
                role: "Gerente, Chiringuito Brisa Mar",
                metric: "0 llamadas perdidas"
              },
              {
                quote: "Lo más valioso es el tiempo que recovery. Antes dedicaba 2 horas al día a gestionar reservas. Ahora esas 2 horas las invierto en el negocio.",
                author: "Carlos M.",
                role: "Chef-propietario, Takiaria",
                metric: "2h/día recuperadas"
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-7 flex flex-col gap-5"
              >
                <span className="inline-block self-start bg-zinc-800/80 text-zinc-300 text-xs font-bold px-3 py-1 rounded-full">{t.metric}</span>
                <p className="text-zinc-300 leading-relaxed text-[15px] flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.author}</p>
                  <p className="text-zinc-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Services Section - CRO Optimized */}
        <section className="w-full max-w-6xl mt-16 mb-16 px-4">
          <div className="text-center mb-14">
            <p className="text-zinc-500 text-sm font-semibold uppercase tracking-widest mb-3">Elige tu solución</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Sin contratos. Sin complicaciones.</h2>
            <p className="text-zinc-400 text-lg">Empieza por el canal que ya usan tus clientes. Escala cuando quieras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div 
              onClick={() => openModal('Solo WhatsApp')}
              className="group cursor-pointer p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-500/50 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col"
            >
              <MessageSquare className="w-7 h-7 text-zinc-300 mb-5 group-hover:text-white transition-colors" />
              <h3 className="text-lg font-bold mb-2 text-white">Chatbot WhatsApp</h3>
              <div className="mb-4">
                <span className="text-3xl font-black text-white">57€</span><span className="text-zinc-500 text-base font-medium">/mes</span>
                <p className="text-xs text-zinc-500 mt-1">+247€ setup único</p>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">Tus clientes reservan sin salir de WhatsApp. <strong className="text-zinc-300">El canal con mayor ratio de apertura del mundo (98%).</strong></p>
              <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors mt-auto">Añadir WhatsApp →</span>
            </div>
            {/* Card 2 */}
            <div 
              onClick={() => openModal('Solo Instagram')}
              className="group cursor-pointer p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-500/50 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col"
            >
              <Share2 className="w-7 h-7 text-zinc-300 mb-5 group-hover:text-white transition-colors" />
              <h3 className="text-lg font-bold mb-2 text-white">Chatbot Instagram</h3>
              <div className="mb-4">
                <span className="text-3xl font-black text-white">57€</span><span className="text-zinc-500 text-base font-medium">/mes</span>
                <p className="text-xs text-zinc-500 mt-1">+177€ setup único</p>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">Convierte cada DM y cada comentario en una reserva confirmada. <strong className="text-zinc-300">Ideal para locales con fuerte presencia social.</strong></p>
              <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors mt-auto">Añadir Instagram →</span>
            </div>
            {/* Card 3 */}
            <div 
              onClick={() => openModal('Solo Chatbot Web')}
              className="group cursor-pointer p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-500/50 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col"
            >
              <Layout className="w-7 h-7 text-zinc-300 mb-5 group-hover:text-white transition-colors" />
              <h3 className="text-lg font-bold mb-2 text-white">Asistente Web</h3>
              <div className="mb-4">
                <span className="text-3xl font-black text-white">67€</span><span className="text-zinc-500 text-base font-medium">/mes</span>
                <p className="text-xs text-zinc-500 mt-1">+247€ setup único</p>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">Un recepcionista 24/7 integrado en tu web. <strong className="text-zinc-300">Tu local sigue llenando mesas incluso cuando estás cerrado.</strong></p>
              <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors mt-auto">Añadir Asistente Web →</span>
            </div>
            {/* Card 4 - Web a Medida */}
            <div 
              onClick={() => openModal('Web a Medida')}
              className="group cursor-pointer p-8 rounded-3xl bg-zinc-900/30 border border-zinc-700/60 hover:border-zinc-400/60 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-transparent pointer-events-none" />
              <Globe className="w-7 h-7 text-zinc-300 mb-5 group-hover:text-white transition-colors" />
              <h3 className="text-lg font-bold mb-2 text-white">Web a Medida</h3>
              <div className="mb-4">
                <span className="text-2xl font-bold text-white">A medida</span>
                <p className="text-xs text-zinc-500 mt-1">Presupuesto personalizado</p>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">Diseño y desarrollo web profesional con reservas integradas. <strong className="text-zinc-300">Tu primer empleado digital, siempre disponible.</strong></p>
              <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors mt-auto">Solicitar presupuesto →</span>
            </div>
            {/* Card 5 - Highlighted Full Pack */}
            <div 
              onClick={() => openModal('Pack Full + Rediseño')}
              className="group cursor-pointer relative p-8 rounded-3xl bg-zinc-900 border border-zinc-600 hover:border-white transition-all duration-300 transform hover:-translate-y-1 shadow-2xl md:col-span-2 lg:col-span-2 flex flex-col justify-between"
            >
              <div className="absolute -top-3 left-8 px-4 py-1 bg-white text-black text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                Más elegido · Mejor valor
              </div>
              
              <div>
                <Sparkles className="w-7 h-7 text-white mb-5" />
                <h3 className="text-xl font-bold mb-2 text-white">Pack Full — Todos los Canales</h3>
                <div className="mb-6 flex items-baseline gap-3">
                  <span className="text-4xl font-black text-white">117€</span><span className="text-zinc-400 font-medium tracking-wide">/mes</span>
                  <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded-full">+497€ setup único</span>
                </div>
                
                <p className="text-zinc-400 text-[15px] leading-relaxed mb-8">
                  WhatsApp + Instagram + Web + Rediseño premium de tu página. <strong className="text-white">La solución completa que multiplica por 3 las reservas.</strong> Ahorras más de 170€ respecto a contratarlo por separado.
                </p>
              </div>

              <div className="flex items-center">
                <span className="inline-flex items-center gap-2 bg-white text-black text-[15px] font-bold px-8 py-3.5 rounded-full group-hover:bg-zinc-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Quiero el Pack Completo →
                </span>
              </div>
            </div>
          </div>

          {/* Final bottom CTA strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">¿Tienes dudas? Cuéntanos tu caso.</h3>
              <p className="text-zinc-400">Sin compromiso. En menos de 24h te decimos exactamente qué solución encaja con tu negocio.</p>
            </div>
            <button
              onClick={() => openModal('Consulta sin compromiso')}
              className="shrink-0 bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Hablar con un experto →
            </button>
          </motion.div>
        </section>

      </main>

      {/* Admin Leads Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 w-full max-w-3xl relative shadow-2xl max-h-[80vh] flex flex-col"
            >
              <button 
                onClick={closeAdminModal}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer z-10"
                aria-label="Cerrar panel"
              >
                <X className="w-6 h-6" />
              </button>

              {!isAuthenticatedAdmin ? (
                <div className="flex flex-col items-center justify-center py-8 px-4">
                  <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h3>
                  <p className="text-zinc-400 mb-8 text-center text-sm">
                    Introduce tu código de seguridad.
                  </p>
                  
                  <form onSubmit={handleAdminLogin} className="w-full max-w-xs">
                    <input 
                      type="password" 
                      value={adminPassword}
                      onChange={(e) => {
                         setAdminPassword(e.target.value);
                         setLoginError('');
                      }}
                      disabled={lockoutTimeLeft > 0}
                      placeholder="••••"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-center text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all mb-4 tracking-[0.5em] font-mono text-xl disabled:opacity-50"
                      autoFocus
                    />
                    {lockoutTimeLeft > 0 ? (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-500 text-sm mb-4 text-center">
                        Bloqueado por seguridad. <br/>
                        Espera {Math.floor(lockoutTimeLeft / 60)}:{(lockoutTimeLeft % 60).toString().padStart(2, '0')} para reintentar.
                      </motion.p>
                    ) : loginError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm mb-4 text-center">
                        {loginError}
                      </motion.p>
                    )}
                    <button 
                      type="submit"
                      disabled={lockoutTimeLeft > 0}
                      className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Autenticar
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">Panel de Leads</h3>
                  <p className="text-zinc-400 mb-6 text-sm flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Correos capturados en la landing page.
                  </p>

                  <div className="flex-1 overflow-y-auto pr-2 chat-scroll">
                {leadsData.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    No hay leads capturados todavía.
                  </div>
                ) : (
                  <div className="w-full text-left overflow-x-auto">
                    <table className="w-full border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                          <th className="pb-3 pr-4 font-medium text-left">Email</th>
                          <th className="pb-3 pr-4 font-medium text-left">Servicio de interés</th>
                          <th className="pb-3 font-medium text-left">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leadsData.map((lead, i) => (
                          <tr key={i} className="border-b border-zinc-800/50 text-zinc-300 text-sm hover:bg-zinc-800/20 transition-colors">
                            <td className="py-4 pr-4 font-medium text-white whitespace-nowrap">{lead.email}</td>
                            <td className="py-4 pr-4">
                              <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs whitespace-nowrap">{lead.service}</span>
                            </td>
                            <td className="py-4 text-zinc-500 whitespace-nowrap">{lead.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario de Captación de Leads (Modal) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl"
            >
              <button 
                onClick={closeModal}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-6 h-6" />
              </button>

              {!isSubmitted ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">Solicita información</h3>
                  <p className="text-zinc-400 mb-6 text-sm">Déjanos tu email y te enviaremos todos los detalles sin compromiso.</p>

                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-zinc-300 mb-1.5">Servicio de interés</label>
                      <div className="relative">
                        <select 
                          id="service" 
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all cursor-pointer appearance-none"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                        >
                          <option value="Solo WhatsApp">Solo WhatsApp</option>
                          <option value="Solo Instagram">Solo Instagram</option>
                          <option value="Solo Chatbot Web">Solo Chatbot Web</option>
                          <option value="Web a Medida">Web a Medida</option>
                          <option value="Pack Full + Rediseño">Pack Full + Rediseño</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">Correo electrónico</label>
                      <input 
                        type="email" 
                        id="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full mt-2 bg-white text-black font-bold text-[15px] py-3.5 rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                      Solicitar información
                    </button>
                  </form>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-6"
                >
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">¡Gracias!</h3>
                  <p className="text-zinc-400">Te enviaremos la información a tu correo en breve.</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
