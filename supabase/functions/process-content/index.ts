import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentProcessRequest {
  contentId: string;
}

// Category rules for auto-categorization
const categoryRules = {
  Leadership: ['leadership', 'influence', 'integrity', 'communication', 'decision-making', 'teamwork', 'empathy', 'management', 'delegation', 'vision'],
  Psychology: ['resilience', 'growth mindset', 'motivation', 'attention', 'memory', 'self-control', 'emotional intelligence', 'mindfulness', 'psychology', 'mental health'],
  Money: ['budgeting', 'financial literacy', 'investing', 'entrepreneurship', 'savings', 'income', 'expenses', 'financial planning', 'money management', 'economics'],
  'Digital Life': ['digital citizenship', 'online safety', 'ai literacy', 'social media', 'cybersecurity', 'digital footprint', 'technology', 'internet', 'privacy'],
  'Study Skills': ['note-taking', 'time management', 'exam strategy', 'study techniques', 'learning', 'organization', 'productivity', 'academic', 'research', 'critical thinking']
};

// Stopwords to exclude from term extraction
const stopwords = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'among', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must',
  'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
  'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
]);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { contentId }: ContentProcessRequest = await req.json();

    console.log(`Processing content: ${contentId}`);

    // Fetch content from database
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('*')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      throw new Error(`Content not found: ${contentError?.message}`);
    }

    // 1. Auto-categorize content
    const categories = await autoCategorize(content.body_text, openaiApiKey);
    console.log(`Auto-assigned categories: ${categories.join(', ')}`);

    // 2. Extract and process terms
    const { knownTerms, newCandidates } = await extractTerms(content.body_html, supabase);
    console.log(`Found ${knownTerms.length} known terms, ${newCandidates.length} new candidates`);

    // 3. Create draft entries for new terms
    for (const candidate of newCandidates) {
      await createDraftTerm(candidate, contentId, supabase);
    }

    // 4. Link known terms in HTML
    const linkedHtml = await linkKnownTerms(content.body_html, knownTerms);

    // 5. Update content with processed data
    const tags = [...new Set([...knownTerms.map(t => t.term.toLowerCase()), ...(content.tags || [])])];
    
    const { error: updateError } = await supabase
      .from('content')
      .update({
        categories,
        tags,
        body_html: linkedHtml,
        auto_indexed_at: new Date().toISOString()
      })
      .eq('id', contentId);

    if (updateError) {
      throw new Error(`Failed to update content: ${updateError.message}`);
    }

    // 6. Log analytics
    await logAnalytics(supabase, {
      content_id: contentId,
      categories_assigned: categories.length,
      terms_linked: knownTerms.length,
      new_drafts_created: newCandidates.length
    });

    console.log(`Content processing complete for: ${contentId}`);

    return new Response(JSON.stringify({
      success: true,
      categories,
      termsLinked: knownTerms.length,
      newDraftsCreated: newCandidates.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function autoCategorize(bodyText: string, openaiApiKey: string): Promise<string[]> {
  const text = bodyText.toLowerCase();
  const assignedCategories: string[] = [];

  // Rule-based categorization
  for (const [category, terms] of Object.entries(categoryRules)) {
    let matchCount = 0;
    for (const term of terms) {
      if (text.includes(term.toLowerCase())) {
        matchCount++;
      }
    }
    if (matchCount >= 2) {
      assignedCategories.push(category);
    }
  }

  // AI-enhanced categorization for better accuracy
  if (assignedCategories.length === 0) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: `You are a content categorizer for TMA (Teenagers Management Academy). 
              Analyze the content and assign 1-3 categories from: Leadership, Psychology, Money, Digital Life, Study Skills, Management.
              Return only the category names, comma-separated. If uncertain, return "General".`
            },
            {
              role: 'user',
              content: `Categorize this content:\n\n${bodyText.substring(0, 2000)}`
            }
          ],
          max_tokens: 50,
          temperature: 0.3
        }),
      });

      const data = await response.json();
      const aiCategories = data.choices[0]?.message?.content?.trim()
        .split(',')
        .map((c: string) => c.trim())
        .filter((c: string) => Object.keys(categoryRules).includes(c)) || [];
      
      assignedCategories.push(...aiCategories);
    } catch (error) {
      console.error('AI categorization failed:', error);
    }
  }

  return assignedCategories.length > 0 ? assignedCategories : ['General'];
}

async function extractTerms(bodyHtml: string, supabase: any) {
  // Get existing dictionary terms
  const { data: existingTerms } = await supabase
    .from('dictionary')
    .select('term, slug, synonyms')
    .eq('status', 'published');

  const knownTerms = existingTerms || [];
  const allKnownTerms = new Set();
  
  // Build comprehensive term list including synonyms
  knownTerms.forEach((term: any) => {
    allKnownTerms.add(term.term.toLowerCase());
    if (term.synonyms) {
      term.synonyms.forEach((syn: string) => allKnownTerms.add(syn.toLowerCase()));
    }
  });

  // Extract text from HTML (simple approach)
  const textContent = bodyHtml
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Find candidate terms (2-4 words)
  const words = textContent.toLowerCase().split(/\s+/);
  const candidates = new Map();

  for (let i = 0; i < words.length; i++) {
    for (let len = 2; len <= 4 && i + len <= words.length; len++) {
      const phrase = words.slice(i, i + len).join(' ');
      
      if (isValidCandidate(phrase)) {
        candidates.set(phrase, (candidates.get(phrase) || 0) + 1);
      }
    }
  }

  // Separate known terms and new candidates
  const foundKnown = knownTerms.filter((term: any) => 
    allKnownTerms.has(term.term.toLowerCase()) && textContent.toLowerCase().includes(term.term.toLowerCase())
  );

  const newCandidates = Array.from(candidates.entries())
    .filter(([phrase, count]) => 
      !allKnownTerms.has(phrase) && 
      (count >= 2 || bodyHtml.toLowerCase().includes(`<h1>${phrase}</h1>`) || bodyHtml.toLowerCase().includes(`<h2>${phrase}</h2>`))
    )
    .map(([phrase, count]) => ({ term: phrase, frequency: count }));

  return { knownTerms: foundKnown, newCandidates };
}

function isValidCandidate(phrase: string): boolean {
  const words = phrase.split(' ');
  
  // Check if any word is a stopword
  if (words.some(word => stopwords.has(word))) {
    return false;
  }

  // Must be 2-4 words
  if (words.length < 2 || words.length > 4) {
    return false;
  }

  // Must contain at least one alphabetic character per word
  if (!words.every(word => /^[a-zA-Z-]+$/.test(word))) {
    return false;
  }

  return true;
}

async function createDraftTerm(candidate: any, contentId: string, supabase: any) {
  const slug = candidate.term.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  try {
    const { error } = await supabase
      .from('dictionary')
      .insert({
        term: candidate.term,
        slug,
        status: 'needs_review',
        created_from_content_id: contentId,
        frequency: candidate.frequency,
        context: `Auto-extracted from content. Frequency: ${candidate.frequency}`,
        short_def: '',
        category: null
      });

    if (error && !error.message.includes('unique constraint')) {
      console.error('Failed to create draft term:', error);
    }
  } catch (error) {
    console.error('Error creating draft term:', error);
  }
}

async function linkKnownTerms(bodyHtml: string, knownTerms: any[]): Promise<string> {
  let linkedHtml = bodyHtml;
  const processedTerms = new Set();

  for (const term of knownTerms) {
    if (processedTerms.has(term.slug)) continue;

    // Create regex pattern for word boundaries
    const pattern = new RegExp(`\\b(${escapeRegex(term.term)})\\b`, 'gi');
    
    // Only link first occurrence per section to avoid over-linking
    linkedHtml = linkedHtml.replace(pattern, (match, p1) => {
      if (processedTerms.has(term.slug)) return match;
      
      processedTerms.add(term.slug);
      return `<span class="tma-term" data-term="${term.slug}" data-definition="${escapeHtml(term.short_def || 'Definition available in dictionary')}">${match}</span>`;
    });
  }

  return linkedHtml;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function logAnalytics(supabase: any, data: any) {
  try {
    await supabase.from('dictionary_analytics').insert([
      {
        content_id: data.content_id,
        event_type: 'auto_category_assigned',
        metadata: { 
          categories_count: data.categories_assigned,
          terms_linked: data.terms_linked,
          new_drafts: data.new_drafts_created
        }
      }
    ]);
  } catch (error) {
    console.error('Failed to log analytics:', error);
  }
}