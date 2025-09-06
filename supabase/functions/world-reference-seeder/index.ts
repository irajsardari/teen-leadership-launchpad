import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// World's Most Comprehensive Management Reference Terms
// Now supports detailed categories directly in the database

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
      maxTermsPerCategory = Math.min(10, 20),  // Limit to max 20 per batch
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

      // Process terms in batches of ≤20
      const batchSize = 20;
      for (let i = 0; i < terms.length; i += batchSize) {
        const batch = terms.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(terms.length/batchSize)} for ${category}: ${batch.length} terms`);
        
        for (const term of batch) {
          let retryCount = 0;
          const maxRetries = 3;
          let success = false;
          
          while (retryCount <= maxRetries && !success) {
            try {
              // Check if term already exists
              const { data: existing } = await supabase
                .from('dictionary')
                .select('id, term')
                .eq('term', term)
                .single();

              if (existing) {
                console.log(`Term "${term}" already exists, skipping...`);
                results.push({
                  term: term,
                  category: category,
                  status: 'skipped',
                  reason: 'already_exists',
                  existing_id: existing.id
                });
                success = true;
                break;
              }

              console.log(`Generating term: "${term}" (category: ${category}, attempt: ${retryCount + 1}/${maxRetries + 1})`);
              
              // Use the detailed category directly (database now supports them)
              console.log(`Using detailed category: "${category}"`);
              
              // Generate using our enhanced AI function with direct call to avoid recursion issues
              const generationResponse = await supabase.functions.invoke('ai-lexicon-generator-with-retry', {
                body: {
                  term: term,
                  category: category,
                  languages: ['en', 'ar'],
                  priority: priority
                }
              });

              if (generationResponse.error) {
                throw new Error(`Supabase function error: ${generationResponse.error.message}`);
              }

              const generationResult = generationResponse.data;

              if (generationResult?.success) {
                totalGenerated++;
                results.push({
                  term: term,
                  category: category,
                  status: 'success',
                  id: generationResult.term?.id,
                  attempt_count: retryCount + 1
                });
                console.log(`✅ Generated: ${term} (ID: ${generationResult.term?.id})`);
                success = true;
              } else {
                // Categorize different types of failures for better reporting
                const errorMessage = generationResult?.error || 'Unknown generation error';
                const skipReason = generationResult?.skip_reason;
                
                if (skipReason === 'duplicate_term') {
                  // This is a duplicate, not an error - just skip it
                  results.push({
                    term: term,
                    category: category,
                    status: 'skipped',
                    reason: 'duplicate_term',
                    details: `Term already exists in database with ID: ${generationResult.existing?.id}`,
                    attempt_count: retryCount + 1
                  });
                  console.log(`⏭️  Skipped duplicate: ${term} (existing ID: ${generationResult.existing?.id})`);
                  success = true; // Don't retry duplicates
                } else if (errorMessage.includes('could not parse JSON')) {
                  // JSON parsing error - these are worth retrying
                  throw new Error(`JSON_PARSE_ERROR: ${errorMessage}`);
                } else if (errorMessage.includes('quota') || errorMessage.includes('rate_limit')) {
                  // API quota/rate limit errors - definitely retry
                  throw new Error(`API_QUOTA_ERROR: ${errorMessage}`);
                } else {
                  // Other errors
                  throw new Error(errorMessage);
                }
              }

            } catch (error) {
              retryCount++;
              const errorMessage = error.message || 'Unknown error';
              
              // Enhanced error categorization
              const isQuotaError = errorMessage.includes('API_QUOTA_ERROR') || 
                                  errorMessage.includes('429') || 
                                  errorMessage.includes('quota') ||
                                  errorMessage.includes('rate_limit');
              
              const isJSONParseError = errorMessage.includes('JSON_PARSE_ERROR') ||
                                      errorMessage.includes('could not parse JSON');
              
              const isServerError = errorMessage.includes('500') || 
                                   errorMessage.includes('502') || 
                                   errorMessage.includes('503') || 
                                   errorMessage.includes('504');
              
              const isRetryableError = isQuotaError || isJSONParseError || isServerError;
              
              if (retryCount <= maxRetries && isRetryableError) {
                // Adaptive backoff based on error type
                let baseDelay = 2000; // Default 2s
                if (isQuotaError) baseDelay = 8000; // 8s for quota errors
                if (isJSONParseError) baseDelay = 4000; // 4s for JSON errors
                if (isServerError) baseDelay = 6000; // 6s for server errors
                
                const backoffTime = Math.min(baseDelay * Math.pow(2, retryCount - 1), 120000); // Max 2 minutes
                
                let errorType = 'Unknown';
                if (isQuotaError) errorType = 'Quota/Rate Limit';
                if (isJSONParseError) errorType = 'JSON Parse Error';
                if (isServerError) errorType = 'Server Error';
                
                console.log(`⚠️  Retrying ${term} in ${backoffTime/1000}s (attempt ${retryCount}/${maxRetries}) - ${errorType}: ${errorMessage}`);
                await new Promise(resolve => setTimeout(resolve, backoffTime));
              } else {
                totalErrors++;
                const errorInfo = {
                  message: errorMessage,
                  type: error.name || 'UnknownError',
                  category: isQuotaError ? 'quota_error' : 
                           isJSONParseError ? 'json_parse_error' : 
                           isServerError ? 'server_error' : 'other_error',
                  retry_count: retryCount,
                  is_retryable: isRetryableError
                };
                
                results.push({
                  term: term,
                  category: category,
                  status: 'error',
                  error: errorInfo.message,
                  error_category: errorInfo.category,
                  error_details: errorInfo,
                  final_attempt: retryCount
                });
                console.error(`❌ Final failure for ${term} after ${retryCount} attempts: ${errorInfo.message}`);
                break;
              }
            }
          }

          // Enhanced rate limiting: wait 3-5 seconds between requests to avoid 429s
          const randomDelay = 3000 + Math.random() * 2000; // 3-5 seconds
          console.log(`💤 Rate limiting: waiting ${Math.round(randomDelay/1000)}s before next request...`);
          await new Promise(resolve => setTimeout(resolve, randomDelay));
        }
        
        // Wait 2 seconds between batches
        if (i + batchSize < terms.length) {
          console.log(`Batch complete. Waiting 2s before next batch...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Wait 2 seconds between categories
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`World Reference Seeding Complete!`);
    console.log(`📊 Results Summary:`);
    console.log(`   ✅ Generated: ${totalGenerated}`);
    console.log(`   ⏭️  Skipped (duplicates): ${results.filter(r => r.status === 'skipped').length}`);
    console.log(`   ❌ Errors: ${totalErrors}`);
    
    // Categorize errors for better reporting
    const errorsByCategory = results.filter(r => r.status === 'error').reduce((acc, result) => {
      const category = result.error_category || 'other_error';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    if (Object.keys(errorsByCategory).length > 0) {
      console.log(`   📋 Error breakdown:`, errorsByCategory);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `World Reference Seeding Complete!`,
      summary: {
        total_generated: totalGenerated,
        total_skipped: results.filter(r => r.status === 'skipped').length,
        total_errors: totalErrors,
        error_breakdown: errorsByCategory,
        categories_processed: categories.length,
        processing_time: new Date().toISOString()
      },
      results: results,
      sample_terms: results.filter(r => r.status === 'success').slice(0, 5),
      skipped_duplicates: results.filter(r => r.status === 'skipped').slice(0, 3)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in world-reference-seeder:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});