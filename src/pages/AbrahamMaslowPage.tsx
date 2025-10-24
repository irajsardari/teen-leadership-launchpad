import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import symbolicImage from "@/assets/echoes-symbolic-maslow.jpg";

const AbrahamMaslowPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ECHOES – Abraham Maslow | Teenagers Management Academy</title>
        <meta name="description" content="The life and legacy of Abraham H. Maslow (1908–1970) – the architect of human motivation – presented in the ECHOES series, The Messengers of Management." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Header Navigation */}
      <section className="bg-tma-navy text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            className="text-white hover:text-white/80 hover:bg-white/10" 
            asChild
          >
            <Link to="/voices/echoes" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to ECHOES
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-tma-navy to-tma-navy/90 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <div className="text-sm font-semibold tracking-widest uppercase text-tma-red">
                ECHOES
              </div>
              <div className="text-sm font-light tracking-wide text-white/80">
                The Messengers of Management
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-inter tracking-tight leading-tight">
              Abraham H. Maslow — The Architect of Human Motivation
            </h1>

            {/* Symbolic Image */}
            <figure className="my-12">
              <img 
                src={symbolicImage}
                alt="Symbolic visual representing Abraham Maslow's hierarchy of needs and human growth"
                className="rounded-lg shadow-2xl max-w-2xl w-full mx-auto"
              />
            </figure>

            {/* Signature Quote */}
            <blockquote className="text-xl md:text-2xl font-light italic leading-relaxed pt-8">
              <div className="mb-4">
                "What a man <em>can</em> be, he <em>must</em> be. This need we may call self-actualization."
              </div>
              <cite className="text-base not-italic text-white/70">
                — Abraham Maslow (1908–1970)
              </cite>
            </blockquote>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-foreground leading-relaxed">
              
              {/* Snapshot */}
              <section className="echoes-section mt-8">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Snapshot</h2>
                <p className="echoes-paragraph mb-6">
                  Abraham Harold Maslow (1908–1970) was an American psychologist who changed the way the world thinks about human potential. Instead of studying dysfunction and illness, he asked a different question: What makes people thrive?
                </p>
                <p className="echoes-paragraph">
                  His answer — the hierarchy of needs and the concept of self-actualization — became one of the most influential frameworks in psychology, education, and organizational theory. Maslow believed that people are fundamentally motivated to become the best version of themselves.
                </p>
              </section>

              {/* Early Life & Influences */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Early Life & Influences</h2>
                <p className="echoes-paragraph mb-6">
                  Maslow was born in Brooklyn, New York, to immigrant parents. He described his childhood as difficult and lonely. He found comfort in books and developed a deep curiosity about what makes people happy, connected, and fulfilled.
                </p>
                <p className="echoes-paragraph mb-6">
                  He studied psychology at the University of Wisconsin, where he was influenced by behaviorism — but he felt it was incomplete. Behaviorism treated people like machines. Maslow believed people had purpose, creativity, and dignity that could not be reduced to stimuli and responses.
                </p>
                <p className="echoes-paragraph">
                  After earning his PhD, he taught at Brooklyn College and began studying people who were not just coping, but flourishing. He called them self-actualizers: individuals who were creative, authentic, and deeply engaged with life.
                </p>
              </section>

              {/* Turning Point */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Turning Point</h2>
                <p className="echoes-paragraph mb-6">
                  During the 1930s and 1940s, psychology was dominated by two extremes: Freud's psychoanalysis, which focused on mental illness and inner conflict, and behaviorism, which studied observable actions without reference to thoughts or emotions.
                </p>
                <p className="echoes-paragraph mb-6">
                  Maslow saw a missing third path. He wanted to study the psychology of growth, not just pathology. He examined figures like Eleanor Roosevelt, Albert Einstein, and Frederick Douglass — people who embodied excellence and integrity. What did they have in common?
                </p>
                <p className="echoes-paragraph">
                  This inquiry led to his most famous idea: the hierarchy of needs. Human motivation, he argued, moves through levels: physiological needs, safety, belonging, esteem, and finally, self-actualization — the realization of one's potential.
                </p>
              </section>

              {/* Major Works & Signature Ideas */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Major Works & Signature Ideas</h2>
                <p className="echoes-paragraph mb-6">
                  Maslow's major books include:
                </p>
                <ul className="list-disc pl-6 space-y-3 mb-6">
                  <li><em>Motivation and Personality</em> (1954) — Introduced the hierarchy of needs.</li>
                  <li><em>Toward a Psychology of Being</em> (1962) — Explored peak experiences and human transcendence.</li>
                  <li><em>Religions, Values and Peak Experiences</em> (1964) — Connected spirituality with psychological health.</li>
                  <li><em>The Farther Reaches of Human Nature</em> (1971, posthumous) — Expanded his vision of human possibility.</li>
                </ul>
                <p className="echoes-paragraph mb-6">
                  His central insight: People are not driven only by fear or survival. Once basic needs are met, they seek purpose, meaning, and contribution. This simple but profound observation reshaped education, management, and counseling.
                </p>
                <blockquote className="echoes-inline-quote p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic mb-6">
                  <p>"A musician must make music, an artist must paint, a poet must write, if he is to be ultimately at peace with himself."</p>
                </blockquote>
              </section>

              {/* Selected Quotes */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Selected Quotes</h2>
                <p className="echoes-paragraph mb-8">
                  Maslow's writings are filled with clarity and compassion. Here are some of his most powerful reflections:
                </p>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic mb-6">
                  <p>"One can choose to go back toward safety or forward toward growth. Growth must be chosen again and again; fear must be overcome again and again."</p>
                </blockquote>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic mb-6">
                  <p>"If you plan on being anything less than you are capable of being, you will probably be unhappy all the days of your life."</p>
                </blockquote>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic mb-6">
                  <p>"The story of the human race is the story of men and women selling themselves short."</p>
                </blockquote>
                <blockquote className="p-6 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 border-l-4 border-tma-red rounded-r-lg italic mb-6">
                  <p>"We may define therapy as a search for value."</p>
                </blockquote>
              </section>

              {/* Honours & Recognition */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Honours & Recognition</h2>
                <p className="echoes-paragraph mb-6">
                  Maslow served as President of the American Psychological Association in 1967, a recognition of his growing influence. Though he did not seek fame, he was widely respected by educators, therapists, and business leaders who saw the value of his humanistic approach.
                </p>
                <p className="echoes-paragraph mb-6">
                  He spent much of his career teaching at Brandeis University, where he mentored students and expanded his ideas. Later in life, he consulted with organizations interested in creating more humane and effective workplaces.
                </p>
                <p className="echoes-paragraph">
                  Maslow passed away from a heart attack in 1970 at the age of 62. His work, however, has only grown in relevance. Today, his ideas inform leadership development, employee engagement, and personal growth programs worldwide.
                </p>
              </section>

              {/* Legacy */}
              <section className="echoes-section mt-16">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Legacy</h2>
                <p className="echoes-paragraph mb-6">
                  Maslow shifted psychology from illness to potential. Before him, most psychologists studied what went wrong. He studied what could go right. His hierarchy of needs remains a foundational model in fields ranging from education to management to public policy.
                </p>
                <p className="echoes-paragraph mb-6">
                  Organizations cite Maslow when designing cultures that respect human dignity. Teachers reference him when building classrooms where students feel safe and valued. Coaches and mentors use his framework to understand motivation at every level.
                </p>
                <p className="echoes-paragraph">
                  His influence extends beyond academia. Maslow reminded the world that human beings are not just problems to be solved — they are possibilities to be nurtured.
                </p>
              </section>

              {/* Closing Reflection */}
              <section className="echoes-section echoes-closing mt-16 p-8 bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 rounded-lg border border-tma-navy/20">
                <h2 className="echoes-heading text-3xl font-bold text-foreground mb-8">Closing Reflection</h2>
                <p className="echoes-paragraph text-lg">
                  When Abraham Maslow died in 1970, he left behind a question that every generation must answer: Will we settle for survival, or will we strive for something higher? His voice still echoes through classrooms and boardrooms alike — reminding us that becoming fully human is both our greatest challenge and our deepest calling.
                </p>
              </section>

            </div>
          </div>

          {/* Next in Series */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Next in ECHOES</p>
                <p className="text-lg font-medium text-muted-foreground">Coming Soon...</p>
              </div>
              <Button 
                variant="outline"
                asChild
              >
                <Link to="/voices/echoes">
                  View All Profiles
                </Link>
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p className="italic">
              <strong>Disclaimer:</strong> This biography is presented for educational purposes, celebrating the contributions 
              of management pioneers to inspire the next generation of leaders at TMA.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default AbrahamMaslowPage;
