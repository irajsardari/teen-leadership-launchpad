import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import hofstedeImage from "@/assets/echoes-symbolic-hofstede.jpg";
import { SocialShareButtons } from "@/components/SocialShareButtons";

const GeertHofstedePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Geert Hofstede – The Cartographer of Culture | ECHOES | TMA</title>
        <meta name="description" content="Biography of Geert Hofstede, the social psychologist who mapped cultural dimensions and transformed cross-cultural management understanding worldwide." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      <article className="echoes-article">
        {/* HERO SECTION */}
        <header className="echoes-hero">
          <div className="echoes-hero-text">
            <div className="echoes-series-label">ECHOES</div>
            <div className="echoes-series-subtitle">The Messengers of Management</div>

            <h1 className="echoes-title">
              Geert Hofstede — The Cartographer of Culture
            </h1>

            {/* SYMBOLIC IMAGE */}
            <figure className="echoes-symbolic-figure">
              <img 
                src={hofstedeImage} 
                alt="Symbolic representation of cultural diversity - a world map formed by overlapping cultural patterns representing Geert Hofstede's cultural dimensions theory"
                loading="eager"
              />
            </figure>

            {/* SIGNATURE QUOTE */}
            <blockquote className="echoes-quote">
              "Culture is the collective programming of the mind which distinguishes one group or category of people from another."
              <span className="echoes-quote-attrib">— Geert Hofstede (1928 – 2020)</span>
            </blockquote>
          </div>
        </header>

        {/* SNAPSHOT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Snapshot</h2>
          <ul className="echoes-list">
            <li><strong>Full Name:</strong> Geert Hendrik Hofstede</li>
            <li><strong>Born:</strong> 2 October 1928, Haarlem, Netherlands</li>
            <li><strong>Died:</strong> 12 February 2020, Ede, Netherlands (aged 91)</li>
            <li><strong>Profession:</strong> Social psychologist, anthropologist, management scholar</li>
            <li><strong>Major Work:</strong> <em>Culture's Consequences: International Differences in Work-Related Values</em> (1980)</li>
            <li><strong>Known For:</strong> The six dimensions of national culture and the study of cross-cultural management</li>
          </ul>
          <p className="echoes-paragraph text-sm text-muted-foreground mt-4">
            (Sources: Hofstede Insights; Maastricht University Archives; American Psychological Association.)
          </p>
        </section>

        {/* EARLY LIFE & INFLUENCES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Early Life & Influences</h2>
          <p className="echoes-paragraph">
            Growing up in the Netherlands between two world wars, Hofstede witnessed how national identity shapes values and behavior. After studying mechanical engineering and later social psychology, he joined IBM in the 1960s — where he led one of the largest international employee-attitude studies ever conducted.
          </p>
          <p className="echoes-paragraph">
            Analyzing over 100,000 responses from more than 70 countries, he began to see a hidden pattern: the way people work is deeply tied to the culture they come from. That realization would become his life's map.
          </p>
        </section>

        {/* TURNING POINT */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Turning Point</h2>
          <p className="echoes-paragraph">
            In 1980, Hofstede published <em>Culture's Consequences</em>, a landmark book that transformed global management. He identified measurable dimensions of culture that explain why people across nations think, lead, and collaborate differently:
          </p>
          <ol className="echoes-list list-decimal">
            <li><strong>Power Distance</strong> – how societies handle inequality</li>
            <li><strong>Individualism vs Collectivism</strong> – the balance between "I" and "we"</li>
            <li><strong>Masculinity vs Femininity</strong> – competition versus care</li>
            <li><strong>Uncertainty Avoidance</strong> – comfort with ambiguity and risk</li>
            <li><strong>Long-Term Orientation</strong> – focus on future vs tradition</li>
            <li><strong>Indulgence vs Restraint</strong> – the role of pleasure and discipline</li>
          </ol>
          <p className="echoes-paragraph">
            These six lenses became the universal vocabulary of cultural understanding in business, education, and diplomacy.
          </p>
        </section>

        {/* MAJOR WORKS & SIGNATURE IDEAS */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Major Works & Signature Ideas</h2>
          
          <h3 className="echoes-subheading">Key Publications:</h3>
          <ul className="echoes-list">
            <li><em>Culture's Consequences</em> (1980, 2001 revised)</li>
            <li><em>Cultures and Organizations: Software of the Mind</em> (1991, with Gert Jan Hofstede & Michael Minkov)</li>
            <li><em>Exploring Culture</em> (2002)</li>
          </ul>

          <h3 className="echoes-subheading">Core Ideas:</h3>
          <ul className="echoes-list">
            <li>Culture is learned, not inherited. It shapes perception, decisions, and leadership.</li>
            <li>There is no universal management style; every culture defines what "good leadership" means.</li>
            <li>Multicultural awareness builds stronger teams.</li>
            <li>Respecting difference is not weakness — it is intelligence.</li>
          </ul>
        </section>

        {/* SELECTED QUOTES */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Selected Quotes</h2>
          <blockquote className="echoes-inline-quote">
            "The survival of mankind will depend on the ability of people who think differently to act together."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "If we want to cooperate across cultures, we must first realize that we are not all the same."
          </blockquote>
          <blockquote className="echoes-inline-quote">
            "Management is culturally bound; there is no management theory free of context."
          </blockquote>
        </section>

        {/* HONOURS & RECOGNITION */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Honours & Recognition</h2>
          <ul className="echoes-list">
            <li>Professor of Organizational Anthropology & International Management, Maastricht University</li>
            <li>Founder of The Institute for Research on Intercultural Cooperation (IRIC)</li>
            <li>Recipient of the American Society for Training & Development International Leadership Award (1994)</li>
            <li>Ranked among the Top 100 most influential management thinkers by the Financial Times</li>
            <li>His work cited by the UN, World Bank, and OECD in global development programs</li>
          </ul>
        </section>

        {/* LEGACY */}
        <section className="echoes-section">
          <h2 className="echoes-heading">Legacy</h2>
          <p className="echoes-paragraph">
            Hofstede built a bridge across borders of misunderstanding. He gave leaders, educators, and students the tools to navigate the invisible forces of culture. Today, his framework guides multinational corporations, cross-border negotiations, and even peacebuilding efforts.
          </p>
          <p className="echoes-paragraph">
            He transformed the phrase "That's just how we do things here" into a science of empathy. Every global manager who seeks understanding before judgment walks in his footsteps.
          </p>
        </section>

        {/* CLOSING REFLECTION */}
        <section className="echoes-section echoes-closing">
          <h2 className="echoes-heading">Closing Reflection</h2>
          <p className="echoes-paragraph">
            Geert Hofstede passed away in 2020, but his work continues to guide cross-cultural management, global education, and international diplomacy. He believed that understanding differences is the foundation of respect.
          </p>
          <blockquote className="echoes-inline-quote">
            "We are all different — yet all human."
          </blockquote>
          <p className="echoes-paragraph">
            Through ECHOES, his voice continues to remind young leaders that the world is not divided by borders, but by assumptions — and both can be crossed.
          </p>
        </section>

        {/* SOCIAL SHARE */}
        <section className="echoes-section">
          <div className="py-6 border-t border-border/50">
            <h3 className="text-sm font-medium text-center text-muted-foreground mb-4">Share this profile</h3>
            <SocialShareButtons 
              title="Geert Hofstede — The Cartographer of Culture"
              description="Biography of Geert Hofstede, the social psychologist who mapped cultural dimensions and transformed cross-cultural management understanding worldwide."
            />
          </div>
        </section>

        {/* FOOTER NAVIGATION */}
        <footer className="echoes-footer-nav">
          <div className="echoes-next-link">
            <Link to="/voices/echoes">← Back to ECHOES Collection</Link>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default GeertHofstedePage;
