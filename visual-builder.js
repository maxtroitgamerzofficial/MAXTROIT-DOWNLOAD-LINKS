/* MAXTROIT visual builder: preview selection, style editing, drag reorder and Firestore save. */
(()=>{
 const $=s=>document.querySelector(s),frame=$("#vb-frame"),status=$("#vb-status");
 if(!frame)return;
 let selected=null,doc=null,edits={elements:{},orders:{}},dragged=null;
 const f={text:$("#vb-text"),color:$("#vb-color"),background:$("#vb-background"),size:$("#vb-size"),padding:$("#vb-padding"),radius:$("#vb-radius"),image:$("#vb-image"),link:$("#vb-link")};
 const say=t=>status.textContent=t;
 function path(el){
  if(el.id)return "#"+CSS.escape(el.id);
  const parts=[];let n=el;
  while(n&&n.nodeType===1&&n!==doc.body){
   let p=n.tagName.toLowerCase();
   if(n.parentElement){const same=[...n.parentElement.children].filter(x=>x.tagName===n.tagName);if(same.length>1)p+=":nth-of-type("+(same.indexOf(n)+1)+")"}
   parts.unshift(p);n=n.parentElement;
   if(n?.id){parts.unshift("#"+CSS.escape(n.id));break}
  }
  return parts.join(" > ");
 }
 function canPick(el){return el&&el.nodeType===1&&!["HTML","BODY","SCRIPT","STYLE","META","LINK","IFRAME","INPUT","SELECT","OPTION","TEXTAREA"].includes(el.tagName)&&!el.closest("#grid .card")}
 function hex(v){const m=String(v).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);return m?"#"+m.slice(1,4).map(x=>Number(x).toString(16).padStart(2,"0")).join(""):null}
 function enable(){
  try{
   doc=frame.contentDocument;if(!doc?.body)throw Error();
   const css=doc.createElement("style");css.textContent=".vb-hover{outline:2px dashed #16a8e0!important;outline-offset:2px;cursor:crosshair!important}.vb-picked{outline:3px solid #ff9b35!important;outline-offset:2px;cursor:move!important}";doc.head.appendChild(css);
   doc.addEventListener("mouseover",e=>{const el=e.target.closest("*");if(canPick(el))el.classList.add("vb-hover")});
   doc.addEventListener("mouseout",e=>e.target.closest("*")?.classList.remove("vb-hover"));
   doc.addEventListener("click",e=>{const el=e.target.closest("*");if(!canPick(el))return;e.preventDefault();e.stopPropagation();choose(el)},{capture:true});
   doc.addEventListener("dragstart",e=>{const el=e.target.closest("*");if(!canPick(el))return;dragged=el;e.dataTransfer?.setData("text/plain","MAXTROIT")});
   doc.addEventListener("dragover",e=>{if(dragged&&canPick(e.target.closest("*")))e.preventDefault()});
   doc.addEventListener("drop",e=>{
    const target=e.target.closest("*");
    if(!dragged||!canPick(target)||dragged===target||dragged.parentElement!==target.parentElement)return;
    e.preventDefault();target.parentElement.insertBefore(dragged,target);
    edits.orders[path(target.parentElement)]=[...target.parentElement.children].filter(canPick).map(path);
    say("Order changed in preview. Save visual changes to publish.");dragged=null;choose(target);
   });
   say("Preview ready. Click an element to edit it.");
  }catch(e){say("Preview could not load. Check the connection and reload it.")}
 }
 function choose(el){
  if(selected)selected.classList.remove("vb-picked");
  selected=el;selected.classList.add("vb-picked");selected.draggable=true;
  $("#vb-selected-name").textContent=el.tagName.toLowerCase()+(el.id?" #"+el.id:"");
  const p=edits.elements[path(el)]||{},cs=getComputedStyle(el);
  f.text.value=p.text??el.innerText.trim().slice(0,500);
  f.color.value=p.style?.color||hex(cs.color)||"#f5f7ff";
  f.background.value=p.style?.backgroundColor||hex(cs.backgroundColor)||"#10182a";
  f.size.value=parseInt(p.style?.fontSize||cs.fontSize)||16;
  f.padding.value=parseInt(p.style?.padding||cs.padding)||0;
  f.radius.value=parseInt(p.style?.borderRadius||cs.borderRadius)||0;
  f.image.value=p.src||(el.matches("img")?el.getAttribute("src")||"":"");
  f.link.value=p.href||(el.matches("a")?el.getAttribute("href")||"":"");
  Object.values(f).forEach(x=>x.disabled=false);
  f.image.disabled=!el.matches("img");f.link.disabled=!el.matches("a");
  $("#vb-apply").disabled=false;$("#vb-reset").disabled=false;
 }
 function apply(){
  if(!selected)return;
  const key=path(selected),p=edits.elements[key]||(edits.elements[key]={style:{}});
  p.text=f.text.value;
  p.style={color:f.color.value,backgroundColor:f.background.value,fontSize:Math.max(8,Math.min(120,Number(f.size.value)||16))+"px",padding:Math.max(0,Math.min(160,Number(f.padding.value)||0))+"px",borderRadius:Math.max(0,Math.min(100,Number(f.radius.value)||0))+"px"};
  if(selected.matches("img")&&f.image.value){
   if(!/^https:\/\//i.test(f.image.value)&&!/^data:image\/(png|jpeg|webp|gif);base64,/i.test(f.image.value)){say("Image URL must use HTTPS or a supported image data URL.");return}
   p.src=f.image.value;selected.src=p.src;
  }
  if(selected.matches("a")&&f.link.value){
   if(!/^https:\/\//i.test(f.link.value)&&!f.link.value.startsWith("#")){say("Link must use HTTPS or a page anchor.");return}
   p.href=f.link.value;selected.href=p.href;
  }
  selected.textContent=p.text;Object.assign(selected.style,p.style);
  say("Preview updated. Save visual changes to publish.");
 }
 $("#vb-apply").addEventListener("click",apply);
 $("#vb-reset").addEventListener("click",()=>{
  if(!selected)return;delete edits.elements[path(selected)];
  say("Selected element reset in preview. Reloading preview.");frame.contentWindow.location.reload();
 });
 $("#vb-reload").addEventListener("click",()=>frame.contentWindow.location.reload());
 frame.addEventListener("load",()=>setTimeout(enable,450));
 $("#vb-save").addEventListener("click",async()=>{
  if(!window.hubCloud?.ready||window.hubCloud.auth.currentUser?.uid!==window.ADMIN_UID){say("Administrator sign-in is required.");return}
  const b=$("#vb-save");b.disabled=true;
  try{
   const ref=hubCloud.db.collection("siteConfig").doc("public");
   await ref.set({visualEdits:edits,visualEditsUpdated:Date.now()},{merge:true});
   const check=await ref.get();
   if(!check.exists||!check.data().visualEdits)throw Error("Save could not be verified.");
   say("Visual changes saved. Refresh the public website to see them.");
  }catch(e){say("Save failed: "+(e.message||"Check your connection."))}
  finally{b.disabled=false}
 });
 frame.addEventListener("load",()=>{
  edits={elements:{},orders:{}};
  window.hubCloud?.db?.collection("siteConfig").doc("public").get().then(s=>{
   if(s.exists&&s.data().visualEdits)edits=s.data().visualEdits;
  }).catch(()=>{});
 });
})();