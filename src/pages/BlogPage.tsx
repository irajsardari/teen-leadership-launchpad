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
      <section id="voices-top" className="relative py-20 lg:py-32 bg-gradient-to-r from-tma-blue to-tma-teal">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-inter tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100/90 max-w-3xl mx-auto font-inter font-medium leading-relaxed">
              Insights, perspectives, and thought leadership from the world's first teenage leadership academy
            </p>
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