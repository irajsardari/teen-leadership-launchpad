import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lightbulb, BookOpen, CalendarClock, Globe2, Award, CheckCircle2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmbeddedLandingForm from "@/components/TeacherApplicationLandingForm";

const TeachWithTMAPage = () => {
  const canonical = typeof window !== "undefined" ? window.location.href : undefined;

  const faqs = [
    {
      q: "What qualifications do I need?",
      a: "A degree or certification in education, leadership, management, or a related field is preferred, but we also welcome experienced professionals passionate about teaching teenagers.",
    },
    {
      q: "Do I need teenage teaching experience?",
      a: "It’s an advantage, but not essential. We value relevant skills, life experience, and commitment to our mission.",
    },
    {
      q: "How many hours per week will I teach?",
      a: "This depends on your role — from part-time workshops to regular weekly sessions.",
    },
    {
      q: "Can I teach online only?",
      a: "Yes. We offer both online and in-person opportunities.",
    },
    {
      q: "Is training provided?",
      a: "Yes. All teachers receive TMA orientation and access to our proprietary teaching materials.",
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div>
      <Helmet>
        <title>Teach with TMA | Join the Teenagers Management Academy as an Educator</title>
        <meta name="description" content="Apply to teach leadership, management, and life skills to teenagers (10–18) at the first academy of its kind in the world. Online and in-person roles available." />
        {canonical && <link rel="canonical" href={canonical} />}
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: 'Educator / Teacher',
          hiringOrganization: { name: 'Teenagers Management Academy (TMA)' },
          employmentType: 'Contract',
          jobLocationType: 'TELECOMMUTE',
          jobLocation: [{ '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Muscat', addressCountry: 'OM' } }],
          description: 'Teach leadership, management, and life skills to teenagers (10–18). Online and in-person roles available.',
        })}</script>
      </Helmet>

      <header className="section-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient-primary">
                Inspire the Next Generation of Leaders
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Join Teenagers Management Academy (TMA) — the first academy of its kind in the world — and guide young minds (ages 10–18) in leadership, management, and life skills.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild variant="cta-teal" size="lg">
                  <Link to="#apply" aria-label="Apply now to teach at TMA" onClick={() => { try { console.info('teach_cta_click', { source: 'hero' }); } catch {} }}>
                    Apply Now to Teach
                  </Link>
                </Button>
                <Button asChild variant="cta-outline" size="lg">
                  <Link to="#how-it-works" aria-label="Learn how the TMA teacher application process works">
                    How It Works
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="glass-card-modern rounded-2xl p-8">
                <ul className="space-y-4">
                  {["Leadership & Management", "Psychology & Wellbeing", "Finance & Digital Citizenship", "Global Culture & Communication"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="text-[hsl(var(--cta-teal))]" />
                      <span className="text-base font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section aria-labelledby="why-teach" className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="why-teach" className="text-3xl font-bold text-primary mb-8">Why Teach with TMA?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[{
                icon: Lightbulb,
                title: "Shape Future Leaders",
                desc: "Be part of a mission-driven academy empowering teenagers to lead with vision, empathy, and skill.",
              }, {
                icon: BookOpen,
                title: "World-First Curriculum",
                desc: "Deliver innovative programs in leadership, management, psychology, finance, and digital citizenship.",
              }, {
                icon: CalendarClock,
                title: "Flexible Opportunities",
                desc: "Online and in-person teaching roles to suit your schedule and lifestyle.",
              }, {
                icon: Globe2,
                title: "Global Impact",
                desc: "Work with students from diverse cultures and backgrounds.",
              }, {
                icon: Award,
                title: "Professional Growth",
                desc: "Access to TMA training, resources, and international educator networks.",
              }].map(({ icon: Icon, title, desc }) => (
                <article key={title} className="card-modern rounded-2xl p-6 h-full">
                  <Icon className="mb-4 text-[hsl(var(--cta-blue))]" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" aria-labelledby="process-heading" className="py-16 sm:py-20 section-gradient">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="process-heading" className="text-3xl font-bold text-primary mb-10">How It Works — The Application Process</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[{
                step: 1,
                title: "Apply Online",
                desc: "Complete the simple application form and share your qualifications.",
              }, {
                step: 2,
                title: "TMA Review",
                desc: "Our team screens applications carefully to ensure the best fit.",
              }, {
                step: 3,
                title: "Interview",
                desc: "Shortlisted candidates are invited for an online or in-person interview.",
              }, {
                step: 4,
                title: "Onboarding & Training",
                desc: "Approved teachers complete orientation and begin their TMA journey.",
              }].map(({ step, title, desc }) => (
                <article key={step} className="rounded-2xl p-6 border bg-card">
                  <div className="number-badge w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-4">
                    {step}
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </article>
              ))}
            </div>
            <div className="mt-10">
              <Button asChild variant="cta" size="lg">
                <Link to="#apply" aria-label="Start your application to teach at TMA" onClick={() => { try { console.info('teach_cta_click', { source: 'process' }); } catch {} }}>
                  Apply Now to Teach
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section aria-labelledby="faqs-heading" className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="faqs-heading" className="text-3xl font-bold text-primary mb-8">FAQs</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section aria-labelledby="final-cta" className="py-16 sm:py-24 section-gradient">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="final-cta" className="text-3xl sm:text-4xl font-extrabold text-primary">
              Your Experience. Their Future.
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Every teenager you teach at TMA will remember your influence for years to come. Join us in building confident, capable, and compassionate leaders for tomorrow.
            </p>
            <div className="mt-8">
              <Button asChild variant="cta-teal" size="lg">
                <Link to="#apply" aria-label="Apply now to teach with TMA" onClick={() => { try { console.info('teach_cta_click', { source: 'final' }); } catch {} }}>
                  Apply Now to Teach with TMA
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Embedded Application Form */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-6">
              <h3 className="text-2xl font-bold text-primary">Your Experience. Their Future.</h3>
              <p className="text-muted-foreground">Apply now — it takes less than 5 minutes. Every application is reviewed by our team.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {/* id="apply" lives in the form component */}
              <EmbeddedLandingForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TeachWithTMAPage;
