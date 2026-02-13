import { Suspense } from 'react';
import Image from 'next/image';
import Slider from './components/Slider';
import ProductGrid from './components/ProductGrid';
import Typewriter from './components/Typewriter';
import Categories from './components/Categories';
import { ProductProvider } from './lib/ProductContext';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-12">
          <h1
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-cover bg-center mb-4"
            style={{
              backgroundImage: 'url(/banner-4.jpeg)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            Welcome to Our Store
          </h1>
          <Typewriter />
        </section>

        <section className="mb-12 flex flex-col lg:flex-row ">
          <div className="flex-1">
            <Slider />
          </div>
          <div className="flex flex-col  lg:w-1/3">
            <div className="w-full h-32 md:h-40 lg:h-48 relative shadow-lg">
              <Image
                src="/blog.jpeg"
                alt="Blog Image 1"
                fill
                sizes="(max-width: 1023px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="w-full h-32 md:h-40 lg:h-48 relative shadow-lg">
              <Image
                src="/blog2.jpeg"
                alt="Blog Image 2"
                fill
                sizes="(max-width: 1023px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <Suspense fallback={<div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
            <Categories />
          </Suspense>
        </section>

        <section className="mb-12">
          <ProductProvider>
            <Suspense fallback={<div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
              <ProductGrid/>
            </Suspense>
          </ProductProvider>
        </section>

      </main>
    </div>
  );
}
