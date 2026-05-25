import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import HeroSection from '@/components/landing/HeroSection';
import LineupSection from '@/components/landing/LineupSection';
import TicketTierCard from '@/components/landing/TicketTierCard';
import FAQAccordion from '@/components/landing/FAQAccordion';
import AnimatedSection from '@/components/landing/AnimatedSection';
import { EVENT, TICKET_TIERS } from '@/lib/constants';

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="flex-1">
        <HeroSection />

        {/* About Section */}
        <section id="about" className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <AnimatedSection>
              <h2 className="text-sm font-semibold text-gold uppercase tracking-widest mb-4">
                About The Event
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-poppins)] mb-8">
                The Biggest Celebration <br className="hidden sm:block" />
                of the Year
              </h3>
              <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl mx-auto">
                {EVENT.description}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Lineup Section */}
        <section className="py-24 bg-dark-100 border-y border-gold/10 relative">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-sm font-semibold text-gold uppercase tracking-widest mb-4">
                The Lineup
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-poppins)]">
                Star-Studded Performances
              </h3>
            </AnimatedSection>
            
            <LineupSection />
          </div>
        </section>

        {/* Tickets Section */}
        <section id="tiers" className="py-32 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-black to-black" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <AnimatedSection className="text-center mb-20">
              <h2 className="text-sm font-semibold text-gold uppercase tracking-widest mb-4">
                Pricing
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-poppins)] mb-6">
                Choose Your Experience
              </h3>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Select from our carefully curated tiers, ranging from general access
                to the ultimate diamond luxury experience.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
              {TICKET_TIERS.map((tier, i) => (
                <TicketTierCard
                  key={tier.id}
                  tier={tier}
                  index={i}
                  featured={tier.id === 'GOLD'}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-dark-100 relative">
          <div className="absolute left-0 bottom-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-sm font-semibold text-gold uppercase tracking-widest mb-4">
                Got Questions?
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-poppins)]">
                Frequently Asked Questions
              </h3>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <FAQAccordion />
            </AnimatedSection>
          </div>
        </section>

        {/* Contact/CTA Section */}
        <section id="contact" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/10" />
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <AnimatedSection>
              <h2 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-poppins)] mb-6 text-black">
                Ready to Experience <br />
                ILEYA FEST?
              </h2>
              <p className="text-lg text-black/70 mb-10 max-w-2xl mx-auto">
                Secure your tickets now before they sell out. For bulk bookings or
                sponsorship inquiries, please contact our reservation team.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/tickets"
                  className="w-full sm:w-auto px-8 py-4 bg-black text-gold rounded-full font-bold hover:bg-dark-100 transition-colors duration-300"
                >
                  Buy Tickets Online
                </a>
                <a
                  href={`tel:${EVENT.phone1}`}
                  className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-black text-black rounded-full font-bold hover:bg-black/5 transition-colors duration-300"
                >
                  Call Reservations
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
