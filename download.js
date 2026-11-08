const id=new URLSearchParams(location.search).get("id");
const title=document.querySelector("#title"),description=document.querySelector("#description"),link=document.querySelector("#download"),error=document.querySelector("#error");
async function findItem(){
 if(!id) return null;
 if(!window.hubCloud?.ready) throw new Error("Cloud database is not connected.");
 const d=await hubCloud.db.collection("downloads").doc(id).get();
 return d.exists?{id:d.id,...d.data()}:null;
}
(async()=>{
 try{
  const item=await findItem();
  if(!item||!item.url) throw new Error("This download is unavailable.");
  const parsed=new URL(item.url);
  if(!["http:","https:"].includes(parsed.protocol)) throw new Error("Invalid download link.");
  title.textContent=item.title||"Download";
  description.textContent=item.description||"";
  link.href=parsed.href;
  link.hidden=false;
  document.title=(item.title||"Download")+" · MAXTROIT OFFICIAL";
 }catch(e){
  console.error("Download details:",e);
  title.textContent="Download unavailable";
  description.hidden=true;
  error.hidden=false;
 }
})();