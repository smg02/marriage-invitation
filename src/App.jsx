import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./lib/utils";
import "./index.css";
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Send,
  Mail,
  ChevronUp,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

// --- Envelope Component ---

const Envelope = ({ onOpen }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        opacity: 0,
        transition: { duration: 1.2, ease: [0.45, 0, 0.55, 1] }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#d4a373] overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]"
      style={{ 
        background: "radial-gradient(circle, #e6c8a8 0%, #d4a373 100%)" 
      }}
    >
      {/* Background Texture/Pattern */}
      <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/paper.png')` }}></div>
      
      {/* Decorative Corner Borders */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-black/20"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-black/20"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-black/20"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-black/20"></div>

      <div className="relative z-10 w-full max-w-lg px-8 flex flex-col items-center text-center">
        {/* Animated Icon */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-12 relative"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-24 bg-black/5 rounded-full flex items-center justify-center border border-black/10 shadow-[0_0_30px_rgba(0,0,0,0.05)]">
            <Mail size={40} className="text-black" strokeWidth={1} />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-black/80 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          ></motion.div>
        </motion.div>

        {/* Premium Typography */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="space-y-6"
        >
          <span className="text-black/60 text-xs uppercase tracking-[0.6em] font-bold block mb-4">You Are Cordially Invited To The Wedding Of</span>
          <h1 className="text-3xl sm:text-5xl text-black font-serif tracking-[0.15em] uppercase leading-tight font-bold">
            Syed Abdul Hakeem
          </h1>
          <div className="flex items-center justify-center gap-6">
            <div className="h-[1px] w-12 bg-black/20"></div>
            <span className="text-black font-serif text-2xl italic">&</span>
            <div className="h-[1px] w-12 bg-black/20"></div>
          </div>
          <h1 className="text-3xl sm:text-5xl text-black font-serif tracking-[0.15em] uppercase leading-tight font-bold">
            Salma M
          </h1>
        </motion.div>

        {/* Interactive Button */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 w-full"
        >
          <motion.button 
            onClick={onOpen}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-bold rounded-full bg-black/5 border border-black/30 shadow-2xl transition-all duration-300"
          >
            <span className="relative text-black text-xs sm:text-sm tracking-[0.5em] uppercase font-black">Open Invitation</span>
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -bottom-1"
            >
              <ChevronUp size={14} className="text-black/30" />
            </motion.div>
          </motion.button>
          <p className="mt-6 text-black/40 text-[9px] uppercase tracking-[0.3em] font-bold">Click to reveal</p>
        </motion.div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>
      <div className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-black/5 to-transparent"></div>
    </motion.div>
  );
};

// --- Site Components ---

const CountdownItem = ({ label, value }) => {
  return (
    <div className="text-center flex-1 max-w-[100px]">
      <div className="bg-white/90 backdrop-blur-sm aspect-square rounded-full flex items-center justify-center shadow-xl border border-gold/10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span 
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-2xl sm:text-3xl md:text-4xl font-light text-gold"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="text-[10px] uppercase tracking-widest mt-3 text-gray-600 font-bold">{label}</p>
    </div>
  );
};

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 sm:gap-6 md:gap-8 justify-center mt-12 px-2 w-full max-w-[450px]">
      <CountdownItem label="Days" value={timeLeft.days} />
      <CountdownItem label="Hrs" value={timeLeft.hours} />
      <CountdownItem label="Mins" value={timeLeft.minutes} />
      <CountdownItem label="Secs" value={timeLeft.seconds} />
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md py-4 shadow-sm">
      <div className="container mx-auto flex justify-center items-center px-4">
        <div className="text-sm sm:text-base md:text-xl font-bold tracking-[0.2em] sm:tracking-[0.4em] font-serif uppercase text-center text-gray-900">
          Syed Abdul Hakeem <span className="text-gold mx-1 sm:mx-2">♥</span> Salma M
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-fixed bg-center scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511210137754-071a9314483a?auto=format&fit=crop&q=80&w=2000')" }}
      >
        <div className="absolute inset-0 bg-white/30"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center w-full px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] aspect-square flex flex-col items-center justify-center text-center p-6 sm:p-10 border border-gold/10 bg-white/95 rounded-full shadow-2xl floating"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] mb-4 text-gray-500">Save the Date</span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl text-gold mb-1 sm:mb-2 font-serif uppercase leading-tight text-gray-900">Syed Abdul Hakeem</h1>
          <span className="text-lg italic my-1 font-serif text-gray-500">&</span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl text-gold mb-4 sm:mb-6 font-serif uppercase leading-tight text-gray-900">Salma M.</h1>
          
          <div className="border-y border-gold/20 py-2 sm:py-3 px-4 sm:px-8 flex items-center space-x-3 sm:space-x-4 mb-4">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-600">June</span>
            <span className="text-3xl sm:text-4xl font-light text-gold">01</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-600">2026</span>
          </div>
          
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-600 font-medium">MM Mahal • Melvisharam</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full flex justify-center"
        >
          <Countdown targetDate="2026-06-01T11:00:00" />
        </motion.div>
      </div>
    </section>
  );
};

