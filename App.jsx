import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, CheckCircle2, Bot, Clock, CalendarDays, Users, MessageSquare, Share2, Layout, Sparkles, Globe, X, Database, Lock, UtensilsCrossed, Scissors, Activity, PawPrint, Stethoscope, Heart, ArrowLeft, Target } from 'lucide-react';

/* ─── Scroll-Reveal Text Component ───────────────────────────────── */
function ScrollRevealText({ children, className = '', tag: Tag = 'h2' }) {
  const ref = useRef(null);
  const wordsRef = useRef([]);
  const observerRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll('.reveal-word'));
    wordsRef.current = words;

    // Light up words that are already visible on page load with a short delay
    const lightUpWord = (wordEl, delay) => {
      setTimeout(() => wordEl.classList.add('lit'), delay);
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = wordsRef.current.indexOf(entry.target);
            lightUpWord(entry.target, idx * 60);
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      // No rootMargin penalty — fires as soon as word crosses viewport
      { threshold: 0.1 }
    );

    words.forEach((w) => observerRef.current.observe(w));
    return () => observerRef.current?.disconnect();
  }, [children]);

  // Space OUTSIDE the span so inline-block doesn't collapse it
  const wrapped = String(children)
    .split(' ')
    .map((word, i) => (
      <span key={i} className="reveal-word">{word}</span>
    ))
    .reduce((acc, el, i) => {
      if (i === 0) return [el];
      return [...acc, ' ', el]; // literal space node between spans
    }, []);

  return <Tag ref={ref} className={className}>{wrapped}</Tag>;
}

