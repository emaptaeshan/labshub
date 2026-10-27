/* Optional shared data layer. Runs only when config.js has Supabase settings. Exposes the Hub state through window.LabsHub (set by app.js). */
(async function(){
  const CFG=window.LABS_CONFIG||{};const H=window.LabsHub;if(!H||!CFG.supabaseUrl||!CFG.supabaseAnonKey)return;
  const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  const db=createClient(CFG.supabaseUrl,CFG.supabaseAnonKey);let user=null,saving=false;
  const signIn=()=>{const app=document.getElementById('app');app.innerHTML='';const box=document.createElement('div');box.className='estate';box.style.marginTop='80px';box.innerHTML='<b>Sign in to Labs Delivery</b><p>Use your Emapta account.</p><button class="btn n" id="ms">Continue with Microsoft</button><div class="hint" style="margin:14px 0 6px">or get a sign-in link by email</div><div style="display:flex;gap:8px"><input class="in" id="em" placeholder="name@'+(CFG.allowedEmailDomain||'emapta.com')+'"><button class="btn" id="ml">Send link</button></div>';app.appendChild(box);
    document.getElementById('ms').onclick=()=>db.auth.signInWithOAuth({provider:'azure',options:{scopes:'email',redirectTo:location.origin}});
    document.getElementById('ml').onclick=async()=>{const em=document.getElementById('em').value.trim();if(CFG.allowedEmailDomain&&!em.toLowerCase().endsWith('@'+CFG.allowedEmailDomain)){alert('Please use your @'+CFG.allowedEmailDomain+' email');return;}const {error}=await db.auth.signInWithOtp({email:em,options:{emailRedirectTo:location.origin}});alert(error?error.message:'Check your inbox for the link');};};
  async function load(){const {data}=await db.from('hub').select('data').eq('id','main').maybeSingle();if(data&&data.data){H.replace(data.data);const m=H.state().team.find(t=>(t.email||'').toLowerCase()===(user.email||'').toLowerCase());if(m)H.state().me=m.id;}else{await db.from('hub').upsert({id:'main',data:H.state()});}
    db.channel('hub').on('postgres_changes',{event:'UPDATE',schema:'public',table:'hub',filter:'id=eq.main'},p=>{if(saving)return;if(p.new&&p.new.data){const me=H.state().me,view=H.state().view;H.replace(p.new.data);H.state().me=me;H.state().view=view;H.render();}}).subscribe();}
  H.onSave(async()=>{if(!user)return;saving=true;const copy=JSON.parse(JSON.stringify(H.state()));await db.from('hub').upsert({id:'main',data:copy,updated_at:new Date().toISOString()});setTimeout(()=>{saving=false;},800);});
  const {data:{session}}=await db.auth.getSession();user=session?session.user:null;
  db.auth.onAuthStateChange((_e,s)=>{user=s?s.user:null;if(user)load().then(()=>H.render());else signIn();});
  if(user){await load();H.render();}else signIn();
  H.signOut=async()=>{await db.auth.signOut();location.reload();};
})();