const CoupleSection = () => {
  return (
    <section id="couple" className="py-20 sm:py-24 container mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="text-xl sm:text-2xl md:text-3xl font-serif text-gold mb-4 leading-relaxed tracking-wide">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-gray-600 mb-8 px-4 font-medium">In the name of Allah, the Most Gracious, the Most Merciful</p>
        
        <div className="max-w-2xl mx-auto space-y-4 text-gray-800 italic text-xs sm:text-sm md:text-base px-2">
          <p>"And among His signs is that He created for you spouses from among yourselves, that you may find tranquility in them."</p>
          <p className="font-serif text-gold font-bold">— Qur'an 30:21</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 sm:mb-20 max-w-2xl mx-auto px-4"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-6">With the blessings of Almighty Allah (SWT)</p>
        <p className="text-sm sm:text-base md:text-lg text-gray-800 tracking-widest uppercase leading-relaxed font-medium">Cordially invite you to the Nikah & Walima ceremony of their children</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 items-center max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="order-2 md:order-1"
        >
          <span className="text-gold text-[10px] font-bold uppercase tracking-widest border-b border-gold/20 pb-1 inline-block">The Groom</span>
          <h3 className="text-xl sm:text-2xl mt-4 mb-2 font-serif text-gray-900 font-bold uppercase">Syed Abdul Hakeem</h3>
          <p className="text-gray-700 text-[10px] uppercase tracking-widest leading-relaxed font-medium">
            s/o Janab Syed Kareem<br/>
            & Begum Shameemunnisa K
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="order-1 md:order-2 px-8 sm:px-0"
        >
          <div className="rounded-full overflow-hidden w-48 h-48 sm:w-56 sm:h-56 mx-auto border-4 border-white shadow-2xl relative">
            <div className="absolute inset-0 bg-gold/5 mix-blend-multiply"></div>
            <img 
              src="/quran_image.avif" 
              alt="Quran with flowers" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="order-3"
        >
          <span className="text-gold text-[10px] font-bold uppercase tracking-widest border-b border-gold/20 pb-1 inline-block">The Bride</span>
          <h3 className="text-xl sm:text-2xl mt-4 mb-2 font-serif text-gray-900 font-bold uppercase">Salma M.</h3>
          <p className="text-gray-700 text-[10px] uppercase tracking-widest leading-relaxed font-medium">
            d/o Janab Mohammed Jameel P K<br/>
            & Begum Jabeen Taj P K
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const EventCard = ({ title, date, hijri, time, venue, address, icon: Icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white p-8 sm:p-10 shadow-xl border-t-2 border-gold flex flex-col items-center text-center rounded-xl"
  >
    <div className="mb-6 text-gold/60 border border-gold/10 p-4 rounded-full bg-cream/30"><Icon size={28} strokeWidth={1} /></div>
    <h3 className="text-xl sm:text-2xl mb-2 font-serif text-gray-900 font-bold">{title}</h3>
    <p className="text-gold font-bold mb-3 tracking-widest uppercase text-[10px] sm:text-xs">{date}</p>
    {hijri && <p className="text-gray-600 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-6 font-bold">{hijri}</p>}
    
    <div className="space-y-4 w-full border-t border-gray-50 pt-8 flex flex-col items-center">
      <div className="flex items-center gap-3 text-gray-800 text-xs sm:text-sm font-bold">
        <Clock size={16} className="text-gold/60 shrink-0" />
        <span>{time}</span>
      </div>
      <div className="flex items-center gap-3 text-gray-800 text-xs sm:text-sm">
        <MapPin size={16} className="text-gold/60 shrink-0" />
        <div className="text-left">
          <span className="font-bold text-gray-900">{venue}</span>
          <p className="text-gray-600 text-[11px] font-bold leading-relaxed">{address}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const Events = () => {
  return (
    <section id="events" className="py-20 sm:py-24 bg-gray-50/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl uppercase tracking-[0.3em] mb-4 font-serif text-gray-900">When & Where</h2>
          <div className="w-10 h-[1px] bg-gold mx-auto opacity-50"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto">
          <EventCard 
            title="The Nikkah Ceremony"
            date="Monday, 1st June 2026"
            hijri="(14 Dhu-al-Hijjah, 1447 Hijri)"
            time="Insha Allah Nikah at 11:00 AM"
            venue="MM Mahal"
            address="Anna Salai, Kilvisharam, Ranipet Dist."
            icon={Calendar}
          />
          <EventCard 
            title="The Walima Lunch"
            date="Monday, 1st June 2026"
            time="Following Nikkah Ceremony"
            venue="MM Hall"
            address="Anna Salai, Kilvisharam, Ranipet Dist."
            icon={Heart}
          />
        </div>
      </div>
    </section>
  );
};

const RSVP = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('registrations')
        .insert([
          { 
            full_name: formData.fullName, 
            email: formData.email 
          }
        ]);

      if (supabaseError) throw supabaseError;
      
      setSubmitted(true);
    } catch (err) {
      console.error("RSVP Error Details:", err);
      setError(err.message || "Failed to confirm attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="rsvp" className="py-20 sm:py-24 container mx-auto px-6 max-w-lg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center bg-white p-8 sm:p-12 shadow-2xl border border-gold/5 rounded-3xl"
      >
        <p className="text-gray-600 text-[10px] mb-10 tracking-[0.2em] font-black uppercase">KINDLY RESPOND</p>
        
        {submitted ? (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="py-8">
            <Heart className="mx-auto text-gold mb-4 animate-pulse" size={40} fill="currentColor" />
            <p className="text-gold font-serif text-lg sm:text-xl font-bold">Jazakallah Khair!</p>
            <p className="text-gray-800 text-xs mt-2 tracking-wide uppercase font-black">Your attendance is confirmed.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            <div className="space-y-6">
              <div className="group">
                <label className="text-[9px] uppercase tracking-widest text-gold font-black mb-1 block opacity-0 group-focus-within:opacity-100 transition-opacity">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-gold outline-none transition-all text-sm placeholder:text-gray-400 font-bold"
                  placeholder="Full Name"
                  required
                  disabled={loading}
                />
              </div>
              <div className="group">
                <label className="text-[9px] uppercase tracking-widest text-gold font-black mb-1 block opacity-0 group-focus-within:opacity-100 transition-opacity">Email ID</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-200 py-2 focus:border-gold outline-none transition-all text-sm placeholder:text-gray-400 font-bold"
                  placeholder="Email ID"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{error}</p>}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 uppercase text-[10px] tracking-[0.3em] font-black hover:bg-gold transition-all duration-500 flex items-center justify-center gap-3 rounded-xl shadow-lg hover:shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={12} strokeWidth={3} />
              ) : (
                <Send size={12} strokeWidth={3} />
              )}
              {loading ? "Confirming..." : "Confirm Attendance"}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-16 border-t border-gold/5 text-center bg-white px-6">
      <div className="text-xl sm:text-2xl font-bold tracking-[0.4em] mb-4 font-serif uppercase text-gray-900">
        Syed Abdul Hakeem <span className="text-gold mx-1">♥</span> Salma M
      </div>
      <p className="text-gray-700 text-[10px] italic max-w-xs mx-auto leading-relaxed mb-10 font-bold">
        "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair."
      </p>
      <div className="flex justify-center items-center gap-4 mb-10 text-gold/20">
        <div className="w-10 h-[1px] bg-current"></div>
        <Heart size={14} />
        <div className="w-10 h-[1px] bg-current"></div>
      </div>
      <p className="text-gray-400 text-[8px] uppercase tracking-[0.5em] font-black">
        MAY ALLAH BLESS THIS UNION • 2026
      </p>
    </footer>
  );
};

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans selection:bg-gold/20 bg-cream">
      <AnimatePresence mode="wait">
        {!isOpen && <Envelope key="envelope" onOpen={() => setIsOpen(true)} />}
      </AnimatePresence>

      <motion.div
        animate={isOpen ? { opacity: 1, display: "block" } : { opacity: 0, display: "none" }}
        transition={{ duration: 1 }}
      >
        <Navbar />
        <main>
          <Hero />
          <CoupleSection />
          <Events />
          <RSVP />
        </main>
        <Footer />
      </motion.div>
    </div>
  );
}

export default App;
