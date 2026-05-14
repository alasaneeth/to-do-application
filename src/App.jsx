import { useState, useEffect, useCallback } from "react";

const MODULES = [
  {id:1,day:1,week:1,title:"Angular vs React",sub:"Core differences, why Angular?",topics:["Component-based architecture","TypeScript by default","Opinionated framework","CLI power"],e:"⚡"},
  {id:2,day:2,week:1,title:"Angular CLI & Setup",sub:"Project scaffolding & structure",topics:["ng new, ng serve","File structure deep-dive","angular.json config","VS Code extensions"],e:"🛠️"},
  {id:3,day:3,week:1,title:"TypeScript Essentials",sub:"Types, interfaces & decorators",topics:["Interfaces & Types","Decorators (@Component)","Generics basics","Strict mode"],e:"📘"},
  {id:4,day:4,week:1,title:"Components Deep Dive",sub:"Templates, styles & lifecycle",topics:["@Component decorator","Inline vs external templates","ViewEncapsulation","Lifecycle hooks"],e:"🧩"},
  {id:5,day:5,week:1,title:"Data Binding",sub:"One-way & two-way binding",topics:["Interpolation {{ }}","Property binding []","Event binding ()","Two-way [(ngModel)]"],e:"🔗"},
  {id:6,day:6,week:1,title:"Directives",sub:"Built-in & structural directives",topics:["*ngIf, *ngFor, *ngSwitch","ngClass, ngStyle","Custom attribute directives","ng-template"],e:"🎯"},
  {id:7,day:7,week:1,title:"Week 1 Project",sub:"Build a Todo App",topics:["Combine all Week 1 skills","Component communication","Local state management","Styling with Angular"],e:"🏆"},
  {id:8,day:8,week:2,title:"Services & DI",sub:"Dependency injection pattern",topics:["@Injectable decorator","providedIn: root","Injecting services","Singleton pattern"],e:"💉"},
  {id:9,day:9,week:2,title:"Angular Router",sub:"SPA navigation",topics:["RouterModule setup","Routes configuration","routerLink directive","Router outlet"],e:"🗺️"},
  {id:10,day:10,week:2,title:"Route Guards",sub:"Protecting routes",topics:["CanActivate guard","CanDeactivate guard","Route resolvers","Lazy loading routes"],e:"🛡️"},
  {id:11,day:11,week:2,title:"HTTP Client",sub:"API calls & observables",topics:["HttpClientModule","GET, POST, PUT, DELETE","Observable basics","Error handling"],e:"🌐"},
  {id:12,day:12,week:2,title:"RxJS Fundamentals",sub:"Reactive programming basics",topics:["Observable & Observer","map, filter, tap","switchMap, mergeMap","Subject & BehaviorSubject"],e:"🔄"},
  {id:13,day:13,week:2,title:"Template Forms",sub:"NgModel & form validation",topics:["FormsModule","ngModel directive","Template variables (#)","Validation & error messages"],e:"📋"},
  {id:14,day:14,week:2,title:"Week 2 Project",sub:"Blog App with Routing",topics:["Multi-page navigation","API integration","Form with validation","Route guards"],e:"🏆"},
  {id:15,day:15,week:3,title:"Reactive Forms",sub:"FormBuilder & validators",topics:["ReactiveFormsModule","FormGroup & FormControl","Custom validators","FormArray"],e:"⚙️"},
  {id:16,day:16,week:3,title:"Component Comms",sub:"Input, Output & services",topics:["@Input() decorator","@Output() & EventEmitter","ViewChild & ContentChild","Shared service pattern"],e:"📡"},
  {id:17,day:17,week:3,title:"Pipes",sub:"Data transformation",topics:["Built-in pipes","Custom pipe creation","Pure vs Impure pipes","Async pipe"],e:"🪣"},
  {id:18,day:18,week:3,title:"State Management",sub:"NgRx basics",topics:["NgRx Store setup","Actions & Reducers","Selectors","Effects for side effects"],e:"🏪"},
  {id:19,day:19,week:3,title:"Change Detection",sub:"OnPush & zones",topics:["Default vs OnPush","ChangeDetectorRef","Zone.js","Performance patterns"],e:"🔍"},
  {id:20,day:20,week:3,title:"Angular Animations",sub:"trigger, state & transition",topics:["BrowserAnimationsModule","trigger() & state()","transition() & animate()","keyframes()"],e:"🎬"},
  {id:21,day:21,week:3,title:"Week 3 Project",sub:"E-commerce Product List",topics:["NgRx state management","Reactive forms checkout","Animations","Lazy loaded modules"],e:"🏆"},
  {id:22,day:22,week:4,title:"Angular Material",sub:"UI component library",topics:["MatModule imports","Theming & typography","CDK utilities","Form field components"],e:"💎"},
  {id:23,day:23,week:4,title:"Unit Testing",sub:"Jasmine & Karma",topics:["TestBed setup","Component testing","Service testing","Mock & Spy"],e:"🧪"},
  {id:24,day:24,week:4,title:"E2E Testing",sub:"Cypress integration",topics:["Cypress setup","Writing E2E tests","Fixtures & stubs","CI integration"],e:"🤖"},
  {id:25,day:25,week:4,title:"Performance",sub:"Lazy loading & optimization",topics:["Lazy loading modules","Preloading strategies","trackBy in ngFor","Bundle analysis"],e:"🚀"},
  {id:26,day:26,week:4,title:"PWA & SSR",sub:"Service workers & Universal",topics:["@angular/pwa setup","Service worker config","Angular Universal","SSR vs CSR"],e:"📱"},
  {id:27,day:27,week:4,title:"Deployment",sub:"Build & deploy to Vercel",topics:["ng build --prod","Environment configs","Vercel deployment","CI/CD basics"],e:"🌍"},
  {id:28,day:28,week:4,title:"Advanced RxJS",sub:"Complex operators & patterns",topics:["combineLatest, forkJoin","debounceTime, distinctUntilChanged","Retry & catchError","Custom operators"],e:"🌊"},
  {id:29,day:29,week:4,title:"Micro-Frontend",sub:"Module federation basics",topics:["Webpack module federation","Shell & remote apps","Shared libraries","Dynamic imports"],e:"🧱"},
  {id:30,day:30,week:4,title:"Final Project",sub:"Full-stack Angular App",topics:["All concepts combined","Real API integration","NgRx + Angular Material","Deploy to Vercel"],e:"🎓"},
];

