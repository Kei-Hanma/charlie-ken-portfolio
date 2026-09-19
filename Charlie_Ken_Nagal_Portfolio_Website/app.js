const $ = s => document.querySelector(s);
document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("scroll",()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  $("#progress").style.width=(scrollY/Math.max(max,1)*100)+"%";
});

$("#menu").addEventListener("click",()=>$("#navLinks").classList.toggle("mobile"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>$("#navLinks").classList.remove("mobile")));

const modal=$("#modal"), content=$("#modalContent");
document.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",closeModal));
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
function openModal(html){content.innerHTML=html;modal.classList.add("open");modal.setAttribute("aria-hidden","false")}

const demos={
todo:()=>{
 openPhone("Task Manager","Kotlin • SQLite • Android concept",`
   <div class="app-card"><div class="phone-demo-input"><input class="app-input" id="ptodo" placeholder="New task…"><button class="app-btn app-primary" id="padd">+</button></div><div id="ptasks" class="phone-list"></div></div>
   <div class="app-card"><h4>Today</h4><p>Organize priorities and mark work complete.</p></div>`,
   `<h3>Task Manager</h3><p>A realistic Android-style productivity screen instead of a generic browser widget. Add, complete, and delete tasks directly inside the phone.</p><div class="tech"><span>CRUD</span><span>SQLite concept</span><span>Android UI</span></div><div class="demo-feature-note">Designed to communicate the original project's mobile-app context immediately to recruiters.</div>`,
   ()=>{
     let tasks=JSON.parse(localStorage.getItem("ck_tasks")||"[]");
     const render=()=>{$("#ptasks").innerHTML=tasks.length?tasks.map((t,i)=>`<div class="mini-row"><input type="checkbox" data-t="${i}" ${t.done?"checked":""}><span style="flex:1;${t.done?"text-decoration:line-through;color:#9aa2ac":""}">${escape(t.text)}</span><button class="app-btn" data-del="${i}">×</button></div>`).join(""):`<p style="padding:10px;color:#9aa2ac;font-size:9px">No tasks yet — add your first task.</p>`};
     $("#padd").onclick=()=>{let v=$("#ptodo").value.trim();if(!v)return;tasks.push({text:v,done:false});localStorage.setItem("ck_tasks",JSON.stringify(tasks));$("#ptodo").value="";render()};
     $("#ptasks").onclick=e=>{if(e.target.dataset.t!==undefined){tasks[e.target.dataset.t].done=!tasks[e.target.dataset.t].done;localStorage.setItem("ck_tasks",JSON.stringify(tasks));render()}if(e.target.dataset.del!==undefined){tasks.splice(e.target.dataset.del,1);localStorage.setItem("ck_tasks",JSON.stringify(tasks));render()}};
     render();
   });
},
contacts:()=>{
 openPhone("Contacts","Android • RecyclerView concept",`
   <div class="app-card"><input class="app-input" id="psearch" placeholder="Search contacts…"></div><div id="pcontacts" class="phone-list"></div>
   <div class="app-card"><input class="app-input" id="pname" placeholder="Name"><div style="height:5px"></div><input class="app-input" id="pphone" placeholder="Phone"><div style="height:7px"></div><button class="app-btn app-primary" id="pcontactadd" style="width:100%">Add contact</button></div>`,
   `<h3>Contact List</h3><p>A phone-first contact manager showing search, record creation, and deletion in a familiar Android layout.</p><div class="tech"><span>RecyclerView</span><span>CRUD</span><span>Mobile UI</span></div><div class="demo-feature-note">The interaction is intentionally presented as an app, not a desktop form.</div>`,
   ()=>{
     let contacts=JSON.parse(localStorage.getItem("ck_contacts")||"[]");
     const render=()=>{let q=($("#psearch")?.value||"").toLowerCase();let a=contacts.filter(x=>(x.n+" "+x.p).toLowerCase().includes(q));$("#pcontacts").innerHTML=a.length?a.map((x,i)=>`<div class="mini-row"><span class="avatar">${escape(x.n[0]||"?")}</span><span style="flex:1"><b>${escape(x.n)}</b><br><small style="color:#9aa2ac">${escape(x.p||"No phone")}</small></span><button class="app-btn" data-c="${i}">×</button></div>`).join(""):`<p style="padding:10px;color:#9aa2ac;font-size:9px">No contacts found.</p>`};
     $("#psearch").oninput=render;
     $("#pcontactadd").onclick=()=>{let n=$("#pname").value.trim();if(!n)return;contacts.push({n,p:$("#pphone").value.trim()});localStorage.setItem("ck_contacts",JSON.stringify(contacts));$("#pname").value="";$("#pphone").value="";render()};
     $("#pcontacts").onclick=e=>{if(e.target.dataset.c!==undefined){contacts.splice(e.target.dataset.c,1);localStorage.setItem("ck_contacts",JSON.stringify(contacts));render()}};
     render();
   });
},
quiz:()=>{
 openPhone("Quick Quiz","Kotlin • State + scoring concept",`
   <div class="app-card" id="pquiz"></div>`,
   `<h3>True / False Quiz</h3><p>A compact mobile quiz with question state, instant feedback, scoring, and replay.</p><div class="tech"><span>State</span><span>Scoring</span><span>Android</span></div><div class="demo-feature-note">The phone frame makes the original mobile-development context obvious at first glance.</div>`,
   ()=>{
     const qs=[["RecyclerView is designed for efficiently displaying lists.","true"],["SQLite is a relational database engine.","true"],["Kotlin can be used for Android development.","true"],["CSS is a database language.","false"],["A browser can request location with permission.","true"]];let i=0,score=0;
     const show=()=>{if(i>=qs.length){$("#pquiz").innerHTML=`<div class="eyebrow" style="color:#a27d39">FINAL SCORE</div><div style="font:800 38px Manrope;color:#84642c">${score}/${qs.length}</div><button class="app-btn app-primary" id="pagain">Play again</button>`;$("#pagain").onclick=()=>{i=0;score=0;show()};return}$("#pquiz").innerHTML=`<p style="font-size:9px;color:#9aa2ac">QUESTION ${i+1} / ${qs.length}</p><h4>${qs[i][0]}</h4><button class="answer" data-a="true">True</button><button class="answer" data-a="false">False</button>`;document.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{if(b.dataset.a===qs[i][1])score++;i++;show()})};show();
   });
},
weather:()=>{
 openPhone("Weather","JavaScript • API integration",`
   <div class="app-card"><div class="phone-demo-input"><input class="app-input" id="pcity" value="Manila"><button class="app-btn app-primary" id="pweather">Go</button></div><div id="pweatherResult"><p>Search a city to view live conditions.</p></div></div>
   <div class="app-card"><h4>API-powered</h4><p>Uses live geocoding and weather data when connected to the internet.</p></div>`,
   `<h3>Weather Finder</h3><p>A mobile-style weather screen backed by a live public API. Search cities and see current temperature, humidity, and wind.</p><div class="tech"><span>REST API</span><span>JavaScript</span><span>Async</span></div><div class="demo-feature-note">This one demonstrates that the portfolio projects aren't static screenshots — they can communicate real API integration.</div>`,
   ()=>{
     $("#pweather").onclick=async()=>{const city=$("#pcity").value.trim();if(!city)return;$("#pweatherResult").innerHTML="<p>Loading live data…</p>";try{const g=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`).then(r=>r.json());if(!g.results?.length){$("#pweatherResult").innerHTML="<p>City not found.</p>";return}const x=g.results[0],w=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${x.latitude}&longitude=${x.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`).then(r=>r.json());$("#pweatherResult").innerHTML=`<div style="font:800 28px Manrope;color:#15191f">${w.current.temperature_2m}°C</div><p><b>${x.name}</b>, ${x.country}<br>${w.current.relative_humidity_2m}% humidity • ${w.current.wind_speed_10m} km/h wind</p>`}catch(e){$("#pweatherResult").innerHTML="<p>Weather service unavailable.</p>"}};
   });
}
};

function openPhone(title,subtitle,screen,details,init){
 openModal(`<div class="phone-stage"><div class="phone"><div class="phone-screen"><div class="app-status"><span>9:41</span><span>● ● ▰</span></div><div class="app-header"><div class="app-brand">${title}</div><small>${subtitle}</small></div><div class="app-body">${screen}</div><div class="app-bottom"><b>⌂ Home</b><span>◫ Activity</span><span>⚙ More</span></div></div></div><div class="mobile-details">${details}</div></div>`);
 init();
}

document.querySelectorAll(".demo").forEach(card=>card.querySelector("button").onclick=()=>demos[card.dataset.demo]());
function escape(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
