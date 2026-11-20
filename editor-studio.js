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