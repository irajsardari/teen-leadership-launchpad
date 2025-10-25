import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import hofstedeImage from "@/assets/echoes-symbolic-hofstede.jpg";

const GeertHofstedePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>Geert Hofstede – The Cartographer of Culture | ECHOES | TMA</title>
        <meta name="description" content="Biography of Geert Hofstede, the social psychologist who mapped cultural dimensions and transformed cross-cultural management understanding worldwide." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 max-w-4xl">
        {/* Back Button */}
        <Link to="/voices/echoes" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to ECHOES
          </Button>
        </Link>

        {/* Header Section */}
        <header className="mb-12">
          <div className="inline-block px-4 py-1.5 bg-tma-red/10 text-tma-red rounded-full text-sm font-semibold mb-6">
            ECHOES
          </div>
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
            The Messengers of Management
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
            Geert Hofstede — The Cartographer of Culture
          </h1>
        </header>

        {/* Quote Section */}
        <div className="mb-12 p-8 bg-gradient-to-br from-tma-navy/5 to-tma-blue/5 rounded-2xl border border-tma-navy/10">
          <blockquote className="text-xl md:text-2xl italic text-foreground leading-relaxed">
            "Culture is the collective programming of the mind which distinguishes one group or category of people from another."
          </blockquote>
          <p className="mt-4 text-muted-foreground font-medium">
            — Geert Hofstede (1928 – 2020)
          </p>
        </div>

        {/* Symbolic Image */}
        <figure className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src={hofstedeImage} 
            alt="Symbolic representation of cultural diversity - a world map formed by overlapping cultural patterns representing Geert Hofstede's cultural dimensions theory"
            className="w-full h-auto"
            loading="eager"
          />
        </figure>

        {/* Snapshot Section */}
        <section className="mb-12 p-8 bg-card rounded-2xl border shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Snapshot</h2>
          <ul className="space-y-3 text-foreground/90">
            <li><strong>Full Name:</strong> Geert Hendrik Hofstede</li>
            <li><strong>Born:</strong> 2 October 1928, Haarlem, Netherlands</li>
            <li><strong>Died:</strong> 12 February 2020, Ede, Netherlands (aged 91)</li>
            <li><strong>Profession:</strong> Social psychologist, anthropologist, management scholar</li>
            <li><strong>Major Work:</strong> <em>Culture's Consequences: International Differences in Work-Related Values</em> (1980)</li>
            <li><strong>Known For:</strong> The six dimensions of national culture and the study of cross-cultural management</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground italic">
            (Sources: Hofstede Insights; Maastricht University Archives; American Psychological Association.)
          </p>
        </section>

        {/* Early Life Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Early Life & Influences</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              Growing up in the Netherlands between two world wars, Hofstede witnessed how national identity shapes values and behavior.
              After studying mechanical engineering and later social psychology, he joined IBM in the 1960s — where he led one of the largest international employee-attitude studies ever conducted.
              Analyzing over 100,000 responses from more than 70 countries, he began to see a hidden pattern: the way people work is deeply tied to the culture they come from.
            </p>
            <p className="font-medium text-lg">
              That realization would become his life's map.
            </p>
          </div>
        </section>

        {/* Turning Point Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Turning Point</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              In 1980, Hofstede published <em>Culture's Consequences</em>, a landmark book that transformed global management.
              He identified measurable dimensions of culture that explain why people across nations think, lead, and collaborate differently:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li><strong>Power Distance</strong> – how societies handle inequality</li>
              <li><strong>Individualism vs Collectivism</strong> – the balance between "I" and "we"</li>
              <li><strong>Masculinity vs Femininity</strong> – competition versus care</li>
              <li><strong>Uncertainty Avoidance</strong> – comfort with ambiguity and risk</li>
              <li><strong>Long-Term Orientation</strong> – focus on future vs tradition</li>
              <li><strong>Indulgence vs Restraint</strong> – the role of pleasure and discipline</li>
            </ol>
            <p className="font-medium text-lg">
              These six lenses became the universal vocabulary of cultural understanding in business, education, and diplomacy.
            </p>
          </div>
        </section>

        {/* Major Works Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Major Works & Signature Ideas</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-foreground">Key Publications:</h3>
            <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
              <li><em>Culture's Consequences</em> (1980, 2001 revised)</li>
              <li><em>Cultures and Organizations: Software of the Mind</em> (1991, with Gert Jan Hofstede & Michael Minkov)</li>
              <li><em>Exploring Culture</em> (2002)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Core Ideas:</h3>
            <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
              <li>Culture is learned, not inherited. It shapes perception, decisions, and leadership.</li>
              <li>There is no universal management style; every culture defines what "good leadership" means.</li>
              <li>Multicultural awareness builds stronger teams.</li>
              <li>Respecting difference is not weakness — it is intelligence.</li>
            </ul>
          </div>
        </section>

        {/* Selected Quotes Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Selected Quotes</h2>
          <div className="space-y-6">
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "The survival of mankind will depend on the ability of people who think differently to act together."
            </blockquote>
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "If we want to cooperate across cultures, we must first realize that we are not all the same."
            </blockquote>
            <blockquote className="pl-6 border-l-4 border-tma-blue text-lg italic text-foreground/90">
              "Management is culturally bound; there is no management theory free of context."
            </blockquote>
          </div>
        </section>

        {/* Honours Section */}
        <section className="mb-12 p-8 bg-gradient-to-br from-tma-teal/5 to-tma-blue/5 rounded-2xl border border-tma-teal/10">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Honours & Recognition</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground/90 ml-4">
            <li>Professor of Organizational Anthropology & International Management, Maastricht University</li>
            <li>Founder of The Institute for Research on Intercultural Cooperation (IRIC)</li>
            <li>Recipient of the American Society for Training & Development International Leadership Award (1994)</li>
            <li>Ranked among the Top 100 most influential management thinkers by the Financial Times</li>
            <li>His work cited by the UN, World Bank, and OECD in global development programs</li>
          </ul>
        </section>

        {/* Legacy Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Legacy</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              Hofstede built a bridge across borders of misunderstanding.
              He gave leaders, educators, and students the tools to navigate the invisible forces of culture.
              Today, his framework guides multinational corporations, cross-border negotiations, and even peacebuilding efforts.
            </p>
            <p>
              He transformed the phrase "That's just how we do things here" into a science of empathy.
              Every global manager who seeks understanding before judgment walks in his footsteps.
            </p>
          </div>
        </section>

        {/* Closing Reflection */}
        <section className="mb-12 p-8 bg-gradient-to-r from-tma-navy/10 to-tma-blue/10 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Closing Reflection</h2>
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
            <p>
              Geert Hofstede passed away in 2020, but his model continues to evolve through new generations of scholars.
              He once said that cultures are "the collective software of the mind" — but unlike machines, minds can update.
              Through understanding, respect, and curiosity, humanity can keep rewriting its shared code.
            </p>
            <blockquote className="text-xl font-semibold italic text-center my-6">
              "We are all different — yet all human."
            </blockquote>
            <p>
              Through ECHOES, his voice continues to remind young leaders that the world is not divided by borders, but by assumptions — and both can be crossed.
            </p>
          </div>
        </section>

        {/* Navigation Footer */}
        <footer className="pt-8 border-t">
          <Link to="/voices/echoes">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to ECHOES Collection
            </Button>
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default GeertHofstedePage;
