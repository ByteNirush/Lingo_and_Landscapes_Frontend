import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import heroBgImage from '../assets/1.jpg';
import heroBgImage2 from '../assets/2.jpg';
import heroBgImage3 from '../assets/3.jpg';

const heroImages = [heroBgImage, heroBgImage2, heroBgImage3];

const features = [
  {
    icon: '🗓️',
    title: 'Flexible Session Booking',
    desc: 'Pick slots that match your routine and reserve your 1-on-1 class in seconds.',
  },
  {
    icon: '🎥',
    title: 'Meet-Based Live Lessons',
    desc: 'Use your Google Meet link to join instantly from laptop, tablet, or phone.',
  },
  {
    icon: '🗣️',
    title: 'Native Conversation Focus',
    desc: 'Practice authentic everyday Nepali with guidance on pronunciation and tone.',
  },
  {
    icon: '🧠',
    title: 'Beginner to Confident',
    desc: 'Start with basics and gradually move toward smooth real-life conversations.',
  },
];

const journey = [
  { n: '01', title: 'Create Account', desc: 'Sign up and set up your profile in under a minute.' },
  { n: '02', title: 'Pick a Slot', desc: 'Browse upcoming sessions and pick your best time.' },
  { n: '03', title: 'Confirm Booking', desc: 'Reserve your class and keep the session in your calendar.' },
  { n: '04', title: 'Join & Speak', desc: 'Open your Meet link and practice live with your teacher.' },
];

const testimonials = [
  {
    quote: 'I have been learning Nepali with Shishab from Lingo & Landscapes for about a month now, and I couldn\'t be happier. Shishab is an incredibly engaging and fun teacher, which is exactly what I need to stay motivated. Beyond the language, he is deeply knowledgeable about Nepali culture and customs, making every class feel like a cultural journey rather than just a grammar lesson. He is supportive, professional, and makes learning feel easy. Highly recommended for anyone wanting to truly understand Nepal',
    name: 'Ka Sia',
    avatarUrl: 'https://lh3.googleusercontent.com/a-/ALV-UjUqZ8RN9zMTnTdvWx-KBXjwxlraAc9Gqa8VGXLpTHFzj0xdZoM=w144-h144-p-rp-mo-ba2-br100',
    avatar: 'K',
    reviews: 11,
    photos: 4,
    posted: '3 months ago',
    rating: 5,
    reviewUrl: 'https://share.google/jb7aGazfAMjdw8URE',
  },
  {
    quote: 'I have been having lessons with Shishab to improve my Nepali and have enjoyed them a lot so far. He takes his time to explain topics in detail and makes sure that our learning goals are met. His knowledge of the Nepali language and culture is very inspiring. I can highly recommend his lessons! Dhanyavaad, Shishab ji ;-)',
    name: 'Jeanine Eberle',
    avatar: 'J',
    reviews: 6,
    photos: 1,
    posted: '5 months ago',
    rating: 5,
    reviewUrl: 'https://share.google/I9sA31abSdStjEc5K',
  },
  {
    quote: 'I was VERY happy with my progress after studying Nepali with Mr Shrestha intensively for one year, 5 hours a week. His personality and sense of humor made our study times fun and meaningful, as we focused almost exclusively on conversation. We visited the city, made panni puri, had family meals, watched Nepali movies, went through local markets, rode busses, and so much more. I appreciated his flexibility to my unusual learning approach and his excellent English skills. He always responded to me night and day when I had questions or needed help.',
    name: 'Daniel Hobbs',
    avatarUrl: 'https://lh3.googleusercontent.com/a-/ALV-UjXLtKTS9V06u37jWdjcl5mSdx5J1vMJXLv217e2vFUdy_gTntfn=w144-h144-p-rp-mo-ba2-br100',
    avatar: 'D',
    reviews: 18,
    photos: 9,
    posted: '1 year ago',
    rating: 5,
    reviewUrl: 'https://share.google/OfDf2Ms5IEQf9SZBW',
  },
];

const faqItems = [
  { q: 'Do I need any prior knowledge of Nepali?', a: 'No prior knowledge is required! We offer classes starting from the absolute basics, covering the alphabet and simple everyday phrases.' },
  { q: 'How are classes conducted?', a: 'Classes are conducted live over Google Meet. You and your tutor will interact face-to-face in a structured 1-on-1 session.' },
  { q: 'What timezone are classes in?', a: 'Our system automatically handles timezone conversions, showing you available slots in your local timezone.' },
  { q: 'Can I cancel a booking?', a: 'Yes, you can cancel or reschedule a booking up to 24 hours in advance without any penalty.' },
  { q: 'How many students are in each class?', a: 'All our sessions are 1-on-1 private tutoring to ensure maximum speaking practice and personalized feedback.' },
  { q: 'What do I need to join a class?', a: 'You just need a stable internet connection, a microphone, and a device (computer, tablet, or phone) that can run Google Meet.' },
];

