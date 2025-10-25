
import React, { useState, useEffect } from 'react';
import { TEMPLATES } from '../constants';
import { LogoIcon, GithubIcon, LinkedinIcon, PowerBiIcon, TableauIcon } from './icons';

interface HomePageProps {
  onGetStarted: () => void;
}

const NavBar: React.FC<HomePageProps> = ({ onGetStarted }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/70 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#" className="flex items-center gap-2 cursor-pointer">
                    <LogoIcon className="h-8 w-8 text-blue-400" />
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        AutoBI
                    </span>
                </a>
                <div className="hidden md:flex items-center gap-8 text-gray-300">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#templates" className="hover:text-white transition-colors">Templates</a>
                    <a href="#demo" className="hover:text-white transition-colors">Demo</a>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={onGetStarted} className="px-4 py-2 text-sm rounded-md border border-transparent hover:border-white/20 hover:bg-white/10 transition-all">Login</button>
                    <button onClick={onGetStarted} className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md hover:opacity-90 transition-opacity">Sign Up</button>
                </div>
            </div>
        </nav>
    );
};

const HeroSection: React.FC<HomePageProps> = ({ onGetStarted }) => (
    <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gray-900">
             <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="z-10 px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-white leading-tight fade-in">
                Transform Your Data into <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Insightful Dashboards</span> Instantly
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 fade-in" style={{ animationDelay: '0.2s' }}>
                AutoBI uses AI to analyze your data and automatically generate stunning Power BI and Tableau dashboards — complete with visuals, summaries, and executive insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in" style={{ animationDelay: '0.4s' }}>
                <button onClick={onGetStarted} className="w-full sm:w-auto px-8 py-3 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300">
                    Try AutoBI Now →
                </button>
                <a href="#demo" className="w-full sm:w-auto px-8 py-3 font-semibold text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transform transition-colors duration-300">
                    Watch Demo →
                </a>
            </div>
        </div>
    </section>
);


