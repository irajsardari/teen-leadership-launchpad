import { useParams, Link, Navigate } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  UserIcon, 
  ArrowLeft, 
  ArrowRight, 
  Share2, 
  Clock,
  Home,
  ChevronRight,
  Linkedin,
  X,
  MessageCircle,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return <Navigate to="/insights" replace />;
  }

  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;

  // Calculate reading time (average 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  const readingTime = calculateReadingTime(post.content);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The article link has been copied to your clipboard.",
        });
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
    }
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareToX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${post.title} - ${post.excerpt}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${post.title} - ${post.excerpt}`);
    window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
  };

  const shareToEmail = () => {
    const subject = encodeURIComponent(post.title);
    const body = encodeURIComponent(`I thought you'd find this article interesting: ${post.title}\n\n${post.excerpt}\n\nRead more: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>{post.seo.metaTitle}</title>
        <meta name="description" content={post.seo.metaDescription} />
        <meta name="keywords" content={post.seo.keywords.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.featuredImage} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Social Sharing Sidebar - Desktop */}
        <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 z-40">
          <div className="flex flex-col gap-3 bg-background/95 backdrop-blur-sm p-3 rounded-full shadow-lg border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={shareToLinkedIn}
              className="h-10 w-10 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={shareToX}
              className="h-10 w-10 p-0 hover:bg-slate-50 hover:text-slate-800 transition-colors"
              title="Share on X"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={shareToWhatsApp}
              className="h-10 w-10 p-0 hover:bg-green-50 hover:text-green-600 transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={shareToEmail}
              className="h-10 w-10 p-0 hover:bg-gray-50 hover:text-gray-600 transition-colors"
              title="Share via Email"
            >
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 bg-gradient-to-br from-muted/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <div className="mb-8">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/" className="flex items-center">
                          <Home className="h-4 w-4" />
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/insights">TMA Voices</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{post.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Article Header */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-tma-orange/10 text-tma-orange">
                    {post.category}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-muted-foreground hover:text-tma-blue lg:hidden"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                  {post.title}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>🕒 {readingTime} min read</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags && post.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs bg-background hover:bg-muted cursor-pointer transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video overflow-hidden rounded-xl shadow-2xl relative">
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {/* TMA Logo Watermark */}
                <div className="absolute bottom-4 right-4 opacity-30">
                  <img 
                    src="/src/assets/tma-official-logo.png" 
                    alt="TMA Academy" 
                    className="h-8 w-auto filter brightness-0 invert"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-8 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-tma-blue prose-a:no-underline hover:prose-a:underline prose-li:text-muted-foreground">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {/* Author Bio Section */}
              <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border/50">
                <h3 className="text-lg font-semibold mb-3 text-foreground">About the Author</h3>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {post.author.split(' ').map(name => name[0]).join('')}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{post.author}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Dr. Iraj Sardari Baf is the founder of the Teenagers Management Academy (TMA), with over two decades of leadership experience in banking, education, and organizational behavior. A passionate advocate for youth empowerment, he writes about teenage leadership, emotional intelligence, and the future of education.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Social Sharing */}
              <div className="lg:hidden mt-8 p-4 bg-muted/20 rounded-xl">
                <h4 className="text-sm font-medium mb-3 text-center text-muted-foreground">Share this article</h4>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={shareToLinkedIn}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={shareToX}
                    className="hover:bg-slate-50 hover:text-slate-800"
                  >
                    <X className="h-4 w-4 mr-2" />
                    X
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={shareToWhatsApp}
                    className="hover:bg-green-50 hover:text-green-600"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={shareToEmail}
                    className="hover:bg-gray-50 hover:text-gray-600"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-12 border-t bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {previousPost && (
                  <Link 
                    to={`/insights/${previousPost.slug}`}
                    className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"
                  >
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous Article
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-tma-blue transition-colors duration-200">
                      {previousPost.title}
                    </h3>
                  </Link>
                )}
                {nextPost && (
                  <Link 
                    to={`/insights/${nextPost.slug}`}
                    className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 md:text-right"
                  >
                    <div className="flex items-center justify-end text-sm text-muted-foreground mb-2">
                      Next Article
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-tma-blue transition-colors duration-200">
                      {nextPost.title}
                    </h3>
                  </Link>
                )}
              </div>

              {/* Call to Action */}
              <div className="mt-12 p-8 bg-gradient-to-r from-tma-blue/5 to-tma-teal/5 rounded-xl border border-tma-blue/10 text-center">
                <h3 className="text-xl font-bold mb-4 text-foreground">
                  Ready to Join the Future of Leadership?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Discover how TMA Academy is shaping the next generation of global leaders.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-tma-blue to-tma-teal hover:from-tma-blue/90 hover:to-tma-teal/90 text-white"
                  asChild
                >
                  <Link to="/apply">
                    Start Your Journey
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPostPage;