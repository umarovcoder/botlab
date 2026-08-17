import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  try {
    const { bot_id, workspace_id, url } = await req.json();
    if (!bot_id || !workspace_id || !url) return new Response(JSON.stringify({ error: 'bot_id, workspace_id and url are required' }), { status: 400 });
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) return new Response(JSON.stringify({ error: 'FIRECRAWL_API_KEY is not configured' }), { status: 500 });

    const crawl = await fetch('https://api.firecrawl.dev/v2/crawl', { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${firecrawlKey}`}, body:JSON.stringify({ url, limit:50, scrapeOptions:{ formats:['markdown'] }}) });
    if (!crawl.ok) return new Response(JSON.stringify({ error: await crawl.text() }), { status:502 });
    const started = await crawl.json();
    const jobId = started.id;
    if (!jobId) throw new Error('Firecrawl did not return a crawl id');

    const { data: source, error: sourceError } = await supabase.from('knowledge_sources').insert({workspace_id,bot_id,type:'url',title:url,source_url:url,status:'processing',metadata:{firecrawl_job_id:jobId}}).select().single();
    if (sourceError) throw sourceError;
    return new Response(JSON.stringify({ source_id: source.id, job_id: jobId, status:'processing' }), { headers:{'Content-Type':'application/json'} });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status:500, headers:{'Content-Type':'application/json'} });
  }
});