const HowItWorksSection: React.FC = () => {
    const steps = [
        { title: "📂 Upload Your Data", description: "Securely upload your CSV or Excel file. We support various data structures and formats." },
        { title: "🤖 AI Analyzes & Understands", description: "Our AI profiles your data, identifies key metrics, and discovers hidden patterns." },
        { title: "📊 Select a Dashboard Template", description: "Choose from professionally designed templates that best fit your data's story." },
        { title: "🚀 AutoBI Generates Dashboard", description: "Instantly get a full dashboard with insights, ready to export for Power BI or Tableau." },
    ];
    return (
        <section id="features" className="py-20 container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">How It Works in 4 Simple Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <div key={index} className="glassmorphism p-6 rounded-xl text-center group transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10" style={{ perspective: '1000px' }}>
                        <div className="transition-transform duration-500 group-hover:-translate-y-2">
                            <h3 className="text-2xl font-semibold mb-4 text-white">{step.title}</h3>
                            <p className="text-gray-400">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const TemplateCarouselSection: React.FC = () => (
    <section id="templates" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-3 text-white">Stunning Dashboard Templates</h2>
            <p className="text-lg text-gray-400 text-center mb-12">AI-suggested themes to match your data's narrative.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {TEMPLATES.map((template) => (
                    <div key={template.name} className="glassmorphism rounded-xl p-4 flex flex-col items-center group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{borderColor: `${template.colors.primary}40`, '--glow-color': template.colors.primary} as React.CSSProperties}>
                        <div className="p-3 rounded-full mb-3 transition-colors" style={{ backgroundColor: `${template.colors.primary}20` }}>
                            <template.icon className="w-10 h-10 transition-transform group-hover:scale-110" style={{ color: template.colors.primary }} />
                        </div>
                        <h3 className="font-semibold text-center text-white">{template.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    </section>
);


const InsightsSection: React.FC = () => (
    <section id="demo" className="py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
                <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-400">Your Data. Our Intelligence.</h2>
                <p className="text-lg text-gray-300 mb-6">AutoBI does more than just visualize; it understands. Our AI engine provides:</p>
                <ul className="space-y-4 text-gray-300">
                    <li className="flex items-start"><span className="text-cyan-400 mr-3 mt-1 text-xl">◆</span> <strong>Smart Data Profiling:</strong> Automatically identifies data types, categories, and relationships.</li>
                    <li className="flex items-start"><span className="text-cyan-400 mr-3 mt-1 text-xl">◆</span> <strong>Auto Visualization Selection:</strong> Chooses the most effective chart types for your metrics.</li>
                    <li className="flex items-start"><span className="text-cyan-400 mr-3 mt-1 text-xl">◆</span> <strong>Insight Narratives Generation:</strong> Creates executive summaries and key takeaways in plain language.</li>
                </ul>
            </div>
            <div className="w-full h-80 glassmorphism rounded-xl flex items-center justify-center p-8 float-animation border border-white/10 shadow-2xl">
                <p className="text-gray-500 text-2xl">[ 3D Hologram Animation Placeholder ]</p>
            </div>
        </div>
    </section>
);

const TestimonialsSection: React.FC = () => {
    const testimonials = [
        { name: "Sarah J., Business Analyst", quote: "AutoBI cut my weekly reporting time from 5 hours to 30 minutes. The AI insights are scarily accurate and save me from digging through spreadsheets." },
        { name: "Mike R., Startup Founder", quote: "As a non-data person, this tool is a lifesaver. I uploaded our Stripe data and got a professional-looking dashboard that I could show to investors." },
        { name: "Elena K., Marketing Team", quote: "We use AutoBI to quickly visualize campaign performance. It's faster than any BI tool for quick, ad-hoc analysis. The Tableau export is seamless." },
    ];
    return (
         <section className="py-20 bg-gray-900/50">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-12 text-white">Trusted by Data Professionals</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="glassmorphism p-8 rounded-xl group transition-all duration-300 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/10" style={{ perspective: '1000px' }}>
                             <div className="transition-transform duration-500 group-hover:transform-[rotateY(2deg)_rotateX(-1deg)]">
                                <p className="text-gray-300 mb-4 italic">"{t.quote}"</p>
                                <p className="font-semibold text-blue-300 mt-6">- {t.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection: React.FC<HomePageProps> = ({ onGetStarted }) => (
    <section className="py-24 text-center">
        <div className="container mx-auto px-6 relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent rounded-full filter blur-3xl"></div>
            <h2 className="text-4xl font-bold mb-4 text-white">Ready to turn your data into stories?</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">Upload your first dataset and let AutoBI do the magic. Get started for free, no credit card required.</p>
            <button onClick={onGetStarted} className="px-10 py-4 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 glowing-border">
                Get Started Free
            </button>
        </div>
    </section>
);


const Footer: React.FC = () => (
    <footer className="bg-black/30 border-t border-white/10">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-2 text-white">AutoBI</h3>
                    <p className="text-gray-400">AI-Powered Data Intelligence</p>
                </div>
                <div className="flex gap-6">
                     <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
                     <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                     <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                </div>
                 <div className="flex items-center gap-4">
                    <p className="text-gray-400">Integrates with:</p>
                    <PowerBiIcon className="h-6 w-6 text-gray-500" />
                    <TableauIcon className="h-6 w-6 text-gray-500" />
                </div>
                <div className="flex gap-4">
                    <a href="#" aria-label="Github"><GithubIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors"/></a>
                    <a href="#" aria-label="LinkedIn"><LinkedinIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors"/></a>
                </div>
            </div>
            <div className="mt-8 border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} AutoBI. All rights reserved.
            </div>
        </div>
    </footer>
);

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
    return (
        <div className="bg-gray-900 text-gray-200">
            <NavBar onGetStarted={onGetStarted} />
            <HeroSection onGetStarted={onGetStarted} />
            <HowItWorksSection />
            <TemplateCarouselSection />
            <InsightsSection />
            <TestimonialsSection />
            <CTASection onGetStarted={onGetStarted} />
            <Footer />
        </div>
    );
};

export default HomePage;
