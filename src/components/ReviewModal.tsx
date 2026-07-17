import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Upload, Image as ImageIcon, CheckCircle2, User, Globe2 } from 'lucide-react';
import { Testimonial } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: Omit<Testimonial, 'id'>) => void;
}

const COUNTRIES = [
  { name: 'Venezuela', flag: '🇻🇪' },
  { name: 'Colombia', flag: '🇨🇴' },
  { name: 'México', flag: '🇲🇽' },
  { name: 'España', flag: '🇪🇸' },
  { name: 'Estados Unidos', flag: '🇺🇸' },
  { name: 'Chile', flag: '🇨🇱' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Perú', flag: '🇵🇪' },
  { name: 'Ecuador', flag: '🇪🇨' },
  { name: 'República Dominicana', flag: '🇩🇴' },
  { name: 'Canadá', flag: '🇨🇦' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Italia', flag: '🇮🇹' },
  { name: 'Otro', flag: '🌎' },
];

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmitReview }) => {
  const [name, setName] = useState('');
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
  const [customCountry, setCustomCountry] = useState('');
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  
  // Image upload states
  const [image, setImage] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success screen state
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset all states
  const resetForm = () => {
    setName('');
    setSelectedCountryIndex(0);
    setCustomCountry('');
    setStars(5);
    setText('');
    setImage('');
    setIsSuccess(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRatingClick = (rating: number) => {
    setStars(rating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    if (!text.trim() || text.length < 10) return;

    const countryObj = COUNTRIES[selectedCountryIndex];
    const finalCountry = countryObj.name === 'Otro' && customCountry.trim() 
      ? customCountry.trim() 
      : countryObj.name;
    const finalFlag = countryObj.flag;

    onSubmitReview({
      name: name.trim(),
      country: finalCountry,
      flag: finalFlag,
      stars,
      text: text.trim(),
      image: image || undefined,
    });

    setIsSuccess(true);
  };

  const handleCloseSuccess = () => {
    onClose();
    // delay reset slightly to let exit transition finish
    setTimeout(resetForm, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-[#020813]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Main Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-[#061426] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-55 flex flex-col my-auto"
          >
            {/* Soft decorative light circles */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-brand-accent/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-brand-secondary/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
              <div>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-white">
                  Deja tu Experiencia
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Tu valoración ayuda a otros migrantes a tomar decisiones informadas.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Switch */}
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="review-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Stars Rating selection */}
                    <div className="space-y-2 text-center py-2 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <label className="text-xs font-bold uppercase tracking-widest text-brand-accent block">
                        ¿Cómo calificarías tu experiencia?
                      </label>
                      <div className="flex items-center justify-center gap-1.5 mt-2">
                        {[1, 2, 3, 4, 5].map((starNum) => {
                          const isLit = hoveredStars !== null ? starNum <= hoveredStars : starNum <= stars;
                          return (
                            <button
                              key={starNum}
                              type="button"
                              onClick={() => handleRatingClick(starNum)}
                              onMouseEnter={() => setHoveredStars(starNum)}
                              onMouseLeave={() => setHoveredStars(null)}
                              className="p-1 cursor-pointer transform hover:scale-125 transition-transform duration-150"
                            >
                              <Star
                                className={`w-8 h-8 transition-colors duration-150 ${
                                  isLit
                                    ? 'fill-brand-accent text-brand-accent drop-shadow-[0_0_8px_rgba(231,153,35,0.4)]'
                                    : 'text-zinc-600'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[11px] font-medium text-zinc-400 block pt-1">
                        {stars === 5 ? 'Excelente (5 de 5)' :
                         stars === 4 ? 'Muy buena (4 de 5)' :
                         stars === 3 ? 'Aceptable (3 de 5)' :
                         stars === 2 ? 'Regular (2 de 5)' : 'Insatisfecho (1 de 5)'}
                      </span>
                    </div>

                    {/* Drag and Drop Profile Image Uploader */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-300 block uppercase tracking-wider">
                        Tu Foto de Perfil (Opcional)
                      </label>
                      
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileSelect}
                        className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                          dragActive
                            ? 'border-brand-accent bg-brand-accent/5'
                            : image
                            ? 'border-emerald-500/30 bg-emerald-500/[0.02] hover:border-emerald-500/50'
                            : 'border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {image ? (
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500 flex-shrink-0 shadow-lg">
                              <img src={image} alt="Vista previa de perfil" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left flex-grow">
                              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Foto cargada con éxito!
                              </p>
                              <p className="text-[10px] text-zinc-400 mt-0.5">
                                Haz clic o arrastra otra imagen para cambiarla.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImage('');
                              }}
                              className="text-[10px] text-zinc-500 hover:text-red-400 font-bold uppercase tracking-wider px-2 py-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                            >
                              Quitar
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 border border-white/10">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-zinc-300">
                                Arrastra tu foto de perfil aquí o <span className="text-brand-accent underline">búscala en tu equipo</span>
                              </p>
                              <p className="text-[10px] text-zinc-500 mt-1">
                                Formatos permitidos: JPG, PNG, WEBP.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Name input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300 block uppercase tracking-wider">
                        Nombre Completo / Iniciales
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ej: María G., Carlos R."
                          className="w-full bg-[#030914] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all font-light"
                        />
                      </div>
                    </div>

                    {/* Country Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300 block uppercase tracking-wider">
                          País de Origen
                        </label>
                        <div className="relative">
                          <Globe2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <select
                            value={selectedCountryIndex}
                            onChange={(e) => setSelectedCountryIndex(parseInt(e.target.value))}
                            className="w-full bg-[#030914] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-accent/50 transition-all font-light appearance-none"
                          >
                            {COUNTRIES.map((country, idx) => (
                              <option key={country.name} value={idx}>
                                {country.flag} &nbsp; {country.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/10 pl-2">
                            <span className="text-[10px] text-brand-accent font-bold">
                              {COUNTRIES[selectedCountryIndex].flag}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Custom Country if "Otro" is selected */}
                      {COUNTRIES[selectedCountryIndex].name === 'Otro' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 block uppercase tracking-wider">
                            ¿Cuál es tu país?
                          </label>
                          <input
                            type="text"
                            required
                            value={customCountry}
                            onChange={(e) => setCustomCountry(e.target.value)}
                            placeholder="Ej: Uruguay, Panamá"
                            className="w-full bg-[#030914] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-accent/50 transition-all font-light"
                          />
                        </div>
                      )}
                    </div>

                    {/* Testimonial description */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-zinc-300 block uppercase tracking-wider">
                          Tu Experiencia / Reseña
                        </label>
                        <span className={`text-[10px] font-semibold ${text.length >= 10 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                          {text.length} carácteres (mín. 10)
                        </span>
                      </div>
                      <textarea
                        required
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Cuéntanos con tus propias palabras cómo fue el acompañamiento de la Abogada Daniela Harrington..."
                        rows={4}
                        className="w-full bg-[#030914] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all font-light resize-none leading-relaxed"
                      />
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[10px] text-zinc-400 leading-normal bg-white/[0.01] p-3 rounded-lg border border-white/5 font-light">
                      * Al enviar tu reseña, autorizas a mostrar tu opinión, país y la imagen proporcionada de manera pública en nuestra sección de testimonios de éxito para inspirar a otros miembros de la comunidad migrante.
                    </p>

                    {/* Action buttons */}
                    <div className="pt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-widest border border-white/10 transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={!name.trim() || text.length < 10}
                        className="flex-1 py-3 bg-brand-accent hover:bg-[#d9a944] text-brand-blue disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-brand-accent/15"
                      >
                        Enviar Reseña
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="review-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-10 space-y-6"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-heading text-xl font-bold text-white">
                        ¡Muchísimas gracias por tu testimonio!
                      </h4>
                      <p className="text-sm text-zinc-300 font-light max-w-sm mx-auto leading-relaxed">
                        Tu valiosa opinión ha sido registrada y ya se muestra en la sección de testimonios de nuestra web. Agradecemos enormemente tu confianza en la Abogada Daniela Harrington.
                      </p>
                    </div>

                    <div className="pt-4 max-w-xs mx-auto">
                      <button
                        onClick={handleCloseSuccess}
                        className="w-full py-3.5 bg-brand-accent text-brand-blue hover:bg-[#d9a944] rounded-xl text-xs font-bold uppercase tracking-widest shadow-md cursor-pointer transition-all"
                      >
                        Entendido
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
