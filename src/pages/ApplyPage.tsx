import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Clock, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";


const ApplyPage = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const ageGroups = [
    {
      group: "Level 1: Explorers",
      ageRange: "10-11 years",
      description: "Pre-TMA Foundation - Self-Discovery and Basic Life Skills",
      price: "$79/month",
      badge: "Explorer Badge",
      features: [
        "6 foundation terms",
        "Self-awareness & confidence building",
        "Basic communication skills",
        "Goal setting for kids",
        "Friendship & social skills"
      ]
    },
    {
      group: "Level 2: Builders",
      ageRange: "12-14 years",
      description: "Foundations of Leadership, Discipline & Emotional Intelligence",
      price: "$99/month",
      badge: "Builder Badge",
      features: [
        "9 comprehensive terms",
        "Leadership foundations",
        "Emotional intelligence basics",
        "Communication & presentation",
        "Team collaboration"
      ]
    },
    {
      group: "Level 3: Innovators", 
      ageRange: "15-16 years",
      description: "Advanced Leadership, Communication & Innovation Skills",
      price: "$129/month",
      badge: "Innovator Badge",
      features: [
        "6 advanced terms",
        "Innovation & creative thinking",
        "Project management",
        "Public speaking & persuasion",
        "Digital innovation"
      ]
    },
    {
      group: "Level 4: Pathfinders",
      ageRange: "17-18 years",
      description: "Professional Leadership, Career Preparation & Life Mastery",
      price: "$149/month",
      badge: "Pathfinder Badge",
      features: [
        "7 professional terms",
        "Strategic leadership",
        "Business & entrepreneurship",
        "Career planning & development",
        "Social impact & responsibility"
      ]
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with teenagers from around the world"
    },
    {
      icon: Clock,
      title: "Flexible Learning",
      description: "Study at your own pace, anytime, anywhere"
    },
    {
      icon: Award,
      title: "Certified Programs",
      description: "Receive certificates upon completion"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="register" className="py-20 bg-gradient-to-br from-tma-blue to-tma-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join TMA Today
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Start your journey to becoming a confident, skilled leader. 
              Apply now and unlock your potential!
            </p>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= stepNumber 
                      ? 'bg-white text-tma-blue' 
                      : 'bg-white/20 text-white'
                  }`}>
                    {step > stepNumber ? <CheckCircle className="w-5 h-5" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step > stepNumber ? 'bg-white' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {step === 1 && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
                    Choose Your Learning Path
                  </h2>
                  <p className="text-xl text-tma-gray">
                    Select the age-appropriate program that matches your developmental stage (Ages 10-18)
                  </p>
                </div>
                
                <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                  {ageGroups.map((group, index) => (
                    <Card key={index} className="border-none shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300 cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="text-[#006D6C] border-[#006D6C]">
                            {group.ageRange}
                          </Badge>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-tma-navy">{group.price}</div>
                            <div className="text-sm text-tma-gray">per month</div>
                          </div>
                        </div>
                        <CardTitle className="text-tma-navy">{group.group}</CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                        <Badge variant="secondary" className="w-fit mt-2 bg-[#006D6C]/10 text-[#006D6C]">
                          Challenger - {group.badge}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-6">
                          {group.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center text-sm text-tma-gray">
                              <CheckCircle className="w-4 h-4 text-tma-teal mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className="w-full bg-[#006D6C] hover:bg-[#006D6C]/90 text-white font-inter transition-all duration-300"
                          onClick={() => setStep(2)}
                        >
                          Select This Program
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
                    Challenger Information
                  </h2>
                  <p className="text-xl text-tma-gray">
                    Tell us about yourself so we can personalize your learning experience
                  </p>
                </div>
                
                <Card className="border-none shadow-[var(--shadow-card)]">
                  <CardContent className="p-8">
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="challengerFirstName">First Name *</Label>
                          <Input id="challengerFirstName" type="text" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="challengerLastName">Last Name *</Label>
                          <Input id="challengerLastName" type="text" required />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                          <Input id="dateOfBirth" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="grade">Current Grade/Year *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="4">Grade 4</SelectItem>
                              <SelectItem value="5">Grade 5</SelectItem>
                              <SelectItem value="6">Grade 6</SelectItem>
                              <SelectItem value="7">Grade 7</SelectItem>
                              <SelectItem value="8">Grade 8</SelectItem>
                              <SelectItem value="9">Grade 9</SelectItem>
                              <SelectItem value="10">Grade 10</SelectItem>
                              <SelectItem value="11">Grade 11</SelectItem>
                              <SelectItem value="12">Grade 12</SelectItem>
                              <SelectItem value="university">University/College</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="country">Country/Region *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="af">Afghanistan</SelectItem>
                            <SelectItem value="al">Albania</SelectItem>
                            <SelectItem value="dz">Algeria</SelectItem>
                            <SelectItem value="ar">Argentina</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="at">Austria</SelectItem>
                            <SelectItem value="bd">Bangladesh</SelectItem>
                            <SelectItem value="be">Belgium</SelectItem>
                            <SelectItem value="br">Brazil</SelectItem>
                            <SelectItem value="bg">Bulgaria</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="cl">Chile</SelectItem>
                            <SelectItem value="cn">China</SelectItem>
                            <SelectItem value="co">Colombia</SelectItem>
                            <SelectItem value="hr">Croatia</SelectItem>
                            <SelectItem value="cz">Czech Republic</SelectItem>
                            <SelectItem value="dk">Denmark</SelectItem>
                            <SelectItem value="eg">Egypt</SelectItem>
                            <SelectItem value="ee">Estonia</SelectItem>
                            <SelectItem value="fi">Finland</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="gh">Ghana</SelectItem>
                            <SelectItem value="gr">Greece</SelectItem>
                            <SelectItem value="hk">Hong Kong</SelectItem>
                            <SelectItem value="hu">Hungary</SelectItem>
                            <SelectItem value="in">India</SelectItem>
                            <SelectItem value="id">Indonesia</SelectItem>
                            <SelectItem value="ir">Iran</SelectItem>
                            <SelectItem value="iq">Iraq</SelectItem>
                            <SelectItem value="ie">Ireland</SelectItem>
                            <SelectItem value="il">Israel</SelectItem>
                            <SelectItem value="it">Italy</SelectItem>
                            <SelectItem value="jp">Japan</SelectItem>
                            <SelectItem value="jo">Jordan</SelectItem>
                            <SelectItem value="kz">Kazakhstan</SelectItem>
                            <SelectItem value="ke">Kenya</SelectItem>
                            <SelectItem value="kw">Kuwait</SelectItem>
                            <SelectItem value="lv">Latvia</SelectItem>
                            <SelectItem value="lb">Lebanon</SelectItem>
                            <SelectItem value="lt">Lithuania</SelectItem>
                            <SelectItem value="my">Malaysia</SelectItem>
                            <SelectItem value="mx">Mexico</SelectItem>
                            <SelectItem value="ma">Morocco</SelectItem>
                            <SelectItem value="nl">Netherlands</SelectItem>
                            <SelectItem value="nz">New Zealand</SelectItem>
                            <SelectItem value="ng">Nigeria</SelectItem>
                            <SelectItem value="no">Norway</SelectItem>
                            <SelectItem value="pk">Pakistan</SelectItem>
                            <SelectItem value="pe">Peru</SelectItem>
                            <SelectItem value="ph">Philippines</SelectItem>
                            <SelectItem value="pl">Poland</SelectItem>
                            <SelectItem value="pt">Portugal</SelectItem>
                            <SelectItem value="qa">Qatar</SelectItem>
                            <SelectItem value="ro">Romania</SelectItem>
                            <SelectItem value="ru">Russia</SelectItem>
                            <SelectItem value="sa">Saudi Arabia</SelectItem>
                            <SelectItem value="sg">Singapore</SelectItem>
                            <SelectItem value="sk">Slovakia</SelectItem>
                            <SelectItem value="si">Slovenia</SelectItem>
                            <SelectItem value="za">South Africa</SelectItem>
                            <SelectItem value="kr">South Korea</SelectItem>
                            <SelectItem value="es">Spain</SelectItem>
                            <SelectItem value="lk">Sri Lanka</SelectItem>
                            <SelectItem value="se">Sweden</SelectItem>
                            <SelectItem value="ch">Switzerland</SelectItem>
                            <SelectItem value="tw">Taiwan</SelectItem>
                            <SelectItem value="th">Thailand</SelectItem>
                            <SelectItem value="tr">Turkey</SelectItem>
                            <SelectItem value="ua">Ukraine</SelectItem>
                            <SelectItem value="ae">United Arab Emirates</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uy">Uruguay</SelectItem>
                            <SelectItem value="vn">Vietnam</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="est">EST (Eastern)</SelectItem>
                            <SelectItem value="cst">CST (Central)</SelectItem>
                            <SelectItem value="mst">MST (Mountain)</SelectItem>
                            <SelectItem value="pst">PST (Pacific)</SelectItem>
                            <SelectItem value="gmt">GMT (London)</SelectItem>
                            <SelectItem value="cet">CET (Central Europe)</SelectItem>
                            <SelectItem value="sgt">SGT (Singapore)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="interests">Areas of Interest (Optional)</Label>
                        <Textarea 
                          id="interests" 
                          rows={4} 
                          placeholder="Tell us about your interests, hobbies, or what you hope to achieve through TMA..."
                        />
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button variant="hero" onClick={() => setStep(3)}>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
                    Parent/Guardian Information
                  </h2>
                  <p className="text-xl text-tma-gray">
                    We need a parent or guardian's information to complete the enrollment
                  </p>
                </div>
                
                <Card className="border-none shadow-[var(--shadow-card)]">
                  <CardContent className="p-8">
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="parentFirstName">Parent/Guardian First Name *</Label>
                          <Input id="parentFirstName" type="text" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentLastName">Parent/Guardian Last Name *</Label>
                          <Input id="parentLastName" type="text" required />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="parentEmail">Email Address *</Label>
                          <Input id="parentEmail" type="email" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentPhone">Phone Number *</Label>
                          <Input id="parentPhone" type="tel" required />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="relationship">Relationship to Student *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="guardian">Legal Guardian</SelectItem>
                            <SelectItem value="grandparent">Grandparent</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hearAbout">How did you hear about TMA? *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="search">Search Engine</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="friend">Friend/Family Referral</SelectItem>
                            <SelectItem value="school">School/Teacher</SelectItem>
                            <SelectItem value="advertisement">Online Advertisement</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confidentialInfo">Confidential Information (Optional)</Label>
                        <Textarea 
                          id="confidentialInfo" 
                          rows={3} 
                          placeholder="If your child has any special learning or attention-related needs (e.g., ADHD, learning challenges), please let us know here. This information is confidential and will only be accessible to authorized TMA administrators."
                          className="border-amber-200 focus:border-amber-400"
                        />
                        <p className="text-xs text-amber-600 font-medium">
                          🔒 This information is encrypted and only shared with authorized administrators to better support your child's learning experience.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="terms" required />
                          <Label htmlFor="terms" className="text-sm leading-relaxed">
                            I agree to the{" "}
                            <Link to="/terms" className="text-tma-blue hover:underline">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link to="/privacy" className="text-tma-blue hover:underline">
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox id="communications" />
                          <Label htmlFor="communications" className="text-sm leading-relaxed">
                            I would like to receive updates about TMA programs, events, and educational resources
                          </Label>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(2)}>
                          Back
                        </Button>
                        <Button variant="hero" size="lg" type="submit">
                          Submit Application
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Benefits Section */}
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Why Choose TMA?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-[var(--shadow-card)] text-center">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-tma-blue to-tma-teal rounded-full mb-4">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-tma-navy">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-tma-gray">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-tma-navy mb-6">
              Need Help with Your Application?
            </h2>
            <p className="text-xl text-tma-gray mb-8">
              Our admissions team is here to help you through the process. 
              Don't hesitate to reach out with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Contact Admissions</Link>
              </Button>
              <Button variant="outline" size="lg">
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplyPage;