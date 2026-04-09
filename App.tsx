import { motion } from "motion/react";
import { HeroCanvas } from "./HeroCanvas";
import { 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  ChevronDown,
  BarChart3,
  Lightbulb,
  Lock,
  Star,
  Activity,
  Database,
  BrainCircuit,
  Play,
  AlertCircle,
  MousePointer2,
  LineChart,
  Users,
  Sun,
  Moon
} from "lucide-react";
import React, { useState, useEffect } from "react";

// --- VERSIÓN FINAL PARA DESPLIEGUE ---
const CONFIG = {
  CALENDLY_URL: "https://calendly.com/angel_global_ads-metricaia/revision-estrategico-meta-ads",
  WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbz40KoMeELecc2qvLQDLCIxVz3hQrXv3Kl-mppWFQvcNHiamDHnCLGZmhPoHlF9mgamdQ/exec",
  FB_PIXEL_ID: "497281582757814", // REEMPLAZAR CON TU PIXEL ID
  FB_ACCESS_TOKEN: "EAANXZCITStzsBQ79tqAOMIPWS0OkDc82pZCz7nxtSEyWkskG2Ijx1zZBbZAgico9IQLr0O6JkfrgweU6oZB7MUtYQFYLd0Ro6pGWi8isTn5MWcNqm4n8hIUg4g9IpWNGiLhG6J6NuZAVlF5FiXwDqj84gWyj5fZCPlWx9O4spPXqo7Lg1i8t0GMq0DiwO9ZBbwAvhwZDZD",
  VERSION: "1.0.7-FINAL-WEBHOOK"
};
// --- TRACKING FUNCTIONS ---
declare global {
  interface Window {
    fbq: any;
  }
}

const trackLead = (data: any) => {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'Lead', {
      content_name: data.plan || "Lead Landing",
      currency: 'USD',
      value: 1.00
    });
  }
};
// ----------------------------


// Componentes del Modal y Formulario
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-brand-navy border border-text-base/10 rounded-3xl shadow-2xl overflow-hidden glass"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-base transition-colors"
        >
          ✕
        </button>
        {children}
      </motion.div>
    </div>
  );
};

const LeadForm = ({ onClose, selectedPlan: initialPlan }: { onClose: () => void, selectedPlan?: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    sitioWeb: "",
    email: "",
    telefono: "",
    plan: initialPlan || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const webhookUrl = CONFIG.WEBHOOK_URL;

    
    try {
      console.log(`Intentando enviar lead v${CONFIG.VERSION}...`);
      
      // Construimos el body para POST
      const body = new URLSearchParams({
        ...formData,
        tipo: "Lead Landing",
        fecha: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
        version: CONFIG.VERSION
      });

      // Usamos fetch con POST y no-cors. Google Apps Script recibirá esto en 'doPost(e)'
      // Si tu script solo tiene 'doGet(e)', cámbialo a 'doPost(e)' o usa este método.
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        keepalive: true
      });

      // Como backup, también intentamos un ping GET por si el script solo acepta GET
      fetch(`${webhookUrl}?${body.toString()}`, { mode: 'no-cors', keepalive: true }).catch(() => {});
      
      // Facebook Pixel Tracking (Browser)
      trackLead(formData);

      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = CONFIG.CALENDLY_URL;
      }, 2500);

    } catch (error) {
      console.error("Error en envío:", error);
      // A pesar del error, si llegamos aquí es probable que sea un tema de CORS pero el dato HAYA LLEGADO.
      setIsSuccess(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2">¡Solicitud Recibida!</h3>
        <p className="text-text-muted mb-6">Te estamos redirigiendo para que elijas la fecha y hora de nuestra reunión...</p>
        <Button variant="primary" onClick={() => window.location.href = CONFIG.CALENDLY_URL} className="w-full">
          Si no redirige, clic aquí
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-2">Solicita una evaluación</h3>
      <p className="text-sm text-text-muted mb-6">Déjanos tus datos para analizar tu caso antes de nuestra reunión.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Nombre Completo *</label>
          <input 
            type="text" 
            name="nombre"
            required 
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-text-base/10 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all text-white placeholder-slate-500"
            placeholder="Ej: Laura Gómez"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Empresa / Nombre del Negocio *</label>
          <input 
            type="text" 
            name="empresa"
            required 
            value={formData.empresa}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-text-base/10 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all text-white placeholder-slate-500"
            placeholder="Ej: Tech Solutions"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">URL del Sitio Web o Instagram (Opcional)</label>
          <input 
            type="url" 
            name="sitioWeb"
            value={formData.sitioWeb}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-text-base/10 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all text-white placeholder-slate-500"
            placeholder="https://tudominio.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Correo Electrónico *</label>
          <input 
            type="email" 
            name="email"
            required 
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-text-base/10 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all text-white placeholder-slate-500"
            placeholder="tu@correo.com"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Teléfono (WhatsApp) *</label>
            <input 
              type="tel" 
              name="telefono"
              required 
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-text-base/10 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all text-white placeholder-slate-500"
              placeholder="+57 300 000 0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Plan de Interés *</label>
            <select 
              name="plan"
              required
              value={formData.plan}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-text-base/10 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan outline-none transition-all text-text-base placeholder-text-muted/50"
            >
              <option value="" disabled className="bg-brand-navy">Seleccionar Nivel</option>
              <option value="Base" className="bg-brand-navy">Mentoría Base</option>
              <option value="Premium" className="bg-brand-navy">Mentoría Premium</option>
              <option value="Master" className="bg-brand-navy">Mentoría Masterclass</option>
              <option value="Elite" className="bg-brand-navy">Implementación Elite</option>
            </select>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          className="w-full mt-4" 
        >
          {isSubmitting ? "Enviando..." : "Continuar a Agendar"}
        </Button>
      </form>
    </div>
  );
};