export default function HomePage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeHeroImage, setActiveHeroImage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  const handleContactSubmit = (event) => {
    event.preventDefault();
    toast.success('Thanks for reaching out. We will get back to you soon.');
    event.currentTarget.reset();
  };

  return (
    <div className="fade-in pb-16">
      <section className="relative isolate overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              activeHeroImage === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        <div className="shell relative z-10 py-20 md:py-32 lg:py-40">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90">
                <span>🇳🇵</span>
                Live Nepali Learning Platform
              </div>

              <h1 className="font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl">
                Learn Nepali with real conversations, not just memorized words.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 md:text-lg">
                Book private sessions with native speakers, get direct feedback, and build fluency that actually works in daily life.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {isAuthenticated && !isAdmin ? (
                  <Link to="/slots" className="btn-primary px-7 py-3 text-base">Browse Slots</Link>
                ) : isAdmin ? (
                  <Link to="/admin" className="btn-primary px-7 py-3 text-base">Go to Admin</Link>
                ) : (
                  <>
                    <Link to="/signup" className="btn-primary px-7 py-3 text-base">Start Free</Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-7 py-3 text-base font-semibold text-white transition hover:bg-white/20"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-slate-900/35 p-6 text-white shadow-2xl shadow-black/20 backdrop-blur-xl md:p-7">
              <div className="section-label text-crimson-300">Today in Class</div>
              <div className="mt-2 text-2xl font-display">नमस्ते! तपाईंलाई कस्तो छ?</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">
                Learn greetings, introductions, and practical phrases you can use in your next conversation.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                  <div className="text-slate-300">Avg Session</div>
                  <div className="mt-1 text-lg font-bold">60 min</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-3">
                  <div className="text-slate-300">Format</div>
                  <div className="mt-1 text-lg font-bold">1-on-1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="shell mt-20 scroll-mt-32 md:mt-32">
        <div className="mb-10 text-center">
          <div className="section-label">About Us</div>
          <h2 className="mt-4 font-display text-4xl font-bold text-nepal-dark">
            A Language Platform Built for Explorers
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-500 leading-relaxed text-center">
            Lingo and Landscapes is a leading Nepali language training and cultural travel company based in Nepal, 
            dedicated to helping foreigners learn Nepali and experience authentic local culture.
          </p>
          <div className="mt-6">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-crimson-200 bg-crimson-50 px-6 py-2.5 text-sm font-semibold text-crimson-600 transition hover:bg-crimson-100"
            >
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="card-soft group flex flex-col border-l-4 border-crimson-500 transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-crimson-50 text-crimson-500 transition group-hover:bg-crimson-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
            </div>
            <h3 className="mb-3 text-lg font-bold text-nepal-dark">International Students</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Learners from 40+ countries join our classes with automatic timezone conversion.
            </p>
          </article>

          <article className="card-soft group flex flex-col border-l-4 border-crimson-500 transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-crimson-50 text-crimson-500 transition group-hover:bg-crimson-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className="mb-3 text-lg font-bold text-nepal-dark">Native Tutors</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              Every instructor is a certified Nepali language teacher based in Nepal.
            </p>
          </article>

          <article className="card-soft group flex flex-col border-l-4 border-crimson-500 transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-crimson-50 text-crimson-500 transition group-hover:bg-crimson-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            <h3 className="mb-3 text-lg font-bold text-nepal-dark">Structured Curriculum</h3>
            <p className="text-sm leading-relaxed text-slate-500">
              From Devanagari script basics to conversational fluency — three clear levels.
            </p>
          </article>
        </div>
      </section>

      <section id="services" className="shell mt-20 scroll-mt-32 md:mt-32">
        <div className="mb-10 text-center">
          <div className="section-label">Our Services</div>
          <h2 className="mt-4 font-display text-4xl font-bold text-nepal-dark">
            Visa Support Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500 leading-relaxed text-center">
            Professional visa guidance and documentation support for staying and studying in Nepal.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article className="card group hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-crimson-50 p-3 text-2xl transition group-hover:bg-crimson-100">🎓</div>
            <h3 className="text-base font-bold text-nepal-dark">Student Visa</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Guidance for students seeking to study in Nepal with complete documentation support.
            </p>
          </article>

          <article className="card group hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-crimson-50 p-3 text-2xl transition group-hover:bg-crimson-100">💼</div>
            <h3 className="text-base font-bold text-nepal-dark">Business Visa</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Comprehensive support for entrepreneurs and business professionals entering Nepal.
            </p>
          </article>

          <article className="card group hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-crimson-50 p-3 text-2xl transition group-hover:bg-crimson-100">📈</div>
            <h3 className="text-base font-bold text-nepal-dark">Investment Visa</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Specialized assistance for investors looking to establish ventures in Nepal.
            </p>
          </article>

          <article className="card group hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-crimson-50 p-3 text-2xl transition group-hover:bg-crimson-100">🔧</div>
            <h3 className="text-base font-bold text-nepal-dark">Working Visa</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              End-to-end support for professionals seeking employment opportunities in Nepal.
            </p>
          </article>

          <article className="card group hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 inline-flex rounded-xl bg-crimson-50 p-3 text-2xl transition group-hover:bg-crimson-100">🌍</div>
            <h3 className="text-base font-bold text-nepal-dark">NRN Visa</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Dedicated services for Non-Resident Nepalis returning or staying in Nepal.
            </p>
          </article>
        </div>
      </section>

      <section id="how-it-works" className="shell mt-20 scroll-mt-32 md:mt-32">
        <div className="mb-8 text-center">
          <div className="section-label">Why Learners Love It</div>
          <h2 className="page-title mt-3">Designed for practical fluency</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => (
            <article key={item.title} className="card group hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-xl bg-crimson-50 p-3 text-2xl transition group-hover:bg-crimson-100">{item.icon}</div>
              <h3 className="text-base font-bold text-nepal-dark">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell mt-20 md:mt-32">
        <div className="card-soft border-slate-300 bg-linear-to-br from-white to-slate-100/70 p-6 md:p-8">
          <div className="mb-7 text-center">
            <div className="section-label">Your Learning Journey</div>
            <h2 className="page-title mt-3">From signup to speaking confidence</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {journey.map((step) => (
              <div key={step.n} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="font-display text-3xl text-crimson-500">{step.n}</div>
                <h3 className="mt-2 text-sm font-bold uppercase tracking-wide text-nepal-dark">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to={isAuthenticated ? '/slots' : '/signup'} className="btn-primary px-8 py-3 text-base">
              {isAuthenticated ? 'Book Your Next Session' : 'Create Your Free Account'}
            </Link>
          </div>
        </div>
      </section>

      <section id="testimonials" className="shell mt-20 scroll-mt-32 md:mt-32">
        <div className="mb-10 text-center">
          <div className="section-label">Testimonials</div>
          <h2 className="mt-4 font-display text-4xl font-bold text-nepal-dark">What learners are saying</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={`${item.name} profile`}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                      {item.avatar}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-nepal-dark">{item.name}</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {item.reviews} reviews{item.photos ? ` • ${item.photos} photos` : ''}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Google</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="text-[15px] leading-none tracking-[0.06em] text-amber-500">{'★'.repeat(item.rating)}</div>
                <span className="text-xs text-slate-500">{item.posted}</span>
              </div>

              <p className="mt-3 text-[14px] leading-6 text-slate-700">{item.quote}</p>

              {item.reviewUrl && (
                <div className="mt-4 flex justify-end">
                  <a
                    href={item.reviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-crimson-600 hover:text-crimson-700 hover:underline"
                  >
                    View on Google
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="https://www.google.com/maps/place/Lingo+%26+Landscapes/@27.648653,85.3420765,17z/data=!4m8!3m7!1s0x39eb17a4e6aa00f7:0x2483c383b071e02a!8m2!3d27.648653!4d85.3420765!9m1!1b1!16s%2Fg%2F11mvrp18kc?hl=en-NP&entry=ttu&g_ep=EgoyMDI2MDMyOS4wIKXMDSoASAFQAw%3D%3D#:~:text=Overview-,Reviews,-About"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-nepal-dark hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Read more reviews on Google
          </a>
        </div>
      </section>

      <section id="faq" className="shell mt-20 scroll-mt-32 md:mt-32">
        <div className="mb-10 text-center">
          <div className="section-label">FAQ</div>
          <h2 className="mt-4 font-display text-4xl font-bold text-nepal-dark">Common Questions</h2>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqItems.map((item, i) => (
            <div key={item.q} className="card-soft overflow-hidden p-0 transition hover:shadow-md">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-nepal-dark hover:bg-slate-50"
              >
                <span>{item.q}</span>
                <svg
                  className={`h-5 w-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {openFaq === i && (
                <div id={`faq-panel-${i}`} className="px-5 pb-5 text-sm leading-relaxed text-slate-500">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="shell my-20 scroll-mt-32 md:my-32">
        <div className="mb-10 text-center">
          <div className="section-label">Contact</div>
          <h2 className="mt-4 font-display text-4xl font-bold text-nepal-dark">Get in Touch</h2>
        </div>
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-bold text-nepal-dark">Have questions?</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Whether you're curious about our courses, scheduling, or anything else — we're happy to help.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <svg className="h-5 w-5 text-crimson-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                hello@lingoandlandscape.com
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <svg className="h-5 w-5 text-crimson-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Kathmandu, Nepal
              </div>
            </div>
          </div>
          
          <div className="card-soft">
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <div>
                <input type="text" placeholder="Your name" className="input-field shadow-sm" required />
              </div>
              <div>
                <input type="email" placeholder="Your email" className="input-field shadow-sm" required />
              </div>
              <div>
                <textarea rows="4" placeholder="Your message" className="input-field shadow-sm" required></textarea>
              </div>
              <button type="submit" className="btn-primary w-full py-3 shadow-sm">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
