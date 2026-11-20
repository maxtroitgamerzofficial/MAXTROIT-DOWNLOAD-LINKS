/* MAXTROIT Editor Studio: background, center banner and color controls. */
(()=> {
 const $=id=>document.getElementById(id),frame=$("es-frame"),status=$("es-status");
 if(!frame||!status)return;
 let current={siteBackground:{},heroArtwork:{},colors:{}},bgImage="",heroImage="";
 const defaults={siteBackground:{image:"",opacity:35,blur:0,fit:"cover",position:"center",overlayColor:"#070b16",overlayOpacity:55},heroArtwork:{banner:"",mode:"art",fit:"cover",radius:18},colors:{background:"#070b16",panel:"#10182a",text:"#f5f7ff",accent:"#ec4899",secondary:"#8c65f5"}};
 const say=t=>status.textContent=t;
 function paintFrame(){
  try{const d=frame.contentDocument,root=d.documentElement,b=current.siteBackground,h=current.heroArtwork,c=current.colors;
   root.style.setProperty("--site-bg-image",b.image?'url("'+b.image.replace(/["\\]/g,"%22")+'")':"none");
   root.style.setProperty("--site-bg-opacity",String(Number(b.opacity)/100));root.style.setProperty("--site-bg-blur",Number(b.blur)+"px");root.style.setProperty("--site-bg-position",b.position);root.style.setProperty("--site-bg-fit",b.fit);root.style.setProperty("--site-bg-overlay",b.overlayColor);root.style.setProperty("--site-bg-overlay-opacity",String(Number(b.overlayOpacity)/100));
   const body=d.body;body.style.setProperty("--bg",c.background);body.style.setProperty("--panel",c.panel);body.style.setProperty("--text",c.text);body.style.setProperty("--cyan",c.accent);body.style.setProperty("--violet",c.secondary);
   const box=d.querySelector("#hero-art");if(box){const on=h.mode==="banner"&&h.banner;box.classList.toggle("has-custom-banner",!!on);box.style.backgroundImage=on?'url("'+h.banner.replace(/["\\]/g,"%22")+'")':"";box.style.backgroundSize=h.fit;box.style.borderRadius=h.radius+"px";for(const sel of [".orb-one",".orb-two",".hero-logo","#hero-art-logo",".art-caption"]){const el=box.querySelector(sel);if(el)el.hidden=!!on}}
  }catch(e){}
 }
 function setImagePreview(id,data){const el=$(id);if(data){el.src=data;el.hidden=false}else{el.removeAttribute("src");el.hidden=true}}
 function read(){current.siteBackground={image:bgImage,opacity:Number($("es-bg-opacity").value),blur:Number($("es-bg-blur").value),fit:$("es-bg-fit").value,position:$("es-bg-position").value,overlayColor:$("es-overlay-color").value,overlayOpacity:Number($("es-overlay").value)};current.heroArtwork={banner:heroImage,mode:$("es-hero-mode").value,fit:$("es-hero-fit").value,radius:Number($("es-hero-radius").value)};current.colors={background:$("es-color-bg").value,panel:$("es-color-panel").value,text:$("es-color-text").value,accent:$("es-color-accent").value,secondary:$("es-color-secondary").value};}
 function update(){read();$("es-bg-opacity-out").textContent=current.siteBackground.opacity+"%";$("es-bg-blur-out").textContent=current.siteBackground.blur+" px";$("es-overlay-out").textContent=current.siteBackground.overlayOpacity+"%";paintFrame();say("Preview updated. Save & publish design dabane tak public site unchanged rahegi.");}
 function load(cfg){current={siteBackground:{...defaults.siteBackground,...(cfg.siteBackground||{})},heroArtwork:{...defaults.heroArtwork,...(cfg.heroArtwork||{})},colors:{background:cfg.colorBackground||defaults.colors.background,panel:cfg.colorPanel||defaults.colors.panel,text:cfg.colorText||defaults.colors.text,accent:cfg.colorAccent||defaults.colors.accent,secondary:cfg.colorSecondary||defaults.colors.secondary}};bgImage=current.siteBackground.image||"";heroImage=current.heroArtwork.banner||"";
  $("es-bg-opacity").value=current.siteBackground.opacity;$("es-bg-blur").value=current.siteBackground.blur;$("es-bg-fit").value=current.siteBackground.fit;$("es-bg-position").value=current.siteBackground.position;$("es-overlay-color").value=current.siteBackground.overlayColor;$("es-overlay").value=current.siteBackground.overlayOpacity;
  $("es-hero-mode").value=current.heroArtwork.mode;$("es-hero-fit").value=current.heroArtwork.fit;$("es-hero-radius").value=current.heroArtwork.radius;
  $("es-color-bg").value=current.colors.background;$("es-color-panel").value=current.colors.panel;$("es-color-text").value=current.colors.text;$("es-color-accent").value=current.colors.accent;$("es-color-secondary").value=current.colors.secondary;
  setImagePreview("es-bg-preview",bgImage);setImagePreview("es-hero-preview",heroImage);update();
 }
 async function imageFile(file,max){if(!file)return "";if(typeof window.readImage==="function")return await window.readImage(file,max,false);return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);const v=c.toDataURL("image/jpeg",.72);v.length>280000?reject(Error("Image compress nahi hui. Smaller image choose karo.")):resolve(v)};im.onerror=()=>reject(Error("Image read nahi hui."));im.src=r.result};r.onerror=()=>reject(Error("File read nahi hui."));r.readAsDataURL(file)})}
 $("es-bg-file").addEventListener("change",async e=>{try{bgImage=await imageFile(e.target.files[0],1400);setImagePreview("es-bg-preview",bgImage);update()}catch(err){say(err.message);e.target.value=""}});
 $("es-hero-file").addEventListener("change",async e=>{try{heroImage=await imageFile(e.target.files[0],1200);$("es-hero-mode").value="banner";setImagePreview("es-hero-preview",heroImage);update()}catch(err){say(err.message);e.target.value=""}});
 $("es-bg-remove").addEventListener("click",()=>{bgImage="";$("es-bg-file").value="";setImagePreview("es-bg-preview","");update()});
 $("es-hero-remove").addEventListener("click",()=>{heroImage="";$("es-hero-file").value="";$("es-hero-mode").value="art";setImagePreview("es-hero-preview","");update()});
 ["es-bg-opacity","es-bg-blur","es-bg-fit","es-bg-position","es-overlay-color","es-overlay","es-hero-mode","es-hero-fit","es-hero-radius","es-color-bg","es-color-panel","es-color-text","es-color-accent","es-color-secondary"].forEach(id=>$(id).addEventListener("input",update));
 $("es-reload").addEventListener("click",()=>{frame.src="index.html?editorPreview=1&reload="+Date.now()});
 $("es-reset").addEventListener("click",()=>{bgImage=defaults.siteBackground.image;heroImage=defaults.heroArtwork.banner;load({})});
 $("es-save").addEventListener("click",async()=>{
  if(!window.hubCloud?.ready||window.hubCloud.auth.currentUser?.uid!==window.ADMIN_UID){say("Administrator sign-in required.");return}
  read();const btn=$("es-save");btn.disabled=true;say("Saving design…");
  const payload={siteBackground:current.siteBackground,heroArtwork:current.heroArtwork,colorBackground:current.colors.background,colorPanel:current.colors.panel,colorText:current.colors.text,colorAccent:current.colors.accent,colorSecondary:current.colors.secondary,editorStudioUpdatedAt:Date.now()};
  try{const ref=hubCloud.db.collection("siteConfig").doc("public");await ref.set(payload,{merge:true});const snap=await ref.get();if(!snap.exists)throw Error("Save verification failed.");const saved=snap.data();if(saved.editorStudioUpdatedAt!==payload.editorStudioUpdatedAt||saved.siteBackground?.opacity!==payload.siteBackground.opacity)throw Error("Saved values could not be verified.");say("Editor Studio design saved and verified. Public website live update apply ho jana chahiye.");}
  catch(err){say("Save failed: "+(err.message||"Check Firebase connection."))}
  finally{btn.disabled=false}
 });
 frame.addEventListener("load",()=>{setTimeout(paintFrame,700);});
 window.loadEditorStudio=load;
 if(window.hubCloud?.ready){hubCloud.db.collection("siteConfig").doc("public").get().then(s=>load(s.exists?s.data():{})).catch(()=>load({}))}else load({});
})();

