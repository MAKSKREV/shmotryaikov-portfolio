(() => {
  'use strict';
  const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
  const root=document.documentElement;
  const motionPreference=matchMedia('(prefers-reduced-motion:reduce)');
  let reduced=root.dataset.motion==='off',explicitMotion=false;
  try{explicitMotion=['on','off'].includes(localStorage.getItem('portfolio-motion'));}catch{}
  const motionButton=$('.motion-toggle');
  function updateMotionButton(){
    motionButton.setAttribute('aria-pressed',String(!reduced));
    const label=reduced?'Turn animations on':'Pause animations';
    motionButton.setAttribute('aria-label',label);motionButton.title=label;
  }
  function setMotion(enabled,persist=false){
    reduced=!enabled;root.dataset.motion=enabled?'on':'off';
    if(persist){explicitMotion=true;try{localStorage.setItem('portfolio-motion',root.dataset.motion);}catch{}}
    updateMotionButton();stopTyping();clearPointer();
    if(reduced)groups.forEach(group=>group.classList.add('is-visible'));
    else if(heroVisible&&!document.hidden)typeTimer=setTimeout(typingStep,700);
  }
  // Animation is the CSS default. An unavailable observer must not freeze the page.
  function observeVisibility(callback,options){
    if(typeof IntersectionObserver==='function')return new IntersectionObserver(callback,options);
    return {observe(target){if(target)setTimeout(()=>callback([{target,isIntersecting:true}]),0);},unobserve(){}};
  }
  function animate(element,frames,options){
    return typeof element.animate==='function'?element.animate(frames,options):{finished:Promise.resolve()};
  }
  updateMotionButton();motionButton.hidden=false;
  motionButton.addEventListener('click',()=>setMotion(reduced,true));
  const followSystemMotion=()=>{if(!explicitMotion)setMotion(!motionPreference.matches);};
  if(motionPreference.addEventListener)motionPreference.addEventListener('change',followSystemMotion);
  else if(motionPreference.addListener)motionPreference.addListener(followSystemMotion);
  const menu=$('.portfolio-mobile-nav'),menuButton=$('.portfolio-menu');
  function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');}
  menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const id=a.getAttribute('href');const target=id==='#'?document.body:$(id);if(!target)return;
    e.preventDefault();closeMenu();if(id==='#')$$('.portfolio-nav .is-current').forEach(a=>a.classList.remove('is-current'));if(id==='#')window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});else target.scrollIntoView({behavior:reduced?'instant':'smooth'});
  }));
  const initialWindows=new Map($$('[data-drag]').map(w=>[w,{left:w.style.left,top:w.style.top}]));
  function restoreWindows(){
    const stage=$('.stage'),scale=stage.getBoundingClientRect().width/stage.offsetWidth;
    initialWindows.forEach((position,w)=>{
      const old=w.getBoundingClientRect(),wasClosed=w.classList.contains('closed-window');
      w.classList.remove('closed-window','is-active','hovered');w.style.left=position.left;w.style.top=position.top;w.style.translate='';w.style.zIndex='';
      const screen=$('.screen',w);if(screen)screen.hidden=false;
      $$('[data-minimize]',w).forEach(b=>b.setAttribute('aria-expanded','true'));
      const next=w.getBoundingClientRect();
      if(!reduced&&next.width&&next.height)animate(w,[{translate:wasClosed?'0px 8px':(old.x-next.x)/scale+'px '+(old.y-next.y)/scale+'px',opacity:wasClosed?0:1},{translate:'0px 0px',opacity:1}],{duration:340,easing:'cubic-bezier(.22,1,.36,1)'});
    });
    $('.portfolio-hero').classList.remove('hover-focus');

  }

  $('.dev-logo').addEventListener('click',()=>{closeMenu();$$('.portfolio-nav .is-current').forEach(a=>a.classList.remove('is-current'));restoreWindows();window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});});
  function clock(){const now=new Date();const el=$('.portfolio-clock');el.textContent=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});el.dateTime=now.toISOString();}
  clock();setInterval(clock,30000);
  const groups=$$('.reveal-group,.project-feature');
  const observer=observeVisibility(entries=>entries.forEach(entry=>{if(entry.target.classList.contains('contact-section')){entry.target.classList.add('motion-observed');entry.target.classList.toggle('is-visible',entry.isIntersecting);}else if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{rootMargin:'0px 0px -6% 0px'});
  groups.forEach(group=>{if(reduced)group.classList.add('is-visible');observer.observe(group);$$('.will-reveal',group).forEach((el,i)=>el.style.setProperty('--reveal-delay',Math.min(i,3)*.09+'s'));});
  const sectionNav=observeVisibility(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const id=entry.target.id;
    $$('.portfolio-nav a[href^="#"]').forEach(a=>a.classList.toggle('is-current',a.getAttribute('href')==='#'+id));
  }),{rootMargin:'-8% 0px -62% 0px'});
  $$('#services,#projects,#about,#contact').forEach(section=>sectionNav.observe(section));
  const workNav=observeVisibility(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    $$('.project-shortcuts a').forEach(a=>a.classList.toggle('is-current',a.getAttribute('href')==='#'+entry.target.id));
  }),{rootMargin:'-12% 0px -52% 0px'});
  $$('.case-row').forEach(row=>workNav.observe(row));
  const serviceTabs=$$('[data-service]'),servicePanels=$$('.service-panel');
  function selectService(tab,focus=false){
    if(tab.getAttribute('aria-selected')==='true'){if(focus)tab.focus();return;}
    serviceTabs.forEach(button=>{const active=button===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    servicePanels.forEach(panel=>{panel.hidden=panel.id!==tab.getAttribute('aria-controls');});
    const panel=document.getElementById(tab.getAttribute('aria-controls'));
    if(!reduced)animate(panel,[{opacity:0,translate:'0px 8px'},{opacity:1,translate:'0px 0px'}],{duration:280,easing:'cubic-bezier(.16,1,.3,1)'});
    if(focus)tab.focus();
  }
  serviceTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectService(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%serviceTabs.length;else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+serviceTabs.length)%serviceTabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=serviceTabs.length-1;else return;event.preventDefault();selectService(serviceTabs[next],true);});});
  const serviceObserver=observeVisibility(([entry])=>{entry.target.classList.add('motion-observed');entry.target.classList.toggle('services-visible',entry.isIntersecting);});serviceObserver.observe($('.service-console'));
  const telegramTabs=$$('[data-telegram-tab]'),telegramPanels=$$('.telegram-project-panel');
  function selectTelegramProject(tab,focus=false){
    if(tab.getAttribute('aria-selected')==='true'){if(focus)tab.focus();return;}
    telegramTabs.forEach(button=>{const active=button===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    telegramPanels.forEach(panel=>{panel.hidden=panel.id!==tab.getAttribute('aria-controls');});
    const panel=document.getElementById(tab.getAttribute('aria-controls'));
    if(!reduced)animate(panel,[{opacity:0},{opacity:1}],{duration:220,easing:'ease-out'});
    if(focus)tab.focus();
  }
  telegramTabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectTelegramProject(tab));
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight')next=(index+1)%telegramTabs.length;
      else if(event.key==='ArrowLeft')next=(index-1+telegramTabs.length)%telegramTabs.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=telegramTabs.length-1;
      else return;
      event.preventDefault();selectTelegramProject(telegramTabs[next],true);
    });
  });
  const projectMotionObserver=observeVisibility(entries=>entries.forEach(entry=>{entry.target.classList.add('motion-observed');entry.target.classList.toggle('project-motion-visible',entry.isIntersecting);}));
  $$('.scraper-motion,.buffer-motion').forEach(element=>projectMotionObserver.observe(element));
  const headline=$('.typing-role'),words=['apps','websites','Telegram bots','AI automations'];
  let typeTimer=0,wordIndex=0,letter=words[0].length,deleting=true,heroVisible=false;
  function stopTyping(){clearTimeout(typeTimer);typeTimer=0;}
  function typingStep(){
    typeTimer=0;if(!heroVisible||document.hidden||reduced)return;
    const word=words[wordIndex];letter+=deleting?-1:1;headline.textContent=word.slice(0,Math.max(0,letter));
    let delay=deleting?42:78;
    if(letter===0){deleting=false;wordIndex=(wordIndex+1)%words.length;delay=250;}
    else if(letter>=word.length){deleting=true;delay=2000;}
    typeTimer=setTimeout(typingStep,delay);
  }
  const heroObserver=observeVisibility(([entry])=>{heroVisible=entry.isIntersecting;stopTyping();if(heroVisible&&!reduced&&!document.hidden)typeTimer=setTimeout(typingStep,1800);});heroObserver.observe($('.portfolio-headline'));
  let z=30;
  $$('[data-drag]').forEach(el=>{
    const handle=$('.bar',el)||el;let drag,raf=0;
    function render(){raf=0;if(drag)el.style.translate=drag.dx+'px '+drag.dy+'px';}
    handle.addEventListener('pointerdown',e=>{
      $$('.win-wrap.is-active').forEach(w=>w.classList.remove('is-active'));el.classList.add('is-active');
      if(innerWidth>=1024)el.style.zIndex=++z;
      if(innerWidth<1024||e.button!==0||e.target.closest('button,a'))return;
      e.preventDefault();const stage=$('.stage'),scale=stage.getBoundingClientRect().width/stage.offsetWidth;
      drag={x:e.clientX,y:e.clientY,left:parseFloat(el.style.left)||0,top:parseFloat(el.style.top)||0,scale,dx:0,dy:0};
      handle.setPointerCapture(e.pointerId);el.classList.add('dragging');el.style.zIndex=++z;
    });
    handle.addEventListener('pointermove',e=>{if(!drag)return;drag.dx=(e.clientX-drag.x)/drag.scale;drag.dy=(e.clientY-drag.y)/drag.scale;if(!raf)raf=requestAnimationFrame(render);});
    function stop(){if(!drag)return;cancelAnimationFrame(raf);raf=0;el.style.left=drag.left+drag.dx+'px';el.style.top=drag.top+drag.dy+'px';el.style.translate='';el.classList.remove('dragging');drag=null;}
    ['pointerup','pointercancel','lostpointercapture'].forEach(name=>handle.addEventListener(name,stop));el.addEventListener('dragstart',e=>e.preventDefault());
  });
  $$('.photo-window').forEach(window=>{
    const frame=$('.win',window);
    frame.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&innerWidth>=1024){window.classList.add('hovered');$('.portfolio-hero').classList.add('hover-focus');}});
    frame.addEventListener('pointerleave',()=>{window.classList.remove('hovered');if(!$('.photo-window.hovered'))$('.portfolio-hero').classList.remove('hover-focus');});
  });
  $$('[data-close]').forEach(button=>button.addEventListener('click',()=>{
    const window=button.closest('.win-wrap');window.classList.remove('hovered');$('.portfolio-hero').classList.remove('hover-focus');
    if(reduced)window.classList.add('closed-window');else animate(window,[{opacity:1,scale:1},{opacity:0,scale:.9}],{duration:170,easing:'ease-in'}).finished.then(()=>window.classList.add('closed-window'));
  }));
  $$('[data-minimize]').forEach(button=>{button.setAttribute('aria-expanded','true');button.addEventListener('click',()=>{const content=$('.screen',button.closest('.win'));content.hidden=!content.hidden;button.setAttribute('aria-expanded',String(!content.hidden));if(!content.hidden&&!reduced)animate(content,[{opacity:0},{opacity:1}],{duration:180});});});
  const hero=$('.portfolio-hero');let pointerFrame=0,pointerBounds,px=0,py=0;
  const ambientObserver=observeVisibility(([entry])=>{hero.classList.add('motion-observed');hero.classList.toggle('ambient-visible',entry.isIntersecting);});ambientObserver.observe(hero);
  function clearPointer(){cancelAnimationFrame(pointerFrame);pointerFrame=0;hero.style.setProperty('--pointer-x','0px');hero.style.setProperty('--pointer-y','0px');hero.style.setProperty('--tilt-x','0deg');hero.style.setProperty('--tilt-y','0deg');}
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    hero.addEventListener('pointerenter',()=>{pointerBounds=hero.getBoundingClientRect();});
    hero.addEventListener('pointermove',event=>{if(reduced||innerWidth<601||event.pointerType!=='mouse'||$('.dragging'))return;if(!pointerBounds)pointerBounds=hero.getBoundingClientRect();px=(event.clientX-pointerBounds.left)/pointerBounds.width-.5;py=(event.clientY-pointerBounds.top)/pointerBounds.height-.5;if(pointerFrame)return;pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;hero.style.setProperty('--pointer-x',(px*14).toFixed(2)+'px');hero.style.setProperty('--pointer-y',(py*10).toFixed(2)+'px');hero.style.setProperty('--tilt-x',(-py*2).toFixed(2)+'deg');hero.style.setProperty('--tilt-y',(px*2.6).toFixed(2)+'deg');});},{passive:true});
    hero.addEventListener('pointerleave',()=>{pointerBounds=null;clearPointer();});
    window.addEventListener('resize',()=>{pointerBounds=null;clearPointer();},{passive:true});
  }
  let dialog;
  function openPhoto(trigger){
    if(dialog)return;
    const current=document.createElement('dialog');dialog=current;current.className='portfolio-dialog';current.setAttribute('aria-label',trigger.dataset.title);
    const head=document.createElement('div');head.className='dialog-head';const label=document.createElement('span');label.textContent=trigger.dataset.title;
    const close=document.createElement('button');close.textContent='×';close.setAttribute('aria-label','Close photo');head.append(label,close);
    const image=document.createElement('img');image.src=trigger.dataset.photo;image.alt=trigger.dataset.title;image.decoding='async';current.append(head,image);
    let source;
    if(trigger.dataset.source){source=document.createElement('a');source.className='dialog-source';source.target='_blank';source.rel='noopener';current.append(source);}
    const gallery=trigger.closest('.telegram-photo-pair');const photos=gallery?$$('[data-photo]',gallery):[trigger];let index=photos.indexOf(trigger),counter;
    function showPhoto(){const button=photos[index];image.src=button.dataset.photo;image.alt=button.dataset.title;label.textContent=button.dataset.title;current.setAttribute('aria-label',button.dataset.title);if(source){source.href=button.dataset.source;source.textContent=button.dataset.sourceLabel||'View the build journal ↗';}if(counter)counter.textContent=(index+1)+' / '+photos.length;}
    if(photos.length>1){const controls=document.createElement('div');controls.className='gallery-controls';const previous=document.createElement('button');previous.textContent='←';previous.setAttribute('aria-label','Previous photo');const next=document.createElement('button');next.textContent='→';next.setAttribute('aria-label','Next photo');counter=document.createElement('span');previous.addEventListener('click',()=>{index=(index-1+photos.length)%photos.length;showPhoto();});next.addEventListener('click',()=>{index=(index+1)%photos.length;showPhoto();});controls.append(previous,counter,next);current.append(controls);current.classList.add('gallery-dialog');current.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();index=(index+(event.key==='ArrowRight'?1:-1)+photos.length)%photos.length;showPhoto();}});}
    showPhoto();document.body.append(current);const overflow=document.body.style.overflow;document.body.style.overflow='hidden';let cleaned=false;
    function cleanup(){if(cleaned)return;cleaned=true;document.body.style.overflow=overflow;current.remove();if(dialog===current)dialog=null;trigger.focus({preventScroll:true});}
    let closing=false;
    function finish(){if(closing)return;closing=true;const done=()=>{current.close();cleanup();};if(reduced)done();else animate(current,[{opacity:1,scale:1},{opacity:0,scale:.95}],{duration:160,easing:'ease-in'}).finished.then(done,done);}
    close.addEventListener('click',finish);current.addEventListener('cancel',event=>{event.preventDefault();finish();});current.addEventListener('click',event=>{if(event.target===current)finish();});current.addEventListener('close',cleanup);
    current.showModal();
    if(!reduced){const from=trigger.getBoundingClientRect(),to=current.getBoundingClientRect();const dx=Math.max(-80,Math.min(80,(from.x+from.width/2)-(to.x+to.width/2))),dy=Math.max(-45,Math.min(45,(from.y+from.height/2)-(to.y+to.height/2)));animate(current,[{opacity:0,translate:dx+'px '+dy+'px',scale:.76},{opacity:1,translate:'0px 0px',scale:1}],{duration:430,easing:'cubic-bezier(.16,1,.3,1)'});}
  }
  $$('[data-photo]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();openPhoto(button);}));
  function resumeMotion(){
    document.documentElement.classList.toggle('motion-paused',document.hidden);stopTyping();if(document.hidden)clearPointer();
    if(!document.hidden&&heroVisible&&!reduced)typeTimer=setTimeout(typingStep,1500);
  }
  document.addEventListener('visibilitychange',resumeMotion);
  window.addEventListener('pageshow',resumeMotion);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  document.documentElement.dataset.ready='true';
})();
