import imageOne from '../assets/1.jpg';
import imageTwo from '../assets/2.jpg';
import imageThree from '../assets/3.jpg';

const galleryImages = [
  { src: imageOne, alt: 'Nepali class moment 1' },
  { src: imageTwo, alt: 'Nepali class moment 2' },
  { src: imageThree, alt: 'Nepali class moment 3' },
];

export default function GalleryPage() {
  return (
    <div className="shell py-12 md:py-16">
      <div className="mb-8 text-center md:mb-12">
        <div className="section-label">Gallery</div>
        <h1 className="mt-3 font-display text-4xl font-bold text-nepal-dark md:text-5xl">
          Moments from Lingo Landscape
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
          A quick look at our learning environment, student sessions, and cultural experiences.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {galleryImages.map((image) => (
          <article key={image.alt} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src={image.src}
              alt={image.alt}
              className="h-64 w-full object-cover transition duration-300 hover:scale-105"
              loading="lazy"
            />
          </article>
        ))}
      </div>
    </div>
  );
}
