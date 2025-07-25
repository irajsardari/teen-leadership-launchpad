import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, MessageCircle, Users } from "lucide-react";

const ContactPage = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us a message anytime",
      details: "info@tma.academy",
      action: "mailto:info@tma.academy"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team",
      details: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available during business hours",
      details: "9 AM - 6 PM EST",
      action: "#"
    }
  ];

  const offices = [
    {
      location: "Global Headquarters",
      address: "123 Education Drive, Suite 100",
      city: "New York, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "headquarters@tma.academy"
    },
    {
      location: "European Office",
      address: "45 Academic Street",
      city: "London, UK EC1A 1BB",
      phone: "+44 20 1234 5678",
      email: "europe@tma.academy"
    },
    {
      location: "Asia Pacific Office",
      address: "78 Learning Lane",
      city: "Singapore 018909",
      phone: "+65 1234 5678",
      email: "apac@tma.academy"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Have questions? We'd love to hear from you. Send us a message 
              and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-tma-gray max-w-3xl mx-auto">
              Choose the method that works best for you. Our team is here to help 
              with any questions about TMA programs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full mb-4">
                    <method.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-tma-navy">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-tma-blue mb-4">{method.details}</p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={method.action}>Contact Now</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-tma-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
                Send Us a Message
              </h2>
              <p className="text-xl text-tma-gray">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
            
            <Card className="border-none shadow-[var(--shadow-card)]">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" type="text" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" type="text" required />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Information</SelectItem>
                        <SelectItem value="enrollment">Enrollment Questions</SelectItem>
                        <SelectItem value="curriculum">Curriculum Details</SelectItem>
                        <SelectItem value="parent">Parent/Guardian Inquiry</SelectItem>
                        <SelectItem value="teacher">Teacher/Educator Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" type="text" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea 
                      id="message" 
                      rows={6} 
                      placeholder="Please provide details about your inquiry..."
                      required 
                    />
                  </div>
                  
                  <div className="text-center">
                    <Button variant="hero" size="lg" type="submit">
                      Send Message
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Our Offices
            </h2>
            <p className="text-xl text-tma-gray max-w-3xl mx-auto">
              While we're primarily an online academy, we have support offices 
              around the world to serve our global community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="text-tma-navy flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-tma-teal" />
                    {office.location}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-tma-gray">
                    <p>{office.address}</p>
                    <p>{office.city}</p>
                  </div>
                  <div className="space-y-2 pt-3 border-t">
                    <div className="flex items-center text-sm text-tma-gray">
                      <Phone className="h-4 w-4 mr-2 text-tma-teal" />
                      <a href={`tel:${office.phone}`} className="hover:text-tma-blue">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-tma-gray">
                      <Mail className="h-4 w-4 mr-2 text-tma-teal" />
                      <a href={`mailto:${office.email}`} className="hover:text-tma-blue">
                        {office.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-20 bg-gradient-to-r from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Support Hours
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-white">
              <div>
                <h3 className="text-lg font-semibold mb-2">Americas</h3>
                <p className="text-blue-100">Monday - Friday</p>
                <p className="text-blue-100">9:00 AM - 6:00 PM EST</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Europe & Africa</h3>
                <p className="text-blue-100">Monday - Friday</p>
                <p className="text-blue-100">9:00 AM - 5:00 PM GMT</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Asia Pacific</h3>
                <p className="text-blue-100">Monday - Friday</p>
                <p className="text-blue-100">9:00 AM - 6:00 PM SGT</p>
              </div>
            </div>
            <p className="text-blue-100 mt-8">
              Email support is available 24/7. We'll respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-tma-gray mb-8">
              Before reaching out, you might find the answer to your question 
              in our comprehensive FAQ section or parent/teacher resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg">
                View FAQs
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/parents-teachers">Parent Resources</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;