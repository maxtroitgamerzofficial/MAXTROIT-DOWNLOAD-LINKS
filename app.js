const KEY="max_download_hub_items_v1";
const seed=[{id:"welcome",title:"Welcome to MAXTROIT",description:"Your download hub is ready. New uploads will appear here.",category:"Updates",thumbnail:"",url:"",created:Date.now()}];
const grid=document.querySelector("#grid");
function localItems(){try{return JSON.parse(localStorage.getItem(KEY))||seed}catch{return seed}}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function loadItems(){
 if(window.hubCloud?.ready){try{const snap=await hubCloud.db.collection("downloads").orderBy("created","desc").get();return snap.docs.map(d=>({id:d.id,...d.data()}))}catch(e){console.error(e)}}
 return localItems();
}
if(grid){
 const search=document.querySelector("#search"),category=document.querySelector("#category");
 document.querySelector("#year").textContent=new Date().getFullYear();
 let all=[];
 async function render(){
  all=await loadItems();const cats=[...new Set(all.map(x=>x.category).filter(Boolean))],old=category.value;
  category.innerHTML='<option value="">All categories</option>'+cats.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('');
  category.value=cats.includes(old)?old:"";const q=search.value.toLowerCase();
  const shown=all.filter(x=>(!category.value||x.category===category.value)&&(!q||(x.title+" "+x.description+" "+x.category).toLowerCase().includes(q)));
  grid.innerHTML=shown.map(x=>'<article class="card"><div class="thumb">'+(x.thumbnail?'<img src="'+esc(x.thumbnail)+'" alt="">':"MAXTROIT")+'</div><div class="card-body"><span class="tag">'+esc(x.category||"General")+'</span><h3>'+esc(x.title)+'</h3><p>'+esc(x.description)+'</p><a class="button" href="download.html?id='+encodeURIComponent(x.id)+'">View download</a></div></article>').join("");
  document.querySelector("#count").textContent=shown.length+" items";document.querySelector("#empty").hidden=shown.length!==0;
 }
 search.addEventListener("input",render);category.addEventListener("change",render);render();
}