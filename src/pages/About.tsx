import React from 'react';
import { Heart, Users, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
       <section className="bg-gradient-to-r from-versyo-dark to-versyo-primary text-white py-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-center"
                 >
                   <h1 className="text-4xl md:text-5xl font-bold mb-4">
                     Sobre Nosotros
                   </h1>
                   <p className="text-xl text-white/90 max-w-2xl mx-auto">
                   </p>
                 </motion.div>
               </div>
             </section>

      {/* Quienes Somos Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <Heart className="w-16 h-16 text-versyo-primary" />
              </div>
              <h2 className="text-4xl font-bold text-zinc-800 mb-6">¿Quienes Somos?</h2>
            </div>

            <div className="prose prose-lg max-w-none space-y-6 text-zinc-700 leading-relaxed">
              <p className="text-xl">
                Nacimos con una idea clara: <strong>vestir la versatilidad de cada persona</strong>, respetando su esencia, 
                su estilo, comodidad y su forma unica de ser.
              </p>

              <p>
                Somos una marca urbana hecha para quienes se atreven a mezclar comodidad con actitud, y que entienden 
                que vestirse tambien es una forma de hablarle al mundo. Cada prenda que disenamos busca algo mas que 
                verse bien: <strong>quiere hacerte sentir tu</strong>.
              </p>

              <div className="bg-gradient-to-br from-versyo-dark to-versyo-deep text-white rounded-xl p-8 my-8">
                <p className="text-center text-xl font-semibold mb-4">
                  No hay reglas, solo un plan.
                </p>
                <p className="text-center text-lg">
                  Estamos en todas lados: en la calle, la musica, el arte, en lo de siempre.
                </p>
              </div>

              <p className="text-lg">
                Y sobre todo, nos inspira la gente que se viste con conviccion.
              </p>

              <div className="text-center py-8">
                <p className="text-2xl font-bold text-versyo-dark mb-2">Tu forma. Tu estilo. Tu ropa.</p>
                <p className="text-3xl font-bold text-versyo-primary">Versyo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Redes Sociales Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Users className="w-16 h-16 text-versyo-primary" />
            </div>
            <h2 className="text-4xl font-bold text-zinc-800 mb-8">Siguenos</h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="https://www.instagram.com/versyo.store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-versyo-dark to-versyo-accent text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Instagram className="w-6 h-6" />
                <span className="font-semibold">@versyo.store</span>
              </a>
              
              <a
                href="https://www.tiktok.com/@versyo.store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-versyo-primary to-versyo-accent text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span className="font-semibold">@versyo.store</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
