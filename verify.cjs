const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/astra-gravity.html','utf8');
assert(!source.includes('\\"'));
assert(!/<!doctype|<html|<body/i.test(source));
const script=source.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script);
for(const width of [320,736]) for(const reduced of [false,true]) {
  let queued, drawCalls=0;
  const context=new Proxy({}, {get:(_,key)=>key==='createRadialGradient'?()=>({addColorStop(){}}):(...args)=>{
    for(const a of args) if(typeof a==='number')assert(Number.isFinite(a),'non-finite drawing coordinate');
    drawCalls++;
  },set:()=>true});
  const elements={};
  function element(){return {style:{},handlers:{},attributes:{},isConnected:true,textContent:'',getContext:()=>context,getBoundingClientRect:()=>({width,height:width===320?320:450,left:0,top:0}),setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,v){this.handlers[k]=v;},setPointerCapture(){}};}
  for(const id of ['ag-canvas','ag-color-probe','ag-split','ag-comet','ag-pause','ag-state'])elements['#'+id]=element();
  const root=element();root.querySelector=id=>{assert(elements[id]);return elements[id];};
  const sandbox={document:{getElementById:id=>{assert.equal(id,'astra-gravity');return root;},createElement:()=>element(),hidden:false},getComputedStyle:()=>({color:'rgb(90,130,180)'}),matchMedia:()=>({matches:reduced,addEventListener(){}}),devicePixelRatio:2,ResizeObserver:class{observe(){}},requestAnimationFrame:fn=>{queued=fn;}};
  vm.runInNewContext(script,sandbox);
  const click=id=>elements[id].handlers.click();
  const tick=(n,offset=0)=>{for(let i=1;i<=n;i++)queued(offset+i*16.667);};
  assert(drawCalls>1000);
  assert.equal(elements['#ag-pause'].textContent,reduced?'Play':'Pause');
  if(reduced)click('#ag-pause');
  tick(50);
  click('#ag-split');assert.equal(elements['#ag-split'].attributes['aria-pressed'],'true');
  click('#ag-comet');assert.match(elements['#ag-state'].textContent,/Comet 1/);
  tick(180,1000);
  elements['#ag-canvas'].handlers.pointerdown({clientX:20,clientY:20,pointerId:1});
  tick(120,5000);
  elements['#ag-canvas'].handlers.pointerup();
  click('#ag-pause');assert.equal(elements['#ag-pause'].textContent,'Play');
  click('#ag-split');assert.equal(elements['#ag-split'].attributes['aria-pressed'],'false');
  console.log(`PASS ${width}px, reduced motion ${reduced}: startup, simulation, split, comet, drag, pause; all coordinates finite`);
}