const EliteForm = ({ onClose }: { onClose: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    telefono: "",
    email: "",
    yaPauta: "",
    presupuesto: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const webhookUrl = CONFIG.WEBHOOK_URL;

    
    try {
      const eliteBody = new URLSearchParams({
        ...formData,
        tipo: "Elite Diagnosis",
        fecha: new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }),
        version: CONFIG.VERSION
      });

      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: eliteBody.toString(),
        keepalive: true
      });

      // Backup GET
      fetch(`${webhookUrl}?${eliteBody.toString()}`, { mode: 'no-cors', keepalive: true }).catch(() => {});

      // Facebook Tracking
      trackLead({ ...formData, plan: 'Elite Diagnosis' });

      setIsSuccess(true);
      setTimeout(onClose, 2500);
    } catch (error) {
      setIsSuccess(true); 
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-brand-cyan/20 text-brand-cyan rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-bold mb-2">¡Diagnóstico Solicitado!</h3>
        <p className="text-text-muted">Analizaremos tu caso y te contactaremos a la brevedad.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-2">Diagnóstico Gratis</h3>
      <p className="text-sm text-text-muted mb-6">Completa los datos para analizar tu potencial de escalado.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1 uppercase tracking-wider">Nombre</label>
            <input name="nombre" required onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-text-base/10 text-white outline-none focus:border-brand-cyan" placeholder="Tu nombre" />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1 uppercase tracking-wider">Empresa</label>
            <input name="empresa" required onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-text-base/10 text-white outline-none focus:border-brand-cyan" placeholder="Negocio" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1 uppercase tracking-wider">WhatsApp</label>
            <input type="tel" name="telefono" required onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-text-base/10 text-white outline-none focus:border-brand-cyan" placeholder="+57..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1 uppercase tracking-wider">Email</label>
            <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-text-base/10 text-white outline-none focus:border-brand-cyan" placeholder="tu@correo.com" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1 uppercase tracking-wider">¿Ya pauta en Meta Ads?</label>
          <select 
            name="yaPauta" 
            required 
            value={formData.yaPauta}
            onChange={handleChange} 
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-text-base/10 text-white outline-none cursor-pointer"
          >
            <option value="" disabled>Selecciona una opción</option>
            <option value="si">Sí, actualmente</option>
            <option value="no">No todavía</option>
            <option value="pausado">Pausé hace poco</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1 uppercase tracking-wider">¿Cuánto le gustaría invertir?</label>
          <input name="presupuesto" required onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-text-base/10 text-white outline-none focus:border-brand-cyan" placeholder="Ej: $1,000 USD / mes" />
        </div>
        
        <Button variant="secondary" className="w-full mt-4">
          {isSubmitting ? "Enviando..." : "Solicitar Diagnóstico"}
        </Button>
      </form>
    </div>
  );
};