/* ─── Bento Spotlight Card ────────────────────────────────────────── */
function BentoCard({ children, className = '', onClick }) {
  const cardRef = useRef(null);
  const spotRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spot.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(255,255,255,0.07) 0%, transparent 70%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (spotRef.current) spotRef.current.style.background = 'transparent';
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bento-card cursor-pointer ${className}`}
    >
      <div ref={spotRef} className="bento-spotlight" />
      {children}
    </div>
  );
}

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
      { botMessage: "¿Hay alguna alergia o petición especial que debamos tener en cuenta?", options: ["Sin alergias", "Celíaco / Gluten", "Vamos con 2 niños, carrito, y soy celíaco."], benefitText: "El bot recopila peticiones excepcionales complejas escritas en lenguaje natural." },
      { botMessage: "¡Todo listo! Tu reserva está confirmada ✔️\n\nHe dejado nota a cocina de la alergia (tenemos carta sin gluten 🌾) y os he asignado una mesa amplia en esquina para que el carrito no moleste.\n\n📅 Mañana · 21:00h · 4 personas", options: [], benefitText: "¡Magia de la IA! Interpreta contexto humano complejo y da soluciones reales sin tu intervención." },
      { botMessage: "Por cierto, ¿quieres recibir nuestra carta digital para ir abriendo boca? 😋", options: ["¡Sí, envíame la carta!", "No, gracias"], benefitText: "Upsell automático post-reserva. El bot puede enviar la carta o promociones en piloto automático." }
    ]
  },
  dental: {
    agentName: 'Bookia — Clínica Dental',
    steps: [
      { botMessage: "¡Hola! Soy el asistente de la clínica. ¿Qué tratamiento necesitas? 🦷", options: ["Revisión anual", "Limpieza", "Quiero un implante pero me da pánico..."], benefitText: "El paciente plantea objeciones o miedos típicos que frenarían una venta en una web normal." },
      { botMessage: "Entiendo perfectamente ese temor. No te preocupes, en nuestra clínica utilizamos anestesia digital indolora y protocolos de sedación consciente. Prometido que no duele nada. 😊\n\n¿Quieres que el Dr. te valore sin compromiso?", options: ["Venga, me animo ✅", "Prefiero pensarlo"], benefitText: "El bot actúa como el mejor comercial: empatiza, usa tu valor diferencial (sedación) y derriba la objeción." },
      { botMessage: "¡Genial! ¿Eres paciente nuevo o ya tienes historial en nuestra clínica?", options: ["Soy paciente nuevo", "Ya soy paciente"], benefitText: "Una vez convencido, diferencia nuevos pacientes de existentes para optimizar la ficha." },
      { botMessage: "¿Qué día te viene mejor para la cita de valoración gratuita?", options: ["Esta semana", "La próxima semana", "Mañana mismo"], benefitText: "Agenda en tiempo récord sin ocupar a recepción en llamadas largas y llenas de miedo de los pacientes." },
      { botMessage: "¿Prefieres turno de mañana o de tarde?", options: ["Mañana (9-14h)", "Tarde (15-20h)"], benefitText: "Gestión eficiente de huecos basada en la disponibilidad real del doctor." },
      { botMessage: "¡Cita registrada! ✔️\n\nEl Dr. García te espera. Te acabo de enviar un PDF con testimonios de pacientes que también tenían miedo a los implantes para que vengas súper tranquilo/a.", options: [], benefitText: "Nutrición automática de leads. Se reduce drásticamente el % de cancelación por estrés médico." },
      { botMessage: "¿Quieres un recordatorio por WhatsApp 24h antes? ✨", options: ["Sí, por favor", "No hace falta"], benefitText: "Garantiza la asistencia y aumenta tu retorno de inversión usando recordatorios automatizados." }
    ]
  },
  peluqueria: {
    agentName: 'Bookia — Peluquería',
    steps: [
      { botMessage: "¡Hola! 💇 Bienvenido/a. ¿Qué servicio estás buscando hoy?", options: ["Corte de pelo", "Balayage / Mechas", "Manicura / Pedicura"], benefitText: "El cliente elige su servicio de forma guiada sin odiosas horas de espera telefónica." },
      { botMessage: "¡Perfecto! El servicio de Balayage/Mechas lleva unas 3 horas. ¿Tienes preferencia por alguna estilista?", options: ["Ana ⭐", "Marcos ⭐", "Sin preferencia"], benefitText: "El bot conoce la duración técnica y especializada de cada servicio para no solapar turnos." },
      { botMessage: "¿Qué día prefieres reservar esas 3 horas bloqueadas para ti?", options: ["Miércoles", "Jueves", "Viernes"], benefitText: "Se muestran únicamente días que puedan absorber 3h seguidas en el calendario." },
      { botMessage: "¿A qué hora te va mejor empezar?", options: ["10:00h", "16:00h"], benefitText: "La sincronización bidireccional con tu agenda es perfecta y al milisegundo." },
      { botMessage: "Cita pre-guardada. 💇‍♀️\n\nComo las Mechas Balayage bloquean 3 horas completas de nuestra estilista Ana, requerimos una fianza de 20€ para confirmar tu plaza.\n\nTienes 30 minutos para completarlo aquí: [Pagar reserva en Stripe 💳]", options: [], benefitText: "¡K.O. AL NO-SHOW! Cobro automático de fianzas o señales integrado. Tu facturación, siempre blindada." },
      { botMessage: "En cuanto completemos la fianza, descontable en el salón, te enviaré tu ticket cerrado. ✨", options: ["Pagar reserva ahora 💳", "Quiero preguntar una duda"], benefitText: "Evita que tu negocio pierda 150€ por clientes que no aparecen. Ellos pagan con Apple Pay o Tarjeta." }
    ]
  },
  estetica: {
    agentName: 'Bookia — Clínica Estética',
    steps: [
      { botMessage: "¡Hola! ✨ Bienvenida/o a nuestra clínica. ¿Qué zona o tratamiento te interesa hoy?", options: ["Botox / Relleno", "Depilación láser", "Limpieza facial"], benefitText: "Filtro inicial estético clarísimo sin robar energía a tus trabajadoras." },
      { botMessage: "¿Es tu primera visita a nuestras instalaciones?", options: ["Sí, es mi primera vez", "Ya he ido antes"], benefitText: "Crea automáticamente la ficha clínica del lead con las etiquetas correctas en tu Base de Datos." },
      { botMessage: "¿Para qué fecha te viene bien reservar la sesión de Depilación Láser?", options: ["Esta semana", "La próxima semana", "Dentro de 2 semanas"], benefitText: "Autogestión total. Las clientas reservan compulsivamente incluso a las 3 de la madrugada." },
      { botMessage: "¿Prefieres que te encajemos de mañana o de tarde?", options: ["Mañana (9-14h)", "Tarde (15-19h)"], benefitText: "Se asigna el slot exacto cruzando la disponibilidad de sala láser + operaria responsable." },
      { botMessage: "¡Perfecta! 💆‍♀️✔️ Cita de Láser registrada el jueves.\n\nPor cierto, este mes tenemos una promo del 50% en Diseño de Cejas si te haces láser. ¿Te lo añado a la misma cita y matamos dos pájaros de un tiro?", options: ["¡Sí, añádelo! 😍", "No, gracias, solo láser"], benefitText: "UPSELLING MÁGICO. La IA detecta lo que tu cliente compra y le dispara un extra complementario perfecto." },
      { botMessage: "¡Añadido! Te he reservado 15 minutitos más.\n\nTe envío unas indicaciones rápidas para que no tomes el sol antes del láser. ¡Nos vemos el jueves!", options: [], benefitText: "Sube el ticket medio de tu clientela un +20% a final de mes sin que tus chicas intenten vender a presión." }
    ]
  },
  veterinaria: {
    agentName: 'Bookia — Veterinaria',
    steps: [
      { botMessage: "¡Hola! 🐾 Bienvenido/a a la Clínica. ¿En qué podemos ayudar a tu mascota? / How can we help your pet today?", options: ["Revisión general y vacuna", "My dog swallowed a sock! 🚨"], benefitText: "Soporte nativo Bilingüe Inmediato. Un filón y mina de oro si estás en zonas ex-pat o turísticas." },
      { botMessage: "That is a medical emergency! 🚨 We assist in English. Our surgeon is preparing the ER room right now.\n\nHas your dog been to our clinic before?", options: ["Yes, he has history here", "No, we are tourists!"], benefitText: "El cerebro IA salta protocolos triviales: Detecta el idioma y comprende la 'Urgencia Médica Vital'." },
      { botMessage: "Okay, we are opening a FAST-TRACK profile. How soon can you arrive at the clinic?", options: ["In 10 minutes ⚡", "I'm parking right now!"], benefitText: "Gestión de triajes críticos. Mientras el turista chatea conduciendo, la IA avisa por pantalla a tu cirujano." },
      { botMessage: "Understood. The team is waiting at the front door. Please just give me the name of your dog.", options: ["His name is Max 🐕"], benefitText: "El asistente saca solo el último dato necesario para agilizar internamente el ingreso a quirófano." },
      { botMessage: "Max will be in very good hands. ✔️\n\nHere is our exact GPS location map pin so you don't get lost. Drive safely.", options: [], benefitText: "Atención excelente, puramente empática y sin barreras de idioma, facturando tickets altos por urgencias." }
    ]
  },
  fisioterapia: {
    agentName: 'Bookia — Fisioterapia',
    steps: [
      { botMessage: "¡Hola! 💪 Soy el asistente inteligente de la clínica. ¿Deseas pedir cita nueva o gestionar una tuya?", options: ["Pedir cita nueva", "Tengo que cancelar mi cita de hoy ❌"], benefitText: "El mayor pozo de dinero para una clínica son los huecos vacíos de última hora no monetizados." },
      { botMessage: "Vaya, qué pena. Acabo de cancelar tu cita (tranquilo/a, ya la IA ha avisado a nuestra lista de espera para cubrir el hueco de hoy).\n\n¿Para qué día quieres reagendar tú?", options: ["Para este viernes", "La próxima semana"], benefitText: "Mientras das de baja el turno del perezoso, la IA lanza SMS con el hueco liberado para salvar tus ingresos." },
      { botMessage: "Para el viernes Fer está al 100% de ocupación, pero el sábado a las 10:00h me acaba de quedar un hueco libre por otra cancelación parecida.\n\n¿Te bloqueo esa hora?", options: ["Sí, guárdamelo ✅", "No, prefiero esperar al lunes"], benefitText: "Tetris avanzado: el Bot organiza cancelaciones para cuadrar agendas eficientemente de manera cruzada." },
      { botMessage: "¡Cita reagendada al sábado a las 10:00! 💪✔️\n\nHas evitado perder la sesión y nosotros mantenemos organizada la agenda.", options: [], benefitText: "Recuperación matemática de pacientes retenidos evitando caídas de facturación." },
      { botMessage: "¿Quieres que te envíe ahora un pequeño PDF de estiramientos lumbares suaves para que no te moleste la hernia de aquí al sábado?", options: ["¡Me vendría súper genial! ✨", "No, aguanto bien"], benefitText: "Atención hiper-personalizada. Regalas valor con automatización cerrando la experiencia rozando el 10/10." }
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

  const handleGoBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const flow = demoFlows[selectedBusiness];
      
      let targetStep = prevStep;
      let popCount = 0;
      
      // Si el paso anterior era de auto-avance (sin opciones), retrocedemos 2 de golpe
      // para no volver a caer en él y que se autodisparase hacia adelante automáticamente.
      if (flow.steps[prevStep].options.length === 0 && targetStep > 0) {
        targetStep = prevStep - 1; 
        popCount = 3; 
      } else {
        popCount = 2;
      }

      setCurrentStep(targetStep);
      setChatHistory(prev => prev.slice(0, prev.length - popCount));
      setIsFlowComplete(false);
    }
  };

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
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-start relative z-10">

        {/* Hero Section */}
        <div className="text-center w-full max-w-3xl mb-10 md:mb-16 relative z-20 px-2">

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center gap-2.5 bg-zinc-900/80 border border-zinc-700/60 rounded-full px-4 py-2 mb-6 mx-auto"
          >
            <span className="flex items-center gap-1">
              {['#e879f9','#38bdf8','#fb923c'].map((c, i) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: c }}
                >
                  ✓
                </span>
              ))}
            </span>
            <span className="text-zinc-400 text-[11px] sm:text-xs font-semibold tracking-wide whitespace-nowrap">
              +47 negocios activos
            </span>
          </motion.div>

          {/* H1 con reveal palabra a palabra */}
          <ScrollRevealText
            tag="h1"
            className="text-[2.2rem] sm:text-5xl md:text-[60px] font-extrabold tracking-tight mb-4 leading-[1.1]"
          >
            Deja de perder reservas mientras duermes.
          </ScrollRevealText>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg md:text-xl text-zinc-400 font-medium mb-8 max-w-xl mx-auto leading-relaxed px-1"
          >
            Instalamos un <strong className="text-zinc-200">recepcionista con IA</strong> en tu negocio en 48h.
            Atiende reservas por WhatsApp, Instagram o tu web —<strong className="text-zinc-200">sin que tú hagas nada.</strong>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row justify-center gap-3 mb-8"
          >
            <button
              onClick={() => openModal('Plan Ultra')}
              className="w-full sm:w-auto bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] cursor-pointer text-base sm:text-[17px]"
            >
              Quiero verlo en mi negocio →
            </button>
            <button
              onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto bg-transparent border border-zinc-700 text-zinc-300 font-semibold px-7 py-4 rounded-full hover:border-zinc-500 hover:text-white transition-all active:scale-95 cursor-pointer text-base"
            >
              Ver demo en vivo ↓
            </button>
          </motion.div>

          {/* Social Proof Metrics Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            {[
              { value: '3.2x', label: 'más reservas en 30 días' },
              { value: '0€', label: 'coste extra por reserva' },
              { value: '48h', label: 'para estar operativo' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <span className="text-white font-extrabold text-base sm:text-lg">{stat.value}</span>
                <span className="text-zinc-500 text-xs sm:text-sm">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Business Type Selector */}
        <div className="w-full max-w-5xl mb-8 sm:mb-12">
          <p className="flex justify-center items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-widest text-center mb-4">
            <Target className="w-3.5 h-3.5" /> Elige el tipo de negocio
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
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
                  <BizIcon className="w-4 h-4" />
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
                <div className="bg-black/90 backdrop-blur-md px-4 py-5 pt-10 border-b border-zinc-800 flex flex-col items-center relative">
                  {currentStep > 0 && (
                    <button 
                      onClick={handleGoBack}
                      className="absolute left-5 top-11 text-zinc-400 hover:text-white transition-colors flex items-center justify-center p-1 cursor-pointer active:scale-95"
                      title="Paso anterior"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
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
                    onClick={() => openModal('Plan Ultra')}
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

            {/* Card 1 — Plan Standard */}
            <BentoCard
              onClick={() => openModal('Plan Standard')}
              className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 flex flex-col group"
            >
              <MessageSquare className="w-7 h-7 text-zinc-400 mb-5 group-hover:text-white transition-colors duration-300" />
              <h3 className="text-lg font-bold mb-2 text-white">Plan Standard</h3>
              <div className="mb-4">
                <span className="text-3xl font-black text-white">79€</span>
                <span className="text-zinc-500 text-base font-medium">/mes</span>
                <p className="text-xs text-zinc-500 mt-1">+299€ setup único</p>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">
                Ideal para empezar a automatizar.
                <br /><br />
                • <strong className="text-zinc-300">1 Canal a elegir</strong> (WhatsApp, IG o Web)<br />
                • Respuestas 24/7 instantáneas<br />
                • IA entrenada con tu menú e info<br />
                • Hasta 300 interacciones/mes
              </p>
              <span className="text-xs font-semibold text-zinc-500 group-hover:text-white transition-colors mt-auto">Seleccionar Standard →</span>
            </BentoCard>

            {/* Card 2 — Plan Pro */}
            <BentoCard
              onClick={() => openModal('Plan Pro')}
              className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 flex flex-col group relative overflow-hidden"
            >
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                Más Popular
              </div>
              <Share2 className="w-7 h-7 text-zinc-400 mb-5 group-hover:text-white transition-colors duration-300" />
              <h3 className="text-lg font-bold mb-2 text-white">Plan Pro</h3>
              <div className="mb-4">
                <span className="text-3xl font-black text-white">149€</span>
                <span className="text-zinc-500 text-base font-medium">/mes</span>
                <p className="text-xs text-zinc-500 mt-1">+499€ setup único</p>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">
                Escala tus reservas al máximo nivel.
                <br /><br />
                • <strong className="text-zinc-300">2 Canales combinados</strong><br />
                • Integración con Calendar y CRM<br />
                • Pagos embebidos (señal/fianza)<br />
                • Interacciones ilimitadas
              </p>
              <span className="text-xs font-semibold text-zinc-500 group-hover:text-white transition-colors mt-auto">Seleccionar Pro →</span>
            </BentoCard>

            {/* Card 3 — Plan Ultra */}
            <div
              onClick={() => openModal('Plan Ultra')}
              className="pack-full-card md:col-span-2 lg:col-span-1 cursor-pointer group"
            >
              {/* Fondo interior que cubre el borde animado */}
              <div className="pack-full-inner" />

              {/* Badge flotante */}
              <div className="absolute -top-3 left-8 z-10 px-4 py-1 bg-white text-black text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                Experiencia Total
              </div>

              {/* Contenido */}
              <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                <div>
                  <Sparkles className="w-7 h-7 text-white mb-5" />
                  <h3 className="text-xl font-bold mb-2 text-white">Plan Ultra</h3>
                  <div className="mb-6 flex flex-col items-baseline gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white">249€</span>
                      <span className="text-zinc-400 font-medium tracking-wide">/mes</span>
                    </div>
                    <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded-full mt-2">+799€ setup único</span>
                  </div>
                  <p className="text-zinc-400 text-[14px] leading-relaxed mb-8 flex-1">
                    Tu sistema omnicanal revolucionario.
                    <br /><br />
                    • <strong className="text-white">Todos los Canales</strong> (WA + IG + Web)<br />
                    • Rediseño web premium<br />
                    • Soporte prioritario 1-to-1<br />
                    • Reportes de conversión IA
                  </p>
                </div>
                <div>
                  <span className="inline-flex w-full justify-center items-center gap-2 bg-white text-black text-[14px] font-bold px-4 py-3 rounded-xl group-hover:bg-zinc-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] relative overflow-hidden">
                    Quiero el Plan Ultra →
                  </span>
                </div>
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
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedService !== 'Consulta sin compromiso' && selectedService 
                      ? `Solicitas el ${selectedService}` 
                      : 'Solicita información'}
                  </h3>
                  <p className="text-zinc-400 mb-6 text-sm">Déjanos tu email y te enviaremos todos los detalles sin compromiso.</p>

                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-zinc-300 mb-1.5">Plan de interés</label>
                      <div className="relative">
                        <select 
                          id="service" 
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all cursor-pointer appearance-none"
                          style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                        >
                          <option value="Plan Standard">Plan Standard (79€/mes)</option>
                          <option value="Plan Pro">Plan Pro (149€/mes)</option>
                          <option value="Plan Ultra">Plan Ultra (249€/mes)</option>
                          <option value="Consulta sin compromiso">Consulta sin compromiso</option>
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
