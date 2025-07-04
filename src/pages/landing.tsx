import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Zap, Download, Image, Keyboard, Sliders, Cloud, Brain, Brush, Facebook, Twitter, Instagram, Github } from 'lucide-react';
import { Link } from 'react-router-dom';


interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface ShowcaseImage {
  prompt: string;
  style: string;
  image: string;
}

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const ImaginAILanding: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [particles, setParticles] = useState<Particle[]>([]);
  // Sample AI-generated image examples
  const sampleImages: string[] = [
    "Fantasy crystal castle floating in purple clouds",
    "Cyberpunk neon cityscape with flying cars",
    "Abstract digital art with flowing colors",
    "Photorealistic mountain lake at sunset"
  ];

  const showcaseImages: ShowcaseImage[] = [
    { prompt: "Majestic dragon in ethereal mist", style: "Fantasy", image: "https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX" },
    { prompt: "Neon-lit cyberpunk samurai", style: "Cyberpunk", image: "https://www.esparklearning.com/app/uploads/2024/04/Albert-Einstein-generated-by-AI-1024x683.webp" },
    { prompt: "Flowing liquid gold abstraction", style: "Abstract", image: "https://news.ubc.ca/wp-content/uploads/2023/08/AdobeStock_559145847.jpeg" },
    { prompt: "Serene forest cathedral", style: "Photorealistic", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop" },
    { prompt: "Cosmic nebula with star formation", style: "Space Art", image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=500&fit=crop" },
    { prompt: "Art deco cityscape at twilight", style: "Vintage", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3ez6TFGptpmZRt7Cuyv3vfuCn294qY8MnnjpASG69ELO3vWFfcjfG_4PP8Y3rITFqjo4&usqp=CAU" }
  ];

  // Rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sampleImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2
    }));
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > 100 ? -5 : particle.y + particle.speed * 0.1
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className=" z-10 px-6 py-4 backdrop-blur-md bg-slate-900/80 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <div className="relative">
              <Brain className="w-8 h-8 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
              <Brush className="w-4 h-4 text-pink-400 absolute -bottom-1 -right-1 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ImaginAI
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {['Features', 'Showcase', 'How It Works'].map((item: string) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-purple-400 transition-colors duration-200 hover:scale-105 transform">
                {item}
              </a>
            ))}
          </nav>
          
          <div className='flex items-center space-x-4'>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
              Login
            </Button>
          </Link>

          <Link to="/signup">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
              Sign Up
            </Button>
          </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Turn{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  Words
                </span>{' '}
                into{' '}
                <span className="relative">
                  Masterpieces
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed">
                AI-powered image generation in seconds. No design skills needed.
                Transform your imagination into stunning visuals with cutting-edge AI.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 group">
                Generate Free Images →
                <Zap className="ml-2 w-5 h-5 group-hover:animate-bounce" />
              </Button>
              {/* <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300">
                See Live Demo
              </Button> */}
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 shadow-2xl border border-purple-500/20 backdrop-blur-sm">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Image className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Ready to Create?
                </h3>
                <p className="text-slate-300 mb-6">
                  Join thousands of creators using AI to bring their imagination to life
                </p>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  Start Creating Now →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Creative Minds
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to bring your imagination to life with AI-powered precision
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {([
              { icon: Palette, title: "50+ Art Styles", desc: "From photorealistic to abstract, anime to oil painting" },
              { icon: Image, title: "4K Resolution", desc: "Crystal-clear images perfect for any use case" },
              { icon: Zap, title: "Lightning Fast", desc: "Generate stunning images in under 10 seconds" },
              { icon: Download, title: "One-Click Export", desc: "Download in multiple formats instantly" }
            ] as Feature[]).map((feature: Feature, index: number) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-300">
                      <feature.icon className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Gallery */}
      <section id="showcase" className="px-6 py-20 bg-slate-800/50" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Showcase{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Gallery
              </span>
            </h2>
            <p className="text-xl text-slate-300">
              Discover what's possible with ImaginAI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {showcaseImages.map((image: ShowcaseImage, index: number) => (
              <div key={index} className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 aspect-square hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-105">
                <img 
                  src={image.image} 
                  alt={image.prompt}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 group-hover:from-purple-600/40 group-hover:to-pink-600/40 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent">
                  <p className="text-sm font-medium mb-1 text-white">{image.prompt}</p>
                  <span className="text-xs bg-purple-600/80 px-2 py-1 rounded-full text-white">{image.style}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transform hover:scale-105 transition-all duration-300">
              Load More Examples
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              How It{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-slate-300">
              Three simple steps to create amazing images
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {([
              { icon: Keyboard, title: "Type your prompt", desc: "Describe what you want to see in natural language" },
              { icon: Sliders, title: "Customize style", desc: "Choose from 50+ artistic styles and adjust settings" },
              { icon: Cloud, title: "Download & Share", desc: "Get your masterpiece in seconds, ready to use" }
            ] as Step[]).map((step: Step, index: number) => (
              <div key={index} className="text-center group">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  {/* <div className="absolute -top-10 -right-20 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                  </div> */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 opacity-30"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-400 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="relative">
                <Brain className="w-8 h-8 text-purple-400" />
                <Brush className="w-4 h-4 text-pink-400 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ImaginAI
                </span>
                <p className="text-sm text-slate-400">Where imagination meets pixels</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Github].map((Icon, index: number) => (
                <a key={index} href="#" className="p-2 bg-slate-800 rounded-full hover:bg-purple-600 transition-colors duration-300 transform hover:scale-110">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="text-center text-slate-400 text-sm">
            <p>&copy; 2025 ImaginAI. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default ImaginAILanding;