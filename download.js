const id=new URLSearchParams(location.search).get("id");
async function findItem(){
 if(window.hubCloud?.ready){try{const d=await hubCloud.db.collection("downloads").doc(id).get();return d.exists?{id:d.id,...d.data()}:null}catch(e){console.error(e)}}
 try{return (JSON.parse(localStorage.getItem("max_download_hub_items_v1"))||[]).find(x=>x.id===id)||null}catch{return null}
}
(async()=>{const item=await findItem();if(!item||!item.url){document.querySelector("#title").textContent="Download not found";document.querySelector("#timer").hidden=true;document.querySelector("#error").hidden=false;return}
 document.querySelector("#title").textContent=item.title;document.querySelector("#description").textContent=item.description||"";
 let left=5;const timer=document.querySelector("#timer"),link=document.querySelector("#download");timer.textContent=left;
 const tick=setInterval(()=>{left--;timer.textContent=left;if(left<=0){clearInterval(tick);timer.textContent="Ready";link.href=item.url;link.hidden=false}},1000);
})();