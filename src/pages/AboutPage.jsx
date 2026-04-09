import { Link } from 'react-router-dom';
import heroBgImage from '../assets/1.jpg';

export default function AboutPage() {
  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBgImage})` }}
        />
        <div className="absolute inset-0 z-0 bg-linear-to-r from-slate-900/80 to-slate-900/40" />
        
        <div className="shell relative z-10 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90">
              <span>🇳🇵</span>
              About Us
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
              Lingo and Landscapes
            </h1>
            <p className="mt-4 text-lg text-slate-200">
              Your gateway to learning Nepali and experiencing authentic Nepali culture
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="shell py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-slate-700">
              Lingo and Landscapes is a leading Nepali language training and cultural travel company based in Nepal, 
              dedicated to helping foreigners learn Nepali and experience authentic local culture. We specialize in 
              practical Nepali language classes, immersive travel experiences, and professional visa support services.
            </p>

            <p className="mt-6 leading-relaxed text-slate-600">
              With experience working with more than 1200 clients from over 63 countries, Lingo and Landscapes has 
              established a strong reputation for delivering high-quality, results-driven language training. Our 
              courses are designed to help learners communicate confidently in real-life situations, making them 
              ideal for travelers, expatriates, researchers, and professionals living or working in Nepal.
            </p>

            <p className="mt-6 leading-relaxed text-slate-600">
              In addition to language training, we offer curated cultural tours, guided travel experiences, and 
              local immersion programs that allow clients to explore Nepal's landscapes, traditions, and communities 
              in a meaningful way. Our approach combines language learning with real-world interaction, ensuring 
              faster progress and a deeper cultural understanding.
            </p>

            <p className="mt-6 leading-relaxed text-slate-600">
              We also provide visa guidance and support services to assist our clients in navigating the process 
              of staying and studying in Nepal. From consultation to documentation support, we help simplify the 
              process and ensure a smooth experience for our students and travelers.
            </p>

            <p className="mt-6 leading-relaxed text-slate-600">
              At Lingo and Landscapes, we are committed to delivering personalized services, flexible learning 
              options, and professional support that meets international standards. Our mission is to bridge 
              language barriers, support global travelers, and create meaningful cultural connections through 
              education, travel, and trusted services.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="card-soft text-center shadow-sm">
              <div className="font-display text-4xl font-bold text-crimson-500">1200+</div>
              <div className="mt-2 text-sm font-medium text-slate-600">Happy Clients</div>
            </div>
            <div className="card-soft text-center shadow-sm">
              <div className="font-display text-4xl font-bold text-crimson-500">63+</div>
              <div className="mt-2 text-sm font-medium text-slate-600">Countries Served</div>
            </div>
            <div className="card-soft text-center shadow-sm">
              <div className="font-display text-4xl font-bold text-crimson-500">Nepal</div>
              <div className="mt-2 text-sm font-medium text-slate-600">Based In</div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              to="/#about"
              className="btn-secondary gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