/* Full visual element picker/editor */
(function(){
 const $=id=>document.getElementById(id),frame=$("es-frame"),panel=$("es-element-panel");if(!frame||!panel)return;
 let doc=null,selected=null,selectMode=true,edits={elements:{},orders:{}},dirty=false,activeKey="";
 const ids=["es-el-text","es-el-link","es-el-color","es-el-bg","es-el-size","es-el-weight","es-el-align","es-el-padding","es-el-radius","es-el-width","es-el-opacity","es-el-spacing","es-el-animation","es-el-hidden"];
 const say=t=>$("es-el-status").textContent=t;
 function selector(el){if(el.id)return "#"+CSS.escape(el.id);const parts=[];let n=el;while(n&&n.nodeType===1&&n!==doc.body&&parts.length<6){let bit=n.tagName.toLowerCase();if(n.parentElement){const same=[...n.parentElement.children].filter(x=>x.tagName===n.tagName);if(same.length>1)bit+=":nth-of-type("+(same.indexOf(n)+1)+")"}parts.unshift(bit);n=n.parentElement;if(n?.id){parts.unshift("#"+CSS.escape(n.id));break}}return parts.join(" > ")}
 function valid(el){return el&&el.nodeType===1&&!["HTML","BODY","SCRIPT","STYLE","META","LINK","IFRAME","INPUT","SELECT","OPTION","TEXTAREA"].includes(el.tagName)&&!el.closest("#admin-app")}
 function enablePicker(){try{doc=frame.contentDocument;if(!doc?.body)throw Error();doc.addEventListener("click",pick,true);doc.addEventListener("mouseover",hover,true);doc.addEventListener("mouseout",unhover,true);doc.addEventListener("submit",e=>{if(selectMode)e.preventDefault()},true);setSelectMode(selectMode);say("Preview ready. Kisi bhi element par click karke select karo.");}catch(e){say("Preview load nahi hua. Reload dabao.")}}
 function hover(e){if(!selectMode)return;const el=e.target.closest("*");if(valid(el))el.classList.add("es-hover")}
 function unhover(e){e.target.closest("*")?.classList.remove("es-hover")}
 function pick(e){if(!selectMode)return;const el=e.target.closest("*");if(!valid(el))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();choose(el)}
 function setSelectMode(on){selectMode=on;doc?.body.classList.toggle("editor-select-mode",on);$("es-pick-toggle").classList.toggle("is-active",on);$("es-pick-toggle").textContent=on?"✓ Select mode ON":"✎ Select element"}
 function choose(el){if(selected)selected.classList.remove("es-picked");selected=el;activeKey=selector(el);selected.classList.add("es-picked");const patch=edits.elements[activeKey]||{},cs=doc.defaultView.getComputedStyle(el);$("es-selected-name").textContent=el.tagName.toLowerCase()+(el.id?" #"+el.id:"")+" · "+activeKey;
  $("es-el-text").value=patch.text??(el.matches("img")?"":el.innerText?.trim().slice(0,500)||"");$("es-el-link").value=patch.href??(el.matches("a")?el.getAttribute("href")||"":"");
  const hex=v=>{const m=String(v).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);return m?"#"+m.slice(1,4).map(n=>Number(n).toString(16).padStart(2,"0")).join(""):"#10182a"};
  $("es-el-color").value=patch.style?.color||hex(cs.color);$("es-el-bg").value=patch.style?.backgroundColor||hex(cs.backgroundColor);$("es-el-size").value=parseInt(patch.style?.fontSize||cs.fontSize)||16;$("es-el-weight").value=patch.style?.fontWeight||"";$("es-el-align").value=patch.style?.textAlign==="start"?"":patch.style?.textAlign||"";
  $("es-el-padding").value=parseInt(patch.style?.padding||cs.padding)||0;$("es-el-radius").value=parseInt(patch.style?.borderRadius||cs.borderRadius)||0;$("es-el-width").value=parseInt(patch.style?.width)||"";$("es-el-opacity").value=Math.round(Number(patch.style?.opacity??cs.opacity??1)*100);$("es-el-spacing").value=parseFloat(patch.style?.letterSpacing)||0;$("es-el-animation").value=patch.animation||"";$("es-el-hidden").checked=patch.hidden===true;
  ids.forEach(id=>$(id).disabled=false);$("es-el-link").disabled=!el.matches("a");$("es-el-image").disabled=!el.matches("img");$("es-el-apply").disabled=false;$("es-el-reset").disabled=false;$("es-el-save").disabled=false;say("Selected element ready. Values change kar ke Apply to preview dabao.");panel.scrollIntoView({behavior:"smooth",block:"nearest"});
 }
 function patchFromControls(){const style={color:$("es-el-color").value,backgroundColor:$("es-el-bg").value,fontSize:Math.max(8,Math.min(120,Number($("es-el-size").value)||16))+"px",fontWeight:$("es-el-weight").value,padding:Math.max(0,Math.min(160,Number($("es-el-padding").value)||0))+"px",borderRadius:Math.max(0,Math.min(100,Number($("es-el-radius").value)||0))+"px",textAlign:$("es-el-align").value,width:$("es-el-width").value?Math.max(20,Math.min(1400,Number($("es-el-width").value)))+"px":"",opacity:String(Math.max(0,Math.min(100,Number($("es-el-opacity").value)))/100),letterSpacing:Number($("es-el-spacing").value)+"px"};
  Object.keys(style).forEach(k=>{if(style[k]==="")delete style[k]});return {text:$("es-el-text").value,href:$("es-el-link").value,hidden:$("es-el-hidden").checked,style,animation:$("es-el-animation").value};}
 function apply(){if(!selected)return;const patch=patchFromControls();if(patch.href&&!/^https:\/\//i.test(patch.href)&&!patch.href.startsWith("#")){say("Link https:// ya #anchor hona chahiye.");return}if(patch.href&&!selected.matches("a")){say("Link sirf link element par apply hoga.");return}
  if(selected.matches("img")){const src=selected.getAttribute("src");if(src)patch.src=src}
  if(selected.matches("a")&&patch.href)selected.href=patch.href;
  if(!selected.matches("img")&&patch.text!==undefined)selected.textContent=patch.text;
  if(selected.matches("img")&&patch.text)selected.alt=patch.text;
  if(patch.src&&selected.matches("img"))selected.src=patch.src;
  Object.assign(selected.style,patch.style);selected.hidden=patch.hidden;selected.classList.remove("es-anim-glow","es-anim-pulse","es-anim-flash","es-anim-float");if(patch.animation)selected.classList.add("es-anim-"+patch.animation.replace("es-",""));
  edits.elements[activeKey]=patch;dirty=true;$("es-el-save").disabled=false;say("Preview update ho gaya. Save element changes se draft Firestore mein save hoga.");}
 $("es-pick-toggle").addEventListener("click",()=>setSelectMode(!selectMode));
 $("es-el-apply").addEventListener("click",apply);
 $("es-el-reset").addEventListener("click",()=>{if(!selected)return;delete edits.elements[activeKey];selected.removeAttribute("style");selected.hidden=false;selected.classList.remove("es-anim-glow","es-anim-pulse","es-anim-flash","es-anim-float");say("Selected element ke preview edits reset ho gaye. Save dabane par reset publish hoga.")});
 $("es-el-image").addEventListener("change",async e=>{const file=e.target.files[0];if(!file||!selected?.matches("img"))return;try{const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const scale=Math.min(1,1200/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*scale;c.height=im.height*scale;c.getContext("2d").drawImage(im,0,0,c.width,c.height);const v=c.toDataURL("image/jpeg",.72);if(v.length>280000)reject(Error("Image chhoti/compress karke upload karo."));else resolve(v)};im.onerror=()=>reject(Error("Image open nahi hui"));im.src=r.result};r.onerror=()=>reject(Error("File read nahi hui"));r.readAsDataURL(file)});selected.src=data;const p=edits.elements[activeKey]||(edits.elements[activeKey]={style:{}});p.src=data;dirty=true;say("Image preview updated. Save element changes dabao.");}catch(err){say(err.message)}});
 $("es-el-save").addEventListener("click",async()=>{if(!window.hubCloud?.ready||window.hubCloud.auth.currentUser?.uid!==window.ADMIN_UID){say("Admin sign-in required.");return}const b=$("es-el-save");b.disabled=true;try{await hubCloud.db.collection("siteConfig").doc("public").set({visualEdits:edits,visualEditsUpdated:Date.now()},{merge:true});const snap=await hubCloud.db.collection("siteConfig").doc("public").get();if(!snap.exists||!snap.data().visualEdits?.elements)throw Error("Save verification failed");dirty=false;say("Element edits saved. Public website refresh karo; changes live ho gaye.");}catch(err){say("Save failed: "+err.message);b.disabled=false}});
 $("es-reload").addEventListener("click",()=>{frame.src="index.html?editorPreview=1&refresh="+Date.now()});
 document.querySelectorAll("[data-es-device]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-es-device]").forEach(x=>x.classList.toggle("is-active",x===b));$("es-frame").parentElement.classList.toggle("is-mobile",b.dataset.esDevice==="mobile")}));
 frame.addEventListener("load",()=>setTimeout(enablePicker,600));
 window.addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue=""}});
})();
