import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SeedRequest {
  categories?: string[];
  termsPerCategory?: number;
  totalTerms?: number;
  languages?: string[];
}

// Comprehensive seed terms by category
const SEED_TERMS = {
  Management: [
    'Leadership', 'Delegation', 'Strategic Planning', 'Team Building', 'Performance Management',
    'Decision Making', 'Organizational Culture', 'Change Management', 'Project Management', 'Resource Allocation',
    'Workflow Optimization', 'Quality Assurance', 'Risk Management', 'Stakeholder Management', 'Innovation Management',
    'Crisis Management', 'Time Management', 'Conflict Resolution', 'Succession Planning', 'Knowledge Management',
    'Operational Excellence', 'Process Improvement', 'Lean Management', 'Agile Management', 'Digital Transformation',
    'Customer Relationship Management', 'Vendor Management', 'Compliance Management', 'Budget Management', 'Talent Management'
  ],
  Leadership: [
    'Visionary Leadership', 'Transformational Leadership', 'Servant Leadership', 'Authentic Leadership', 'Emotional Intelligence',
    'Influence', 'Motivation', 'Empowerment', 'Coaching', 'Mentoring',
    'Communication Skills', 'Active Listening', 'Feedback', 'Recognition', 'Trust Building',
    'Integrity', 'Accountability', 'Transparency', 'Adaptability', 'Resilience',
    'Cultural Intelligence', 'Inclusive Leadership', 'Ethical Leadership', 'Situational Leadership', 'Collaborative Leadership',
    'Innovation Leadership', 'Digital Leadership', 'Global Leadership', 'Sustainable Leadership', 'Charismatic Leadership'
  ],
  Psychology: [
    'Cognitive Bias', 'Behavioral Economics', 'Social Psychology', 'Organizational Behavior', 'Group Dynamics',
    'Motivation Theory', 'Learning Styles', 'Personality Types', 'Stress Management', 'Work-Life Balance',
    'Burnout', 'Flow State', 'Mindfulness', 'Emotional Regulation', 'Self-Efficacy',
    'Growth Mindset', 'Fixed Mindset', 'Psychological Safety', 'Impostor Syndrome', 'Confirmation Bias',
    'Anchoring Bias', 'Availability Heuristic', 'Sunk Cost Fallacy', 'Loss Aversion', 'Cognitive Dissonance',
    'Social Identity', 'Stereotype Threat', 'Attribution Theory', 'Self-Determination Theory', 'Maslow Hierarchy'
  ],
  Finance: [
    'Cash Flow', 'Revenue Model', 'Profit Margin', 'Return on Investment', 'Net Present Value',
    'Budget Planning', 'Financial Forecasting', 'Risk Assessment', 'Capital Structure', 'Working Capital',
    'Break-Even Analysis', 'Cost-Benefit Analysis', 'Financial Ratios', 'Liquidity', 'Solvency',
    'Asset Management', 'Debt Management', 'Investment Strategy', 'Portfolio Diversification', 'Market Analysis',
    'Venture Capital', 'Angel Investment', 'Crowdfunding', 'Initial Public Offering', 'Mergers and Acquisitions',
    'Financial Modeling', 'Valuation Methods', 'Due Diligence', 'Audit Process', 'Compliance Framework'
  ],
  Entrepreneurship: [
    'Business Model', 'Value Proposition', 'Market Research', 'Competitive Analysis', 'Product-Market Fit',
    'Minimum Viable Product', 'Lean Startup', 'Pivot', 'Scaling', 'Growth Hacking',
    'Customer Acquisition', 'Customer Retention', 'User Experience', 'Brand Building', 'Market Penetration',
    'Business Plan', 'Pitch Deck', 'Bootstrapping', 'Seed Funding', 'Series A Funding',
    'Exit Strategy', 'Intellectual Property', 'Patent Protection', 'Trade Secrets', 'Licensing',
    'Joint Venture', 'Strategic Partnership', 'Market Validation', 'Customer Discovery', 'Innovation Process'
  ],
  Communication: [
    'Interpersonal Communication', 'Nonverbal Communication', 'Public Speaking', 'Presentation Skills', 'Negotiation',
    'Persuasion', 'Assertiveness', 'Diplomatic Communication', 'Cross-Cultural Communication', 'Digital Communication',
    'Written Communication', 'Email Etiquette', 'Meeting Management', 'Facilitation', 'Moderation',
    'Storytelling', 'Visual Communication', 'Data Presentation', 'Crisis Communication', 'Internal Communication',
    'External Communication', 'Media Relations', 'Social Media Management', 'Content Strategy', 'Brand Messaging',
    'Stakeholder Communication', 'Team Communication', 'Virtual Communication', 'Feedback Culture', 'Listening Skills'
  ],
  Strategy: [
    'Strategic Thinking', 'Competitive Strategy', 'Blue Ocean Strategy', 'Disruptive Innovation', 'SWOT Analysis',
    'Porter Five Forces', 'Value Chain Analysis', 'Core Competencies', 'Strategic Positioning', 'Market Segmentation',
    'Differentiation Strategy', 'Cost Leadership', 'Focus Strategy', 'Vertical Integration', 'Horizontal Integration',
    'Strategic Alliances', 'Scenario Planning', 'Strategic Implementation', 'Balanced Scorecard', 'Key Performance Indicators',
    'Benchmarking', 'Best Practices', 'Continuous Improvement', 'Strategic Innovation', 'Business Ecosystem',
    'Platform Strategy', 'Network Effects', 'First-Mover Advantage', 'Strategic Flexibility', 'Adaptive Strategy'
  ],
  Technology: [
    'Digital Transformation', 'Artificial Intelligence', 'Machine Learning', 'Data Analytics', 'Big Data',
    'Cloud Computing', 'Software as a Service', 'Platform as a Service', 'Infrastructure as a Service', 'Cybersecurity',
    'Information Technology', 'Database Management', 'User Interface', 'User Experience', 'Agile Development',
    'DevOps', 'Continuous Integration', 'Continuous Deployment', 'Version Control', 'Quality Assurance',
    'Automation', 'Robotics', 'Internet of Things', 'Blockchain', 'Cryptocurrency',
    'Virtual Reality', 'Augmented Reality', 'Mobile Technology', 'Responsive Design', 'API Integration'
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
      categories = Object.keys(SEED_TERMS),
      termsPerCategory = 30,
      totalTerms = 1000,
      languages = ['en', 'ar']
    }: SeedRequest = await req.json();

    console.log(`Starting bulk seeding for ${totalTerms} terms across categories:`, categories);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      generated_terms: [] as any[]
    };

    // Calculate terms per category
    const actualTermsPerCategory = Math.min(termsPerCategory, Math.floor(totalTerms / categories.length));
    
    for (const category of categories) {
      if (!SEED_TERMS[category as keyof typeof SEED_TERMS]) {
        console.log(`Skipping unknown category: ${category}`);
        continue;
      }

      const categoryTerms = SEED_TERMS[category as keyof typeof SEED_TERMS];
      const termsToGenerate = categoryTerms.slice(0, actualTermsPerCategory);

      console.log(`Generating ${termsToGenerate.length} terms for category: ${category}`);

      // Process terms in batches of 5 to avoid rate limits
      const batchSize = 5;
      for (let i = 0; i < termsToGenerate.length; i += batchSize) {
        const batch = termsToGenerate.slice(i, i + batchSize);
        
        // Generate batch using AI
        const systemPrompt = `You are an expert lexicographer creating comprehensive definitions for a management and leadership encyclopedia. Generate accurate, educational definitions suitable for teenagers and young adults. Return ONLY valid JSON array with no additional text.`;

        const batchPrompt = `Generate comprehensive lexicon entries for these ${category} terms: ${batch.join(', ')}.

For each term, provide:
- English phonetic spelling (IPA or simplified)
- Arabic phonetic transliteration
- Clear definition in English (100-200 words)
- Clear definition in Arabic (100-200 words)  
- Practical example sentence in English
- Practical example sentence in Arabic
- 3-5 relevant tags

Return as JSON array:
[
  {
    "term": "term name",
    "phonetic_en": "phonetic spelling",
    "phonetic_ar": "Arabic transliteration",
    "category": "${category}",
    "definition_en": "English definition",
    "definition_ar": "Arabic definition", 
    "example_en": "English example",
    "example_ar": "Arabic example",
    "tags": ["tag1", "tag2", "tag3"]
  }
]`;

        try {
          console.log(`Processing batch ${i / batchSize + 1} for ${category}...`);

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4.1-2025-04-14',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: batchPrompt }
              ],
              max_tokens: 3000,
              temperature: 0.3,
            }),
          });

          if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
          }

          const aiResponse = await response.json();
          const batchResults = JSON.parse(aiResponse.choices[0].message.content);

          // Process each term in the batch
          for (const generatedTerm of batchResults) {
            try {
              // Check if term already exists
              const { data: existing } = await supabase
                .from('dictionary')
                .select('id')
                .eq('term', generatedTerm.term)
                .single();

              if (existing) {
                console.log(`Term already exists: ${generatedTerm.term}`);
                continue;
              }

              // Generate slug
              const slug = generatedTerm.term.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .trim();

              // Prepare database entry
              const lexiconEntry = {
                term: generatedTerm.term,
                slug: slug,
                category: generatedTerm.category,
                definition_en: generatedTerm.definition_en,
                definition_ar: generatedTerm.definition_ar,
                phonetic_en_new: generatedTerm.phonetic_en,
                phonetic_ar_new: generatedTerm.phonetic_ar,
                example_en: generatedTerm.example_en,
                example_ar: generatedTerm.example_ar,
                tags: generatedTerm.tags || [],
                discipline_tags: [generatedTerm.category],
                status: 'published',
                ai_generated: true,
                verification_status: 'pending',
                ai_generated_metadata: {
                  generated_at: new Date().toISOString(),
                  model: 'gpt-4.1-2025-04-14',
                  batch_generation: true,
                  generation_version: '1.0'
                },
                last_ai_update: new Date().toISOString()
              };

              // Insert into database
              const { data: insertedTerm, error: insertError } = await supabase
                .from('dictionary')
                .insert(lexiconEntry)
                .select()
                .single();

              if (insertError) {
                throw new Error(`Database error: ${insertError.message}`);
              }

              results.success++;
              results.generated_terms.push(insertedTerm);
              
              console.log(`Successfully generated: ${generatedTerm.term} (${results.success}/${totalTerms})`);

            } catch (termError) {
              console.error(`Error processing term ${generatedTerm.term}:`, termError);
              results.failed++;
              results.errors.push(`${generatedTerm.term}: ${termError.message}`);
            }
          }

          // Add delay between batches to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (batchError) {
          console.error(`Error processing batch for ${category}:`, batchError);
          results.failed += batch.length;
          results.errors.push(`Batch error for ${category}: ${batchError.message}`);
        }
      }
    }

    console.log(`Bulk seeding completed. Success: ${results.success}, Failed: ${results.failed}`);

    return new Response(JSON.stringify({
      success: true,
      summary: {
        total_requested: totalTerms,
        successfully_generated: results.success,
        failed: results.failed,
        categories_processed: categories,
        errors: results.errors.slice(0, 10) // Limit error list
      },
      sample_terms: results.generated_terms.slice(0, 5)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in bulk-lexicon-seeder:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});