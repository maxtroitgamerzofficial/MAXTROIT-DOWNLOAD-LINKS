(function(){
  const cfg=window.FIREBASE_CONFIG||{};
  const ready=cfg.apiKey&&cfg.apiKey!=="PASTE_API_KEY"&&cfg.projectId&&cfg.projectId!=="YOUR_PROJECT_ID";
  window.hubCloud={ready:false,db:null,auth:null};
  if(!ready||!window.firebase)return;
  try{
    if(!firebase.apps.length)firebase.initializeApp(cfg);
    window.hubCloud={ready:true,db:firebase.firestore(),auth:firebase.auth()};
  }catch(e){console.error("Firebase setup:",e);}
})();