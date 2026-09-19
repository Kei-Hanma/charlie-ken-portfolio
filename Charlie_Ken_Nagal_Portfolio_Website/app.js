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
 openModal(`<h3 class="demo-title">Task Manager</h3><p class="demo-sub">A browser recreation of the CRUD workflow represented by my Android / SQLite project.</p>
 <div class="demo-box"><div class="demo-row"><input id="todoInput" placeholder="Add a task…"><button class="primary" id="todoAdd">Add</button></div><div id="todoList"></div></div>`);
 let tasks=JSON.parse(localStorage.getItem("ck_tasks")||"[]");
 const render=()=>{$("#todoList").innerHTML=tasks.length?tasks.map((t,i)=>`<div class="item"><span class="${t.done?"done":""}" data-toggle="${i}">${escape(t.text)}</span><button data-delete="${i}">Delete</button></div>`).join(""):`<p style="color:#687380">No tasks yet.</p>`};
 $("#todoAdd").onclick=()=>{let v=$("#todoInput").value.trim();if(!v)return;tasks.push({text:v,done:false});localStorage.setItem("ck_tasks",JSON.stringify(tasks));$("#todoInput").value="";render()};
 $("#todoList").onclick=e=>{if(e.target.dataset.toggle!==undefined){tasks[e.target.dataset.toggle].done=!tasks[e.target.dataset.toggle].done;localStorage.setItem("ck_tasks",JSON.stringify(tasks));render()} if(e.target.dataset.delete!==undefined){tasks.splice(e.target.dataset.delete,1);localStorage.setItem("ck_tasks",JSON.stringify(tasks));render()}};
 render();
},
contacts:()=>{
 openModal(`<h3 class="demo-title">Contact List</h3><p class="demo-sub">Searchable add / delete interaction inspired by a RecyclerView contact-list project.</p>
 <div class="demo-box"><div class="demo-row"><input id="cn" placeholder="Name"><input id="cp" placeholder="Phone"><button class="primary" id="ca">Add</button></div><div class="demo-row"><input id="cs" placeholder="Search contacts…"></div><div id="cl"></div></div>`);
 let contacts=JSON.parse(localStorage.getItem("ck_contacts")||"[]");
 const render=()=>{let q=$("#cs").value.toLowerCase();let a=contacts.filter(x=>(x.n+" "+x.p).toLowerCase().includes(q));$("#cl").innerHTML=a.length?a.map((x,i)=>`<div class="item"><span><b>${escape(x.n)}</b><br><small>${escape(x.p||"No phone")}</small></span><button data-d="${i}">Delete</button></div>`).join(""):`<p style="color:#687380">No matching contacts.</p>`};
 $("#ca").onclick=()=>{let n=$("#cn").value.trim();if(!n)return;contacts.push({n,p:$("#cp").value.trim()});localStorage.setItem("ck_contacts",JSON.stringify(contacts));$("#cn").value="";$("#cp").value="";render()};
 $("#cs").oninput=render; $("#cl").onclick=e=>{if(e.target.dataset.d!==undefined){contacts.splice(e.target.dataset.d,1);localStorage.setItem("ck_contacts",JSON.stringify(contacts));render()}};render();
},
quiz:()=>{
 openModal(`<h3 class="demo-title">True / False Quiz</h3><p class="demo-sub">A playable state-and-scoring demo.</p><div class="demo-box" id="quizBox"></div>`);
 const qs=[["RecyclerView is designed for efficiently displaying lists.","true"],["SQLite is a relational database engine.","true"],["Kotlin can be used for Android development.","true"],["CSS is a database language.","false"],["A browser can request location with permission.","true"]];let i=0,score=0;
 const show=()=>{if(i>=qs.length){$("#quizBox").innerHTML=`<div class="eyebrow">RESULT</div><div class="score">${score}/${qs.length}</div><button class="answer" id="again">Play again</button>`;$("#again").onclick=()=>{i=0;score=0;show()};return}$("#quizBox").innerHTML=`<small style="color:#687380">QUESTION ${i+1} / ${qs.length}</small><p class="question">${qs[i][0]}</p><button class="answer" data-a="true">True</button><button class="answer" data-a="false">False</button>`;document.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{if(b.dataset.a===qs[i][1])score++;i++;show()})};show();
},
weather:()=>{
 openModal(`<h3 class="demo-title">Weather Finder</h3><p class="demo-sub">Live city lookup using Open-Meteo. No API key required.</p><div class="demo-box"><div class="demo-row"><input id="city" value="Manila"><button class="primary" id="ws">Search</button></div><div id="wr" style="color:#87919e">Enter a city to begin.</div></div>`);
 $("#ws").onclick=async()=>{const city=$("#city").value.trim();if(!city)return;$("#wr").textContent="Searching…";try{const g=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`).then(r=>r.json());if(!g.results?.length){$("#wr").textContent="City not found.";return}const x=g.results[0],w=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${x.latitude}&longitude=${x.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`).then(r=>r.json());$("#wr").innerHTML=`<div style="font-size:26px;color:#fff;margin-top:12px"><b>${x.name}, ${x.country}</b></div><p>${w.current.temperature_2m}°C · ${w.current.relative_humidity_2m}% humidity · ${w.current.wind_speed_10m} km/h wind</p>`}catch(e){$("#wr").textContent="Weather service unavailable right now."}};
}
};
document.querySelectorAll(".demo").forEach(card=>card.querySelector("button").onclick=()=>demos[card.dataset.demo]());
function escape(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
