import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, UserIcon, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
const BlogPage = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9; // 3x3 grid for optimal layout
  const isVoices = location.pathname.startsWith('/voices');
  const pageTitle = isVoices ? 'TMA Voices' : 'TMA Insights';
  const metaTitle = isVoices ? 'TMA Voices | Teen leadership insights' : 'TMA Insights | Articles from TMA';
  const metaDescription = isVoices
    ? "Insights, perspectives, and thought leadership from the world's first teenage leadership academy"
    : "Latest insights and articles from the Teenagers Management Academy (TMA).";
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
  
  // Sort posts by date (newest first)
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, endIndex);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      {/* Hero Section */}
      <section id="voices-top" className="relative py-20 lg:py-32 bg-tma-teal">
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-inter tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-4 text-white/90 max-w-3xl mx-auto font-inter font-medium leading-relaxed">
              TMA Voices & ECHOES – Insights, reflections, and the legacies of great minds from the world's first teenage leadership academy.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-12 bg-gradient-to-b from-tma-teal/10 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* TMA Voices Block */}
            <Link to="/voices" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full border-2 border-transparent hover:border-tma-teal hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-br from-tma-teal to-tma-blue text-white rounded-full p-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-3 text-foreground group-hover:text-tma-teal transition-colors">
                  TMA Voices
                </h2>
                <p className="text-center text-muted-foreground leading-relaxed">
                  Current insights, perspectives, and thought leadership on teenage development and management
                </p>
              </div>
            </Link>

            {/* ECHOES Block */}
            <Link to="/voices/echoes" className="group">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full border-2 border-transparent hover:border-tma-red hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gradient-to-br from-tma-navy to-tma-red text-white rounded-full p-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-3 text-foreground group-hover:text-tma-red transition-colors">
                  ECHOES
                </h2>
                <p className="text-center text-sm font-medium text-tma-red mb-2 italic">
                  The Messengers of Management
                </p>
                <p className="text-center text-muted-foreground leading-relaxed">
                  Biographies and legacies of the great minds who shaped modern management thinking
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-tma-orange/10 text-tma-orange hover:bg-tma-orange/20">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-tma-blue transition-colors duration-200">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    className="group/btn p-0 h-auto font-medium text-tma-blue hover:text-tma-teal transition-colors duration-200" 
                    asChild
                  >
                    <Link to={`/${isVoices ? 'voices' : 'insights'}/${post.slug}`} className="flex items-center">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-tma-blue/5 to-tma-teal/5 rounded-2xl p-8 lg:p-12 border border-tma-blue/10">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">
                Want to contribute to TMA Voices?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Share your insights on leadership, education, and teenage development with our global community.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-tma-blue to-tma-teal hover:from-tma-blue/90 hover:to-tma-teal/90 text-white font-medium px-8 py-3"
                asChild
              >
                <Link to="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;