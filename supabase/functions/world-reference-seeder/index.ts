import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// World's Most Comprehensive Management Reference Terms
const WORLD_REFERENCE_TERMS = {
  "Strategic Management": [
    "Porter's Five Forces", "Blue Ocean Strategy", "SWOT Analysis", "Balanced Scorecard", 
    "Value Chain Analysis", "Core Competency", "Strategic Intent", "Competitive Advantage",
    "Resource-Based View", "Dynamic Capabilities", "Strategic Alliance", "Vertical Integration",
    "Horizontal Integration", "Market Penetration", "Diversification Strategy", "Cost Leadership",
    "Differentiation Strategy", "Focus Strategy", "Generic Strategies", "Strategic Planning",
    "Scenario Planning", "Strategic Control", "Strategic Implementation", "Mission Statement",
    "Vision Statement", "Strategic Objectives", "Key Performance Indicators", "Strategic Audit"
  ],

  "Leadership Theory": [
    "Transformational Leadership", "Transactional Leadership", "Servant Leadership", "Authentic Leadership",
    "Charismatic Leadership", "Situational Leadership", "Path-Goal Theory", "Leader-Member Exchange",
    "Distributed Leadership", "Ethical Leadership", "Adaptive Leadership", "Digital Leadership",
    "Thought Leadership", "Executive Presence", "Leadership Pipeline", "Succession Planning",
    "Leadership Development", "360-Degree Feedback", "Emotional Intelligence", "Executive Coaching",
    "Change Leadership", "Crisis Leadership", "Global Leadership", "Virtual Leadership",
    "Team Leadership", "Strategic Leadership", "Visionary Leadership", "Inclusive Leadership"
  ],

  "Organizational Behavior": [
    "Maslow's Hierarchy", "Herzberg's Two-Factor Theory", "Theory X and Theory Y", "Expectancy Theory",
    "Equity Theory", "Goal-Setting Theory", "Self-Determination Theory", "Flow Theory",
    "Psychological Safety", "Organizational Culture", "Organizational Climate", "Team Dynamics",
    "Group Think", "Social Loafing", "Organizational Commitment", "Job Satisfaction",
    "Work-Life Balance", "Employee Engagement", "Organizational Citizenship Behavior", "Workplace Diversity",
    "Inclusion and Belonging", "Unconscious Bias", "Cultural Intelligence", "Cross-Cultural Management",
    "Conflict Resolution", "Negotiation", "Power and Politics", "Organizational Justice"
  ],

  "Operations Management": [
    "Lean Manufacturing", "Six Sigma", "Total Quality Management", "Just-in-Time", "Kaizen",
    "Value Stream Mapping", "5S Methodology", "Kanban", "Theory of Constraints", "Statistical Process Control",
    "Supply Chain Management", "Vendor Management", "Inventory Management", "Demand Forecasting",
    "Capacity Planning", "Process Optimization", "Continuous Improvement", "Quality Control",
    "ISO Standards", "Benchmarking", "Business Process Reengineering", "Workflow Management",
    "Project Management", "Agile Methodology", "Scrum Framework", "Critical Path Method",
    "PERT Analysis", "Risk Management", "Stakeholder Management", "Resource Allocation"
  ],

  "Financial Management": [
    "Net Present Value", "Internal Rate of Return", "Return on Investment", "Return on Equity",
    "Earnings Before Interest and Taxes", "Cash Flow Analysis", "Working Capital Management", "Capital Structure",
    "Cost of Capital", "Weighted Average Cost of Capital", "Capital Asset Pricing Model", "Beta Coefficient",
    "Financial Leverage", "Debt-to-Equity Ratio", "Current Ratio", "Quick Ratio",
    "Inventory Turnover", "Accounts Receivable Turnover", "Break-Even Analysis", "Margin Analysis",
    "Budget Variance Analysis", "Zero-Based Budgeting", "Activity-Based Costing", "Economic Value Added",
    "Discounted Cash Flow", "Terminal Value", "Valuation Methods", "Financial Modeling"
  ],

  "Human Resource Management": [
    "Talent Management", "Performance Management", "Competency Framework", "Job Analysis",
    "Recruitment and Selection", "Onboarding", "Employee Development", "Career Planning",
    "Succession Planning", "Knowledge Management", "Learning and Development", "Training Needs Analysis",
    "360-Degree Feedback", "Performance Appraisal", "Compensation Management", "Benefits Administration",
    "Employee Relations", "Grievance Handling", "Disciplinary Procedures", "Employee Retention",
    "Turnover Analysis", "Exit Interviews", "Organizational Development", "Change Management",
    "Culture Transformation", "Employee Engagement Survey", "Pulse Survey", "HR Analytics"
  ],

  "Innovation Management": [
    "Design Thinking", "Disruptive Innovation", "Incremental Innovation", "Radical Innovation",
    "Innovation Pipeline", "Stage-Gate Process", "Open Innovation", "Closed Innovation",
    "Innovation Ecosystem", "Creative Destruction", "Technology Transfer", "Intellectual Property",
    "Patent Strategy", "R&D Management", "Innovation Metrics", "Innovation Culture",
    "Intrapreneurship", "Corporate Venturing", "Innovation Lab", "Hackathon",
    "Rapid Prototyping", "Minimum Viable Product", "Proof of Concept", "Pivot Strategy",
    "Innovation Funnel", "Idea Management", "Innovation Portfolio", "Technology Roadmap"
  ],

  "Change Management": [
    "Kotter's 8-Step Process", "ADKAR Model", "Bridges Transition Model", "Lewin's Change Model",
    "Change Readiness", "Change Resistance", "Change Agents", "Change Communication",
    "Organizational Transformation", "Cultural Change", "Digital Transformation", "Business Transformation",
    "Change Leadership", "Change Strategy", "Change Implementation", "Change Sustainability",
    "Stakeholder Analysis", "Impact Assessment", "Risk Assessment", "Change Metrics",
    "Change Governance", "Change Portfolio", "Organizational Agility", "Adaptive Capacity",
    "Change Fatigue", "Change Acceleration", "Change Capability", "Transformation Office"
  ],

  "Digital Transformation": [
    "Digital Strategy", "Digital Business Model", "Platform Strategy", "API Economy",
    "Cloud Computing", "Artificial Intelligence", "Machine Learning", "Big Data Analytics",
    "Internet of Things", "Blockchain Technology", "Robotic Process Automation", "Digital Twin",
    "Cybersecurity", "Data Governance", "Digital Ethics", "Privacy by Design",
    "Agile Transformation", "DevOps", "Continuous Integration", "Continuous Deployment",
    "Microservices Architecture", "Digital Customer Experience", "Omnichannel Strategy", "E-commerce",
    "Digital Marketing", "Social Media Strategy", "Digital Workplace", "Remote Work Management"
  ],

  "Entrepreneurship": [
    "Lean Startup", "Business Model Canvas", "Value Proposition Canvas", "Customer Development",
    "Product-Market Fit", "Minimum Viable Product", "Pivot", "Bootstrap Funding",
    "Venture Capital", "Angel Investment", "Seed Funding", "Series A Funding",
    "Due Diligence", "Valuation Methods", "Exit Strategy", "Initial Public Offering",
    "Merger and Acquisition", "Strategic Partnership", "Joint Venture", "Licensing Agreement",
    "Intellectual Property Strategy", "Competitive Analysis", "Market Research", "Customer Segmentation",
    "Growth Hacking", "Viral Marketing", "Network Effects", "Scalability"
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      categories = Object.keys(WORLD_REFERENCE_TERMS), 
      maxTermsPerCategory = 10,
      priority = 1 
    } = await req.json();

    console.log(`Starting world reference seeding for categories: ${categories.join(', ')}`);

    let totalGenerated = 0;
    let totalErrors = 0;
    const results = [];

    for (const category of categories) {
      if (!WORLD_REFERENCE_TERMS[category]) {
        console.log(`Category ${category} not found, skipping...`);
        continue;
      }

      const terms = WORLD_REFERENCE_TERMS[category].slice(0, maxTermsPerCategory);
      console.log(`Processing ${terms.length} terms for category: ${category}`);

      for (const term of terms) {
        try {
          // Check if term already exists
          const { data: existing } = await supabase
            .from('dictionary')
            .select('id, term')
            .eq('term', term)
            .single();

          if (existing) {
            console.log(`Term "${term}" already exists, skipping...`);
            continue;
          }

          // Generate using our enhanced AI function
          const generationResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-lexicon-generator`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              term: term,
              category: category,
              languages: ['en', 'ar'],
              priority: priority
            }),
          });

          const generationResult = await generationResponse.json();

          if (generationResult.success) {
            totalGenerated++;
            results.push({
              term: term,
              category: category,
              status: 'success',
              id: generationResult.term?.id
            });
            console.log(`✅ Generated: ${term}`);
          } else {
            totalErrors++;
            results.push({
              term: term,
              category: category,
              status: 'error',
              error: generationResult.error
            });
            console.log(`❌ Failed: ${term} - ${generationResult.error}`);
          }

          // Rate limiting: wait 1 second between requests
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          totalErrors++;
          results.push({
            term: term,
            category: category,
            status: 'error',
            error: error.message
          });
          console.error(`Error generating ${term}:`, error);
        }
      }

      // Wait 2 seconds between categories
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`World Reference Seeding Complete! Generated: ${totalGenerated}, Errors: ${totalErrors}`);

    return new Response(JSON.stringify({
      success: true,
      message: `World Reference Seeding Complete!`,
      summary: {
        total_generated: totalGenerated,
        total_errors: totalErrors,
        categories_processed: categories.length,
        processing_time: new Date().toISOString()
      },
      results: results,
      sample_terms: results.filter(r => r.status === 'success').slice(0, 5)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in world-reference-seeder:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});