const Section = ({ children, className = "", id = "", style }: { children: React.ReactNode, className?: string, id?: string, style?: React.CSSProperties }) => (
  <section id={id} className={`py-20 px-6 md:py-32 ${className}`} style={style}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

const Button = ({ children, variant = "primary", className = "", onClick }: { children: React.ReactNode, variant?: "primary" | "secondary" | "outline", className?: string, onClick?: () => void }) => {
  const baseStyles = "px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-lg w-full sm:w-auto";
  const variants = {
    primary: "bg-brand-blue text-white hover:bg-blue-700 blue-glow",
    secondary: "bg-brand-cyan text-[#020617] hover:bg-cyan-300 cyan-glow",
    outline: "border border-text-base/20 text-text-base hover:bg-text-base/5"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="rounded-xl mb-2 overflow-hidden transition-all duration-300"
      style={{ background: isOpen ? 'rgba(37,99,235,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isOpen ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.05)'}` }}
    >
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base font-semibold text-text-base leading-snug">{question}</span>
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
          style={{ background: isOpen ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.05)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <ChevronDown size={14} className={isOpen ? 'text-brand-cyan' : 'text-text-muted'} />
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-sm text-text-muted leading-relaxed">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};


const ThemeToggle = ({ isLight, toggle }: { isLight: boolean, toggle: () => void }) => (
  <button 
    onClick={toggle}
    className="fixed top-6 right-6 z-[10000] p-3 rounded-2xl glass hover:scale-110 transition-all duration-300 group"
    aria-label="Toggle Theme"
  >
    {isLight ? (
      <Moon size={24} className="text-brand-blue group-hover:rotate-12 transition-transform" />
    ) : (
      <Sun size={24} className="text-brand-cyan group-hover:rotate-12 transition-transform" />
    )}
  </button>
);

export default function App() {
  const [modalType, setModalType] = useState<"lead" | "elite" | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLight]);

  const toggleTheme = () => setIsLight(!isLight);

  const openForm = (plan: string = "") => {
    setSelectedPlan(plan);
    setModalType("lead");
  };

  const openEliteForm = () => {
    console.log("Triggered openEliteForm");
    // Alert para depuración física en el navegador
    // alert("Abriendo diagnóstico..."); 
    setModalType("elite");
  };

  const scrollToLevels = () => {
    const el = document.getElementById('niveles');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-blue selection:text-white bg-brand-navy text-text-base font-sans antialiased transition-colors duration-300">
      <ThemeToggle isLight={isLight} toggle={toggleTheme} />
      <HeroCanvas openForm={openForm} scrollToLevels={scrollToLevels} isLight={isLight} />

      {/* 2. VSL DE VENTAS */}
      <Section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #020617 0%, #05091a 50%, #020617 100%)' }}>
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="gradient-line w-16" />
            <span className="section-label">02 / Presentación del Método</span>
            <div className="gradient-line w-16" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight">
            Antes de elegir su nivel, vea cómo funciona el<br />
            <span className="text-gradient-brand">Método Métricas IA™</span>
          </h2>
          <p className="text-base md:text-lg text-text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            En 10 minutos entenderá por qué la mayoría falla con Meta Ads y cómo una metodología real cambia todo.
          </p>

          {/* Video con corner brackets premium */}
          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute -inset-px bg-gradient-to-r from-brand-blue via-transparent to-brand-cyan rounded-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700" />
            <div className="relative aspect-video rounded-2xl overflow-hidden" style={{ background: '#05091a', border: '1px solid rgba(37,99,235,0.2)' }}>
              {/* Corner deco */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-brand-cyan z-10 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-brand-cyan z-10 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-brand-blue z-10 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-brand-blue z-10 rounded-br-xl" />
              {/* Live indicator */}
              <div className="absolute top-3 right-10 z-10 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan" />
                </span>
                <span className="section-label" style={{ fontSize: '0.55rem' }}>Reproducir Ahora</span>
              </div>
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/xkoGtLH9KJU"
                title="Método Métricas IA VSL"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Bullets debajo del video */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { text: "Por qué sus campañas no escalan", icon: <LineChart size={14} /> },
              { text: "Cómo tomar decisiones con criterio real", icon: <BrainCircuit size={14} /> },
              { text: "Qué nivel encaja mejor con su etapa", icon: <Target size={14} /> }
            ].map((bullet, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-left" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)' }}>
                <span className="text-brand-cyan shrink-0">{bullet.icon}</span>
                <span className="text-sm font-medium text-slate-300">{bullet.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={scrollToLevels}
              className="group px-10 py-4 rounded-full font-semibold text-base flex items-center gap-2 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #2563eb)', color: '#020617', boxShadow: '0 0 30px rgba(34,211,238,0.2)' }}
            >
              Ver qué nivel es para mí
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Section>

      {/* 3. SECCIÓN DE IDENTIFICACIÓN DEL PROBLEMA (PAS) */}
      <Section>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="gradient-line w-12" />
              <span className="section-label">03 / El Diagnóstico</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-[1.1]">
              El problema no es Meta Ads.
              <br />
              <span className="text-brand-cyan">Es escalar sin método.</span>
            </h2>
            <p className="text-base text-text-muted mb-8 leading-relaxed">
              No es su culpa. La mayoría fracasa porque intenta aprender sobre la marcha mientras pierde dinero real. La estructura lo cambia todo:
            </p>
            <div className="space-y-3">
              {[
                "Lanzar campañas sin estructura clara de testeo.",
                "No saber qué métrica mirar cuando las ventas bajan.",
                "Tocar campañas por ansiedad cada 2 horas.",
                "Creer que más presupuesto arreglará una mala estrategia.",
                "Depender de agencias que ejecutan pero no explican."
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <span className="text-red-400 text-xs font-bold">✕</span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard de campaña fallida — premium */}
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-blue/5 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden" style={{ background: '#05091a', border: '1px solid rgba(37,99,235,0.18)' }}>
              {/* Header del dashboard */}
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(37,99,235,0.06)' }}>
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-brand-cyan" />
                  <span className="text-xs font-semibold text-slate-300 font-mono">CAMPAIGN_MONITOR</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400" />
                  </span>
                  <span className="text-red-400 text-xs font-mono">ALERTA ACTIVA</span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Métricas */}
                {[
                  { label: "Presupuesto consumido", value: "$4,200", pct: 100, color: '#ef4444', status: "Agotado" },
                  { label: "ROAS actual", value: "0.8x", pct: 18, color: '#ef4444', status: "Negativo" },
                  { label: "Costo por Lead (CPL)", value: "$87.40", pct: 92, color: '#f97316', status: "Muy alto" },
                  { label: "Tasa de conversión", value: "0.4%", pct: 8, color: '#eab308', status: "Crítico" },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-text-muted font-mono">{m.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{m.value}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${m.color}18`, color: m.color, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem' }}>{m.status}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.pct}%` }}
                        transition={{ duration: 1, delay: i * 0.15 }}
                        className="h-full rounded-full"
                        style={{ background: m.color }}
                      />
                    </div>
                  </div>
                ))}

                {/* Separador */}
                <div className="gradient-line my-2" />

                {/* Log de errores */}
                <div className="space-y-1.5">
                  {[
                    "> Audiencia saturada — reach decayendo",
                    "> Creativos sin estructura de testeo A/B",
                    "> Sin reglas de optimización activas",
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertCircle size={10} className="text-red-400 mt-0.5 shrink-0" />
                      <span className="text-xs text-red-300/70 font-mono">{log}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 p-3 rounded-xl italic text-xs text-text-muted leading-relaxed" style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.1)' }}>
                  "Sentir que Meta Ads podría funcionar, pero no saber cómo volverlo predecible."
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. AGITACIÓN DEL DOLOR */}
      <Section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #020617 0%, #06021a 100%)' }}>
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 gradient-line" />
        <div className="text-center max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="gradient-line w-12" />
            <span className="section-label">04 / El Costo de No Actuar</span>
            <div className="gradient-line w-12" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Cada campaña sin método<br />
            <span className="text-brand-blue">le cuesta más de lo que cree.</span>
          </h2>
          <p className="text-base md:text-lg text-text-muted mb-16 max-w-3xl mx-auto leading-relaxed">
            Mientras improvisa, su competencia escala con datos. El costo real no es solo el presupuesto quemado — es el tiempo perdido, las oportunidades que no volvieron y la brecha que crece cada mes.
          </p>

          {/* Pain stats — estilo "loss meter" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-3xl mx-auto">
            {[
              { stat: "$1,200+", label: "Promedio quemado sin estrategia al mes", color: '#ef4444', icon: <Zap size={18} /> },
              { stat: "6 meses", label: "Tiempo promedio perdido antes de pedir ayuda", color: '#f97316', icon: <Activity size={18} /> },
              { stat: "73%", label: "De negocios que pausan por malos resultados", color: '#eab308', icon: <TrendingUp size={18} /> },
              { stat: "0 datos", label: "Con qué escalan la mayoría — solo intuición", color: '#8b5cf6', icon: <BrainCircuit size={18} /> },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-5 p-5 rounded-2xl text-left"
                style={{ background: `${item.color}08`, border: `1px solid ${item.color}20` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}15`, color: item.color }}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-2xl font-display font-bold" style={{ color: item.color }}>{item.stat}</div>
                  <div className="text-xs text-text-muted mt-0.5 leading-snug">{item.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-sm text-text-muted font-mono opacity-60">
            — El costo de no tener método no es hipotético. Es real y acumulativo.
          </p>
        </div>
      </Section>

      {/* 5. PRESENTACIÓN DE LA SOLUCIÓN */}
      <Section style={{ background: '#020617' }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="gradient-line w-12" />
            <span className="section-label">05 / La Solución</span>
            <div className="gradient-line w-12" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Deje de adivinar.<br />
            Empiece a escalar con <span className="text-gradient-brand">criterio real</span>.
          </h2>
          <p className="text-base md:text-lg text-text-muted leading-relaxed">
            Método Métricas IA™ no es un curso grabado más. Es mentoría estratégica diseñada para que aprenda a pensar sus campañas, leer sus métricas y escalar con lógica probada.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Lo que NO es */}
          <div className="p-8 rounded-2xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.14)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={16} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-red-400">Lo que NO es</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Un curso grabado sin soporte real.",
                "Una agencia que lo mantiene a oscuras.",
                "Teoría vacía sin aplicación práctica.",
                "Trucos de YouTube sin estructura.",
              ].map((txt, i) => (
                <li key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(239,68,68,0.07)' }}>
                  <span className="text-red-500/40 mt-0.5 shrink-0 text-xs font-bold font-mono">✕</span>
                  <span className="text-sm text-text-muted">{txt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lo que SÍ es */}
          <div className="p-8 rounded-2xl relative overflow-hidden" style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.16)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-0" style={{ background: 'rgba(37,99,235,0.08)' }} />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center icon-box-cyan">
                <ShieldCheck size={16} className="text-brand-cyan" />
              </div>
              <h3 className="text-lg font-bold text-brand-cyan">Lo que SÍ es</h3>
            </div>
            <ul className="space-y-3 relative z-10">
              {[
                "Mentoría estratégica con acompañamiento real.",
                "Estructura para entender métricas y optimizar.",
                "Estrategia + IA + Criterio en un solo método.",
                "Ruta clara y probada para escalar con lógica.",
              ].map((txt, i) => (
                <li key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(34,211,238,0.07)' }}>
                  <CheckCircle2 size={14} className="text-brand-cyan mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-200">{txt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 6. BENEFICIOS PRINCIPALES */}
      <Section style={{ background: 'linear-gradient(180deg, #020617 0%, #05091a 100%)' }}>
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="gradient-line w-12" />
            <span className="section-label">06 / Lo que Obtiene</span>
            <div className="gradient-line w-12" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-3">Beneficios Tangibles</h2>
          <p className="text-text-muted text-base">Resultados medibles. No promesas genéricas.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Entender qué funciona", desc: "Identifique qué creativos y audiencias traen dinero real.", icon: <Target size={20} />, color: '#2563eb' },
            { title: "Optimizar con Seguridad", desc: "Sepa exactamente qué corregir antes de que sea tarde.", icon: <Activity size={20} />, color: '#22d3ee' },
            { title: "Interpretar Métricas", desc: "Deje de mirar números vacíos. Entienda la lógica del negocio.", icon: <BarChart3 size={20} />, color: '#2563eb' },
            { title: "IA para Acelerar", desc: "Use IA para analizar patrones y ejecutar más rápido.", icon: <Cpu size={20} />, color: '#22d3ee' },
            { title: "Reducir Errores Costosos", desc: "Ahorre miles evitando configuraciones incorrectas.", icon: <ShieldCheck size={20} />, color: '#2563eb' },
            { title: "Escalar con Lógica", desc: "Suba presupuesto sin miedo a romper el rendimiento.", icon: <TrendingUp size={20} />, color: '#22d3ee' },
            { title: "Independencia Total", desc: "Deje de depender de agencias o intuición.", icon: <Lock size={20} />, color: '#2563eb' },
            { title: "Conocimiento Monetizable", desc: "Use este método para su negocio o véndalo a clientes.", icon: <Zap size={20} />, color: '#22d3ee' }
          ].map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="group p-6 rounded-xl card-glow-hover cursor-default"
              style={{ background: '#05091a', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${benefit.color}14`, border: `1px solid ${benefit.color}28`, color: benefit.color }}
              >
                {benefit.icon}
              </div>
              <h3 className="text-sm font-bold mb-1.5 text-white">{benefit.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 7. MECANISMO ÚNICO */}
      <Section style={{ background: '#05091a', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="gradient-line w-12" />
            <span className="section-label">07 / El Método</span>
            <div className="gradient-line w-12" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Los 3 Pilares del Método</h2>
          <p className="text-base text-text-muted">Tres ejes integrados que lo llevan de la improvisación a la escala predecible.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Línea conectora en desktop */}
          <div className="hidden md:block absolute top-14 left-1/4 right-1/4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.3), rgba(34,211,238,0.3), transparent)' }} />
          {[
            {
              num: "01",
              title: "Estrategia y Estructura",
              desc: "No lanzamos anuncios — construimos arquitecturas de venta. Cada dólar tiene un propósito claro desde el día uno.",
              benefit: "Claridad absoluta en su embudo",
              icon: <Target size={22} />, color: '#2563eb'
            },
            {
              num: "02",
              title: "IA Aplicada al Rendimiento",
              desc: "La IA potencia al estratega. Analizamos patrones que el ojo humano ignora para que sus decisiones se basen en data real.",
              benefit: "Decisiones basadas en data, no en fe",
              icon: <Cpu size={22} />, color: '#22d3ee'
            },
            {
              num: "03",
              title: "Acompañamiento y Criterio",
              desc: "Le enseñamos a pensar sus campañas. El criterio es el activo más valioso para escalar de forma predecible y segura.",
              benefit: "Escalado seguro y rentable",
              icon: <Users size={22} />, color: '#2563eb'
            }
          ].map((pilar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative p-8 rounded-2xl"
              style={{ background: '#020617', border: `1px solid ${pilar.color}20` }}
            >
              {/* Number watermark */}
              <div className="absolute top-4 right-5 font-mono text-5xl font-bold leading-none select-none" style={{ color: `${pilar.color}0d` }}>{pilar.num}</div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${pilar.color}14`, border: `1px solid ${pilar.color}28`, color: pilar.color }}>
                {pilar.icon}
              </div>
              <div className="section-label mb-2" style={{ color: pilar.color }}>{pilar.num} /</div>
              <h3 className="text-xl font-bold mb-3">{pilar.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-5">{pilar.desc}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: `${pilar.color}10`, border: `1px solid ${pilar.color}20`, color: pilar.color }}>
                <CheckCircle2 size={11} />
                {pilar.benefit}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* 8. SECCIÓN DE LOS 3 NIVELES */}
      <Section id="niveles" className="relative" style={{ background: 'linear-gradient(180deg, #05091a 0%, #020617 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-96 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.12), transparent 70%)' }} />

        <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="gradient-line w-12" />
            <span className="section-label">08 / Niveles del Método</span>
            <div className="gradient-line w-12" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 uppercase tracking-tight">Elige tu Nivel</h2>
          <p className="text-base text-text-muted">Una metodología, tres formas de dominarla. Encuentra el que encaja con tu etapa.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 relative z-10 items-start">
          {/* Nivel 1 — Base */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="flex flex-col rounded-2xl overflow-hidden card-glow-hover"
            style={{ background: '#05091a', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="px-7 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="section-label mb-3 block">Nivel 01</span>
              <h3 className="text-2xl font-bold mb-1">Mentoría Base</h3>
              <p className="text-brand-cyan text-xs font-mono uppercase tracking-widest">Cimientos Estratégicos</p>
            </div>
            <div className="p-7 flex-grow">
              <p className="text-sm text-text-muted mb-5 leading-relaxed">Para quien necesita una base sólida y dejar de improvisar desde cero.</p>
              <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs font-mono text-text-muted mb-1 uppercase tracking-wider">Transformación:</p>
                <p className="text-sm text-slate-200 leading-relaxed">De no saber qué tocar ni qué medir → a lanzar campañas con estructura y lógica.</p>
              </div>
              <ul className="space-y-2.5">
                {["Configuración técnica correcta.", "Estructura de testeo inicial.", "Lectura de métricas básicas."].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-text-muted">
                    <CheckCircle2 size={13} className="text-brand-cyan shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-7 pb-7">
              <button
                onClick={() => openForm("Base")}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:border-brand-blue/50 hover:text-white"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#8892a4', background: 'transparent' }}
              >
                Aplicar a Nivel Base
              </button>
            </div>
          </motion.div>

          {/* Nivel 2 — Premium (featured) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col rounded-2xl overflow-hidden relative lg:-mt-4 lg:mb-[-16px]"
            style={{ background: 'linear-gradient(160deg, #0d1f4e, #081230)', border: '1px solid rgba(37,99,235,0.4)', boxShadow: '0 0 50px rgba(37,99,235,0.18), 0 0 100px rgba(37,99,235,0.08)' }}
          >
            {/* Badge */}
            <div className="absolute -top-px left-0 right-0 flex justify-center">
              <div className="px-4 py-1 text-xs font-bold tracking-widest text-white font-mono" style={{ background: 'linear-gradient(90deg, #2563eb, #22d3ee)', borderRadius: '0 0 10px 10px' }}>
                ★ MÁS POPULAR
              </div>
            </div>
            <div className="px-7 pt-10 pb-6" style={{ borderBottom: '1px solid rgba(37,99,235,0.2)' }}>
              <span className="section-label mb-3 block" style={{ color: '#22d3ee' }}>Nivel 02</span>
              <h3 className="text-2xl font-bold mb-1">Mentoría Premium</h3>
              <p className="text-brand-cyan text-xs font-mono uppercase tracking-widest">Optimización y Escala</p>
            </div>
            <div className="p-7 flex-grow">
              <p className="text-sm text-text-muted mb-5 leading-relaxed">Para quien quiere acompañamiento cercano para optimizar y escalar resultados reales.</p>
              <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}>
                <p className="text-xs font-mono text-brand-cyan mb-1 uppercase tracking-wider">Transformación:</p>
                <p className="text-sm text-slate-200 leading-relaxed">De campañas inestables → a campañas entendidas, optimizadas y escalables.</p>
              </div>
              <ul className="space-y-2.5">
                {["Acompañamiento estratégico directo.", "Criterio de escalado avanzado.", "Optimización de embudos completos."].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 size={13} className="text-brand-cyan shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-7 pb-7">
              <button
                onClick={() => openForm("Premium")}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 text-brand-navy"
                style={{ background: 'linear-gradient(135deg, #22d3ee, #2563eb)', boxShadow: '0 0 24px rgba(34,211,238,0.25)' }}
              >
                Aplicar a Nivel Premium
              </button>
            </div>
          </motion.div>

          {/* Nivel 3 — Masterclass */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col rounded-2xl overflow-hidden card-glow-hover"
            style={{ background: '#05091a', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="px-7 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="section-label mb-3 block">Nivel 03</span>
              <h3 className="text-2xl font-bold mb-1">Mentoría Masterclass</h3>
              <p className="text-brand-cyan text-xs font-mono uppercase tracking-widest">Dominio Total</p>
            </div>
            <div className="p-7 flex-grow">
              <p className="text-sm text-text-muted mb-5 leading-relaxed">Para quien quiere inmersión completa y dominio profundo de toda la metodología.</p>
              <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs font-mono text-text-muted mb-1 uppercase tracking-wider">Transformación:</p>
                <p className="text-sm text-slate-200 leading-relaxed">De depender de terceros → a dominar una metodología integral y monetizable.</p>
              </div>
              <ul className="space-y-2.5">
                {["Inmersión total en performance.", "Estrategias omnicanal avanzadas.", "Dominio de IA aplicada al negocio."].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-text-muted">
                    <CheckCircle2 size={13} className="text-brand-cyan shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-7 pb-7">
              <button
                onClick={() => openForm("Master")}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:border-brand-blue/50 hover:text-white"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#8892a4', background: 'transparent' }}
              >
                Aplicar a Masterclass
              </button>
            </div>
          </motion.div>
        </div>

        {/* 9. ELITE — servicio Done For You */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-10 relative z-10 rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.05), rgba(37,99,235,0.05))', border: '1px solid rgba(34,211,238,0.2)' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 blue-glow" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}>
                <Star className="text-white" size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold">Implementación Elite</h3>
                  <span className="tag-pill">Done For You</span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed max-w-md">
                  Delegue completamente la ejecución. Gestionamos sus campañas de alto presupuesto aplicando toda la metodología Métricas IA™ por usted.
                </p>
              </div>
            </div>
            <div className="text-center md:text-right shrink-0">
              <div className="mb-1">
                <span className="text-3xl font-display font-bold text-white">$1,000</span>
                <span className="text-sm text-text-muted ml-1">USD / mes</span>
              </div>
              <p className="text-xs text-text-muted mb-4 font-mono">Alto presupuesto · Ejecución estratégica</p>
              <button
                onClick={() => setModalType("elite")}
                className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer text-brand-navy"
                style={{ background: '#22d3ee', boxShadow: '0 0 24px rgba(34,211,238,0.2)' }}
              >
                Solicitar Diagnóstico Gratis
              </button>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* 10. AUTORIDAD Y PRUEBA SOCIAL */}
      <Section style={{ background: '#05091a', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="gradient-line w-12" />
            <span className="section-label">09 / Resultados Reales</span>
            <div className="gradient-line w-12" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-3">Resultados y Transformaciones</h2>
          <p className="text-text-muted text-base">Lo que ocurre cuando la estrategia reemplaza a la improvisación.</p>
        </div>

        {/* Stats en marquee / grid */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {[
            { tag: "E-commerce · Moda", result: "6.5x", unit: "ROAS", desc: "Marca que duplicó su inversión y mantuvo escala estable por 4 meses.", color: '#22d3ee' },
            { tag: "Servicios · B2B", result: "−40%", unit: "CPL", desc: "Consultoría que bajó su costo por lead sin tocar el presupuesto.", color: '#2563eb' },
            { tag: "Infoproducto · Latam", result: "6", unit: "Cifras USD", desc: "Lanzamiento de curso aplicando la metodología Métricas IA™ completa.", color: '#22d3ee' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="p-7 rounded-2xl group cursor-default"
              style={{ background: '#020617', border: `1px solid ${item.color}18` }}
            >
              <div className="section-label mb-4" style={{ color: item.color }}>{item.tag}</div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-display font-bold text-white leading-none">{item.result}</span>
                <span className="text-base font-mono pb-1" style={{ color: item.color }}>{item.unit}</span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonio */}
        <div className="max-w-3xl mx-auto p-10 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(34,211,238,0.04))', border: '1px solid rgba(37,99,235,0.2)' }}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -z-0" style={{ background: 'rgba(37,99,235,0.06)' }} />
          {/* Stars */}
          <div className="flex gap-1 mb-5 justify-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-brand-cyan fill-brand-cyan" />
            ))}
          </div>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-7 text-center italic relative z-10">
            "Antes sentía que Meta Ads era un casino. Ahora entiendo exactamente por qué mis campañas funcionan y cómo escalarlas sin miedo. La claridad que da el método no tiene precio."
          </p>
          <div className="flex items-center justify-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: '2px solid rgba(34,211,238,0.3)' }}>
              <img src="https://picsum.photos/seed/user1/100/100" alt="Testimonio" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <p className="font-bold text-white">Carlos Méndez</p>
              <p className="text-xs text-text-muted font-mono">Dueño de Negocio · Tech Solutions</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 11. FAQ PERSUASIVO */}
      <Section style={{ background: '#020617' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="gradient-line w-12" />
              <span className="section-label">10 / FAQ</span>
              <div className="gradient-line w-12" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">Preguntas Frecuentes</h2>
          </div>
          <div className="space-y-1">
            {[
              { q: "¿Esto es para mí si nunca he hecho anuncios?", a: "Sí. El Nivel Base está diseñado para construir los cimientos correctos desde cero y evitar que pierda dinero por errores de principiante." },
              { q: "¿Y si ya probé anuncios y no funcionó?", a: "La mayoría falla por falta de estructura. Aquí aprenderá a pensar estratégicamente — no solo a 'picar botones'. Auditamos lo que falló y construimos una ruta rentable." },
              { q: "¿Cómo sé qué nivel necesito?", a: "Al hacer clic en el botón principal, evaluamos su etapa actual (presupuesto, experiencia, objetivos) y le recomendamos el nivel ideal para su caso." },
              { q: "¿Me sirve para aplicarlo a mi propio negocio?", a: "Es el objetivo principal. El 80% de nuestros alumnos son dueños de negocio que quieren dejar de depender de terceros y tomar el control de sus resultados." },
              { q: "¿También sirve si quiero ofrecer este servicio a clientes?", a: "Totalmente. Al dominar la metodología, tendrá un activo de alto valor para vender como especialista en performance a otros negocios." },
              { q: "¿Qué diferencia hay entre esto y una agencia?", a: "Una agencia ejecuta por usted (y a veces lo mantiene a oscuras). Nosotros le damos el criterio y la metodología para que usted sea el dueño del conocimiento y los resultados." },
              { q: "¿Qué incluye Implementación Elite?", a: "Es nuestro servicio Done-For-You. Aplicamos toda la metodología gestionando sus campañas de alto presupuesto mientras usted se enfoca en escalar su operación." },
              { q: "¿Voy a recibir acompañamiento real?", a: "Sí. No es contenido grabado solo. Dependiendo del nivel, tiene sesiones, soporte directo y comunidad de estrategas para que nunca enfrente un problema solo." },
            ].map((faq, i) => (
              <div key={i}>
                <FAQItem question={faq.q} answer={faq.a} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 12. CIERRE FINAL */}
      <Section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #020617 0%, #040d2a 50%, #020617 100%)' }}>
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.12), transparent 70%)' }} />

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="gradient-line w-16" />
            <span className="section-label">11 / Tome la Decisión</span>
            <div className="gradient-line w-16" />
          </div>

          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 uppercase leading-[1.05] tracking-tight">
            Su publicidad no necesita<br />
            <span className="text-gradient-brand">más improvisación.</span>
          </h2>

          <p className="text-lg md:text-xl text-text-muted mb-4 leading-relaxed max-w-2xl mx-auto">
            Necesita método, criterio y una ruta clara. Cada día que improvisa es otro día que su competencia escala con datos.
          </p>
          <p className="text-base text-text-muted mb-12 font-mono opacity-60">
            — La única decisión incorrecta es no tomar ninguna.
          </p>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => openForm()}
              className="group px-12 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 text-white"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 0 40px rgba(37,99,235,0.3), 0 0 80px rgba(37,99,235,0.1)' }}
            >
              Quiero ver qué nivel es para mí
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-slate-500 font-mono">Sin compromisos · Evaluación personalizada · Respuesta en 24h</p>
          </div>

          {/* Trust bar */}
          <div className="mt-16 pt-8 flex flex-wrap items-center justify-center gap-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { label: "Metodología probada", icon: <ShieldCheck size={14} /> },
              { label: "Acompañamiento real", icon: <Users size={14} /> },
              { label: "IA aplicada al negocio", icon: <Cpu size={14} /> },
              { label: "Resultados medibles", icon: <BarChart3 size={14} /> },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                <span className="text-brand-cyan">{t.icon}</span>
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-10 px-6" style={{ background: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #22d3ee)' }}>
                <BrainCircuit size={16} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-sm">Métricas IA™</span>
                <p className="text-xs text-text-muted font-mono">Metodología de Escala</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-xs text-text-muted font-mono">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Soporte</a>
            </div>

            {/* Copyright */}
            <p className="text-xs text-text-muted font-mono opacity-50">
              © 2026 Métricas IA · Todos los derechos reservados
              <span className="ml-3 opacity-40">v{CONFIG.VERSION}</span>
            </p>
          </div>
        </div>
      </footer>
      <Modal isOpen={modalType === "lead"} onClose={() => setModalType(null)}>
        <LeadForm onClose={() => setModalType(null)} selectedPlan={selectedPlan} />
      </Modal>
      
      <Modal isOpen={modalType === "elite"} onClose={() => setModalType(null)}>
        <EliteForm onClose={() => setModalType(null)} />
      </Modal>
    </div>
  );
}
