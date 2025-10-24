import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import druckerImage from "@/assets/echoes-symbolic-drucker.jpg";
import maslowImage from "@/assets/echoes-symbolic-maslow.jpg";
import taylorImage from "@/assets/echoes-symbolic-taylor.jpg";
import mayoImage from "@/assets/echoes-symbolic-mayo.jpg";
import follettImage from "@/assets/echoes-symbolic-follett.jpg";
import mcgregorImage from "@/assets/echoes-symbolic-mcgregor.jpg";
import hofstedeImage from "@/assets/echoes-symbolic-hofstede.jpg";
import mintzbergImage from "@/assets/echoes-symbolic-mintzberg.jpg";
import scheinImage from "@/assets/echoes-symbolic-schein.jpg";
import sengeImage from "@/assets/echoes-symbolic-senge.jpg";
import porterImage from "@/assets/echoes-symbolic-porter.jpg";
import collinsImage from "@/assets/echoes-symbolic-collins.jpg";

const EchoesPage = () => {
  const echoesProfiles = [
    {
      id: 'peter-drucker',
      name: 'Peter F. Drucker',
      subtitle: 'The Visionary Who Taught the World How to Think',
      image: druckerImage,
      excerpt: 'The father of modern management who believed that people, not profit, are the true measure of success.',
      slug: 'peter-drucker'
    },
    {
      id: 'abraham-maslow',
      name: 'Abraham H. Maslow',
      subtitle: 'The Architect of Human Motivation',
      image: maslowImage,
      excerpt: 'The psychologist who taught the world that human potential, not just survival, drives our deepest motivations.',
      slug: 'abraham-maslow'
    },
    {
      id: 'frederick-taylor',
      name: 'Frederick Winslow Taylor',
      subtitle: 'The Engineer Who Measured Work and Shaped Modern Management',
      image: taylorImage,
      excerpt: 'He transformed factories into systems of precision and performance — proving that efficiency, discipline, and method could build the modern world.',
      slug: 'frederick-taylor'
    },
    {
      id: 'elton-mayo',
      name: 'Elton Mayo',
      subtitle: 'The Listener Who Brought Humanity to the Workplace',
      image: mayoImage,
      excerpt: 'He proved that productivity depends not only on tools and systems — but on attention, connection, and care.',
      slug: 'elton-mayo'
    },
    {
      id: 'mary-parker-follett',
      name: 'Mary Parker Follett',
      subtitle: 'The Prophet of Collaboration and Shared Power',
      image: follettImage,
      excerpt: 'She redefined leadership as partnership — showing that real power grows when shared.',
      slug: 'mary-parker-follett'
    },
    {
      id: 'douglas-mcgregor',
      name: 'Douglas McGregor',
      subtitle: 'The Voice Who Taught the World How to See People at Work',
      image: mcgregorImage,
      excerpt: 'He showed that the greatest decision every manager makes is not about strategy — but about what they believe human beings are capable of.',
      slug: 'douglas-mcgregor'
    },
    {
      id: 'geert-hofstede',
      name: 'Geert Hofstede',
      subtitle: 'The Cartographer of Culture',
      image: hofstedeImage,
      excerpt: 'He taught the world that leadership, teamwork, and communication look different in every culture — and that understanding those differences is the first step toward unity.',
      slug: 'geert-hofstede'
    },
    {
      id: 'henry-mintzberg',
      name: 'Henry Mintzberg',
      subtitle: 'The Strategist Who Redefined Management as Practice',
      image: mintzbergImage,
      excerpt: 'He stepped out of the classroom and into real offices — discovering that true management is less about theory and more about connection, judgment, and craft.',
      slug: 'henry-mintzberg'
    },
    {
      id: 'edgar-schein',
      name: 'Edgar H. Schein',
      subtitle: 'The Architect of Organizational Culture',
      image: scheinImage,
      excerpt: 'He revealed that every organization has a soul — its shared beliefs, assumptions, and ways of seeing the world. Understanding that soul is the leader\'s first task.',
      slug: 'edgar-schein'
    },
    {
      id: 'peter-senge',
      name: 'Peter M. Senge',
      subtitle: 'The Visionary Who Taught the World to Think in Systems',
      image: sengeImage,
      excerpt: 'He showed that every organization is a living system — and that the leaders of tomorrow are those who can see the whole, not just the parts.',
      slug: 'peter-senge'
    },
    {
      id: 'michael-porter',
      name: 'Michael E. Porter',
      subtitle: 'The Strategist Who Taught the World How Competition Creates Value',
      image: porterImage,
      excerpt: 'He showed that competition, when understood clearly, is not destruction — it\'s design. It\'s how organizations learn to create real value for society.',
      slug: 'michael-porter'
    },
    {
      id: 'jim-collins',
      name: 'Jim Collins',
      subtitle: 'The Researcher Who Turned Data into the DNA of Greatness',
      image: collinsImage,
      excerpt: 'He spent decades asking a single question — why do some companies and leaders last while others fade? His answers became a map for building greatness that endures.',
      slug: 'jim-collins'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>ECHOES – The Messengers of Management | TMA</title>
        <meta name="description" content="The story and legacies of great minds who shaped modern management — through TMA's ECHOES series, connecting timeless ideas with today's AI generation." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : undefined} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-r from-tma-navy to-tma-blue">
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-6 bg-tma-red text-white hover:bg-tma-red/90">
              The Messengers of Management
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-inter tracking-tight">
              ECHOES
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto font-inter font-medium leading-relaxed">
              Biographies and legacies of the great minds who shaped modern management and leadership
            </p>
          </div>
        </div>
      </section>

      {/* Profiles Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {echoesProfiles.map((profile) => (
              <Card key={profile.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-tma-navy/10 to-tma-blue/10">
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="space-y-4">
                  <Badge variant="secondary" className="w-fit bg-tma-red/10 text-tma-red hover:bg-tma-red/20">
                    ECHOES
                  </Badge>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-tma-blue transition-colors duration-200">
                    {profile.name}
                  </CardTitle>
                  <p className="text-sm font-medium text-muted-foreground italic">
                    {profile.subtitle}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed">
                    {profile.excerpt}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    className="group/btn p-0 h-auto font-medium text-tma-blue hover:text-tma-teal transition-colors duration-200" 
                    asChild
                  >
                    <Link to={`/voices/echoes/${profile.slug}`} className="flex items-center">
                      Read Biography
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-tma-navy/5 to-tma-blue/5 rounded-2xl p-8 lg:p-12 border border-tma-navy/10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                More Profiles Coming Soon
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're building a collection of biographies celebrating the pioneers of management thinking and leadership philosophy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EchoesPage;