const WK = {
  1:{name:"Foundation",color:"#FF6B35",bg:"rgba(255,107,53,0.12)"},
  2:{name:"Services & Routing",color:"#7C3AED",bg:"rgba(124,58,237,0.12)"},
  3:{name:"Advanced Patterns",color:"#059669",bg:"rgba(5,150,105,0.12)"},
  4:{name:"Production Ready",color:"#DC2626",bg:"rgba(220,38,38,0.12)"},
};

const APPR = [
  {at:7,  msg:"React dev Angular kathukkiran — super start! 🔥", sub:"Week 1 complete! Foundation solid!"},
  {at:14, msg:"Services & Routing mastered! Half-way hero! 💪",  sub:"Week 2 complete! You're halfway there!"},
  {at:21, msg:"Advanced patterns cracked! Almost an expert! 🚀", sub:"Week 3 complete! One more week to go!"},
  {at:30, msg:"ANGULAR MASTER! 30 days la finish aachhu! 🏆🎉",  sub:"All 30 days complete — You are an Angular Expert!"},
];

// ── Confetti ────────────────────────────────────────────────
function Confetti({ active }) {
  const COLORS = ["#FF6B35","#7C3AED","#059669","#DC2626","#FBBF24","#06B6D4","#EC4899"];
  if (!active) return null;
  return (
    <div style={{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      {Array.from({length:60}).map((_,i)=>{
        const size = 6 + Math.random()*9;
        return (
          <div key={i} style={{
            position:"absolute", top:"-12px",
            left:`${Math.random()*100}%`,
            width:`${size}px`, height:`${size}px`,
            borderRadius: Math.random()>.5 ? "50%" : "2px",
            background: COLORS[Math.floor(Math.random()*COLORS.length)],
            animation:`cfFall ${1.6+Math.random()*1.8}s ease-in ${Math.random()*.7}s forwards`,
            transform:`rotate(${Math.random()*360}deg)`,
          }}/>
        );
      })}
    </div>
  );
}

// ── Progress Ring ───────────────────────────────────────────
function Ring({ pct, color, size=68 }) {
  const r = (size-8)/2, circ = 2*Math.PI*r, off = circ-(pct/100)*circ;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={off}
        style={{transition:"stroke-dashoffset 0.9s ease",strokeLinecap:"round"}}/>
    </svg>
  );
}

// ── Toast / Celebration ─────────────────────────────────────
function Toast({ data, onClose }) {
  useEffect(()=>{ const t = setTimeout(onClose, 4200); return ()=>clearTimeout(t); },[onClose]);
  if (!data) return null;
  return (
    <div style={{
      position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
      background:"#0F1520",border:"1.5px solid #7C3AED",borderRadius:"24px",
      padding:"40px 48px",zIndex:10000,textAlign:"center",maxWidth:"440px",width:"92%",
      animation:"toastIn .4s cubic-bezier(.34,1.56,.64,1) forwards",
      boxShadow:"0 0 60px rgba(124,58,237,0.4)",
    }}>
      <div style={{fontSize:"52px",marginBottom:"14px"}}>🎉</div>
      <div style={{fontSize:"20px",fontWeight:800,color:"#fff",lineHeight:1.35,marginBottom:"10px"}}>{data.msg}</div>
      <div style={{fontSize:"13px",fontFamily:"'JetBrains Mono',monospace",color:"#A78BFA"}}>{data.sub}</div>
    </div>
  );
}

// ── Module Card ─────────────────────────────────────────────
function ModuleCard({ mod, done, onToggle }) {
  const [open, setOpen] = useState(false);
  const wk = WK[mod.week];
  return (
    <div style={{
      background: done ? wk.bg : "rgba(255,255,255,0.03)",
      border:`1px solid ${done ? wk.color+"55" : "rgba(255,255,255,0.07)"}`,
      borderRadius:"18px", padding:"18px",
      transition:"transform .25s,border-color .25s",
      animation:"slideUp .35s ease both",
      position:"relative", overflow:"hidden",
    }}
    onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
    onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
    >
      {done && <div style={{position:"absolute",right:"-8px",top:"-8px",fontSize:"72px",opacity:.05,lineHeight:1,pointerEvents:"none"}}>✓</div>}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{marginBottom:"6px",display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
            <span style={{fontSize:"10px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",
              color:wk.color,background:wk.color+"20",padding:"2px 8px",borderRadius:"100px",
              textTransform:"uppercase",letterSpacing:".6px"}}>Day {mod.day}</span>
            {done && <span style={{fontSize:"10px",color:"#10B981",background:"#10B98120",
              padding:"2px 8px",borderRadius:"100px",fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>✓ Done</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
            <span style={{fontSize:"19px"}}>{mod.e}</span>
            <span style={{fontSize:"15px",fontWeight:800,color:done?wk.color:"#E8EAF0",lineHeight:1.25}}>{mod.title}</span>
          </div>
          <div style={{fontSize:"11px",fontFamily:"'JetBrains Mono',monospace",color:"#6B7280"}}>{mod.sub}</div>
        </div>

        <button onClick={()=>onToggle(mod.id)} style={{
          width:"34px",height:"34px",borderRadius:"50%",border:"none",cursor:"pointer",
          background:done?wk.color:"rgba(255,255,255,0.08)",
          color:done?"#fff":"#6B7280",fontSize:"15px",
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:"12px",
          transition:"all .2s",
        }}>
          {done?"✓":"○"}
        </button>
      </div>

      <button onClick={()=>setOpen(o=>!o)} style={{
        background:"none",border:"none",cursor:"pointer",padding:"10px 0 0",
        fontSize:"11px",color:"#6B7280",fontFamily:"'JetBrains Mono',monospace",
        display:"flex",alignItems:"center",gap:"5px",transition:"color .2s",
      }}
      onMouseEnter={e=>e.currentTarget.style.color="#A78BFA"}
      onMouseLeave={e=>e.currentTarget.style.color="#6B7280"}
      >
        <span style={{display:"inline-block",transition:"transform .2s",transform:open?"rotate(90deg)":"none"}}>▶</span>
        {open ? "Hide topics" : `${mod.topics.length} topics to cover`}
      </button>

      {open && (
        <div style={{marginTop:"10px",display:"flex",flexDirection:"column",gap:"5px",animation:"slideUp .2s ease"}}>
          {mod.topics.map((t,i)=>(
            <div key={i} style={{fontSize:"11px",color:"#9CA3AF",fontFamily:"'JetBrains Mono',monospace",
              display:"flex",alignItems:"center",gap:"8px",padding:"6px 10px",
              background:"rgba(255,255,255,0.04)",borderRadius:"8px"}}>
              <span style={{color:wk.color,flexShrink:0}}>→</span>{t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────
export default function App() {
  const [completed, setCompleted] = useState(()=>{
    try { return JSON.parse(localStorage.getItem("ng30_v3")||"[]"); } catch { return []; }
  });
  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [activeWeek, setActiveWeek] = useState("all");

  useEffect(()=>{ localStorage.setItem("ng30_v3", JSON.stringify(completed)); },[completed]);

  const toggleDone = useCallback((id)=>{
    setCompleted(prev=>{
      const has = prev.includes(id);
      const next = has ? prev.filter(x=>x!==id) : [...prev, id];
      if (!has) {
        const appr = APPR.find(a=>a.at===next.length);
        if (appr) { setToast(appr); setConfetti(true); setTimeout(()=>setConfetti(false),4000); }
      }
      return next;
    });
  },[]);

  const total = completed.length;
  const totalPct = Math.round((total/30)*100);

  const wkStats = (w)=>{
    const ms = MODULES.filter(m=>m.week===w);
    const done = ms.filter(m=>completed.includes(m.id)).length;
    return { done, total:ms.length, pct: Math.round((done/ms.length)*100) };
  };

  const visible = activeWeek==="all" ? MODULES : MODULES.filter(m=>m.week===parseInt(activeWeek));

  return (
    <>
      <style>{`
        @keyframes cfFall{0%{top:-12px;opacity:1;transform:rotate(0deg)}100%{top:105vh;opacity:0;transform:rotate(600deg) translateX(40px)}}
        @keyframes toastIn{0%{transform:translate(-50%,-50%) scale(.85);opacity:0}60%{transform:translate(-50%,-50%) scale(1.04)}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <Confetti active={confetti}/>
      <Toast data={toast} onClose={()=>setToast(null)}/>

      {/* ── Header ── */}
      <div style={{
        background:"linear-gradient(180deg,#0D1117 60%,rgba(13,17,23,0))",
        padding:"36px 24px 20px",position:"sticky",top:0,zIndex:100,
        backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{maxWidth:"980px",margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px",marginBottom:"16px"}}>
            <div>
              <h1 style={{fontSize:"clamp(20px,4vw,28px)",fontWeight:800,letterSpacing:"-0.5px",lineHeight:1.2}}>
                ⚡ Angular <span style={{color:"#7C3AED"}}>30-Day</span> Mastery
              </h1>
              <p style={{fontSize:"12px",color:"#6B7280",fontFamily:"'JetBrains Mono',monospace",marginTop:"4px"}}>
                React dev → Angular expert roadmap
              </p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
              <Ring pct={totalPct} color="#7C3AED" size={68}/>
              <div>
                <div style={{fontSize:"28px",fontWeight:800,lineHeight:1}}>
                  {totalPct}<span style={{fontSize:"14px",color:"#6B7280",fontWeight:400}}>%</span>
                </div>
                <div style={{fontSize:"12px",color:"#6B7280",fontFamily:"'JetBrains Mono',monospace"}}>{total}/30 done</div>
              </div>
            </div>
          </div>
          {/* Overall bar */}
          <div style={{height:"5px",background:"rgba(255,255,255,0.07)",borderRadius:"4px",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${totalPct}%`,background:"linear-gradient(90deg,#7C3AED,#A78BFA)",borderRadius:"4px",transition:"width .8s ease"}}/>
          </div>
        </div>
      </div>

      <div style={{maxWidth:"980px",margin:"0 auto",padding:"28px 24px 80px"}}>

        {/* ── Week Stats ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:"10px",marginBottom:"24px"}}>
          {[1,2,3,4].map(w=>{
            const wp=wkStats(w), wk=WK[w];
            const isActive = activeWeek===String(w);
            return (
              <div key={w} onClick={()=>setActiveWeek(isActive?"all":String(w))}
                style={{
                  background:wp.pct===100?wk.bg:"rgba(255,255,255,0.03)",
                  border:`1px solid ${isActive?wk.color:wp.pct===100?wk.color+"40":"rgba(255,255,255,0.07)"}`,
                  borderRadius:"16px",padding:"16px",cursor:"pointer",transition:"all .2s",
                }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
                  <div>
                    <div style={{fontSize:"10px",color:wk.color,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",fontFamily:"'JetBrains Mono',monospace"}}>Week {w}</div>
                    <div style={{fontSize:"13px",fontWeight:700,color:"#E8EAF0",marginTop:"2px"}}>{wk.name}</div>
                  </div>
                  <div style={{fontSize:"18px",fontWeight:800,color:wk.color}}>{wp.pct}%</div>
                </div>
                <div style={{height:"4px",background:"rgba(255,255,255,0.07)",borderRadius:"4px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${wp.pct}%`,background:wk.color,borderRadius:"4px",transition:"width .6s ease"}}/>
                </div>
                <div style={{fontSize:"11px",color:"#6B7280",marginTop:"7px",fontFamily:"'JetBrains Mono',monospace"}}>{wp.done}/{wp.total} modules</div>
              </div>
            );
          })}
        </div>

        {/* ── Filter Tabs ── */}
        <div style={{display:"flex",gap:"8px",marginBottom:"20px",flexWrap:"wrap"}}>
          {["all","1","2","3","4"].map(w=>{
            const on = activeWeek===w;
            const color = w==="all"?"#A78BFA":WK[parseInt(w)]?.color;
            return (
              <button key={w} onClick={()=>setActiveWeek(w)} style={{
                padding:"7px 18px",borderRadius:"100px",fontSize:"12px",fontWeight:700,
                fontFamily:"'Syne',sans-serif",cursor:"pointer",transition:"all .2s",
                background:on?color:"rgba(255,255,255,0.05)",
                color:on?"#fff":"#6B7280",
                border:`1px solid ${on?color:"transparent"}`,
              }}>
                {w==="all"?"All Days":`Week ${w}`}
              </button>
            );
          })}
        </div>

        {/* ── Module Grid ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:"12px"}}>
          {visible.map(mod=>(
            <ModuleCard key={mod.id} mod={mod} done={completed.includes(mod.id)} onToggle={toggleDone}/>
          ))}
        </div>

        {/* ── Reset ── */}
        {total > 0 && (
          <div style={{textAlign:"center",marginTop:"44px"}}>
            <button onClick={()=>{ if(window.confirm("Progress reset pannalama?")){ setCompleted([]); localStorage.removeItem("ng30_v3"); }}}
              style={{background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",
                padding:"8px 22px",color:"#6B7280",fontSize:"12px",cursor:"pointer",
                fontFamily:"'JetBrains Mono',monospace",transition:"border-color .2s"}}>
              Reset Progress
            </button>
          </div>
        )}

        <div style={{textAlign:"center",marginTop:"50px",color:"#374151",fontSize:"11px",fontFamily:"'JetBrains Mono',monospace"}}>
          React dev → Angular master · Progress auto-saved in browser
        </div>
      </div>
    </>
  );
}
