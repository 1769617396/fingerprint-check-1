async function runTests(){

const fp = {}

////////////////////////////
// Navigator
////////////////////////////

fp.navigator = {
userAgent: navigator.userAgent,
appCodeName: navigator.appCodeName,
appName: navigator.appName,
appVersion: navigator.appVersion,
platform: navigator.platform,
product: navigator.product,
productSub: navigator.productSub,
vendor: navigator.vendor,
vendorSub: navigator.vendorSub,
language: navigator.language,
languages: navigator.languages,
cookieEnabled: navigator.cookieEnabled,
hardwareConcurrency: navigator.hardwareConcurrency,
deviceMemory: navigator.deviceMemory,
maxTouchPoints: navigator.maxTouchPoints,
webdriver: navigator.webdriver,
doNotTrack: navigator.doNotTrack
}

////////////////////////////
// Screen
////////////////////////////

fp.screen = {
width: screen.width,
height: screen.height,
availWidth: screen.availWidth,
availHeight: screen.availHeight,
colorDepth: screen.colorDepth,
pixelDepth: screen.pixelDepth,
devicePixelRatio: window.devicePixelRatio
}

////////////////////////////
// Window
////////////////////////////

fp.window = {
innerWidth: window.innerWidth,
innerHeight: window.innerHeight,
outerWidth: window.outerWidth,
outerHeight: window.outerHeight
}

////////////////////////////
// Time
////////////////////////////

fp.time = {
timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
timezoneOffset: new Date().getTimezoneOffset(),
locale: Intl.DateTimeFormat().resolvedOptions().locale
}

////////////////////////////
// Plugins
////////////////////////////

fp.plugins = []

for(let i=0;i<navigator.plugins.length;i++){

fp.plugins.push({
name:navigator.plugins[i].name,
filename:navigator.plugins[i].filename,
description:navigator.plugins[i].description
})

}

////////////////////////////
// MimeTypes
////////////////////////////

fp.mimeTypes = []

for(let i=0;i<navigator.mimeTypes.length;i++){

fp.mimeTypes.push({
type:navigator.mimeTypes[i].type,
suffixes:navigator.mimeTypes[i].suffixes
})

}

////////////////////////////
// Canvas
////////////////////////////

function canvasFP(){

const canvas=document.createElement("canvas")
const ctx=canvas.getContext("2d")

ctx.textBaseline="top"
ctx.font="14px Arial"
ctx.fillText("fingerprint",2,2)

return canvas.toDataURL()

}

fp.canvas=canvasFP()

////////////////////////////
// WebGL
////////////////////////////

function webglFP(){

const canvas=document.createElement("canvas")
const gl=canvas.getContext("webgl")

if(!gl) return "no-webgl"

const dbg=gl.getExtension("WEBGL_debug_renderer_info")

if(dbg){

return{
vendor:gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL),
renderer:gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)
}

}

return "hidden"

}

fp.webgl=webglFP()

////////////////////////////
// Audio
////////////////////////////

async function audioFP(){

try{

const ctx=new OfflineAudioContext(1,44100,44100)

const osc=ctx.createOscillator()
osc.type="triangle"
osc.frequency.value=10000

const comp=ctx.createDynamicsCompressor()

osc.connect(comp)
comp.connect(ctx.destination)

osc.start(0)

const buf=await ctx.startRendering()

let sum=0
const data=buf.getChannelData(0)

for(let i=0;i<data.length;i++){
sum+=Math.abs(data[i])
}

return sum

}catch(e){

return "error"

}

}

fp.audio=await audioFP()

////////////////////////////
// Media devices
////////////////////////////

try{

const devices=await navigator.mediaDevices.enumerateDevices()

fp.mediaDevices=devices.map(d=>({
kind:d.kind,
label:d.label
}))

}catch(e){

fp.mediaDevices="blocked"

}

////////////////////////////
// Permissions
////////////////////////////

const permList=["geolocation","notifications","camera","microphone"]

fp.permissions={}

for(const p of permList){

try{

const r=await navigator.permissions.query({name:p})
fp.permissions[p]=r.state

}catch(e){

fp.permissions[p]="unsupported"

}

}

////////////////////////////
// Bot signals
////////////////////////////

let score=0
let reasons=[]

if(navigator.webdriver){
score+=40
reasons.push("webdriver")
}

if(navigator.plugins.length===0){
score+=15
reasons.push("no plugins")
}

if(!navigator.languages){
score+=10
reasons.push("missing languages")
}

if(screen.width===0){
score+=20
reasons.push("invalid screen")
}

if(fp.webgl==="no-webgl"){
score+=10
reasons.push("no webgl")
}

fp.botDetection={
score,
reasons,
risk:
score>60?"high":
score>30?"medium":
"low"
}

////////////////////////////
// OUTPUT
////////////////////////////

document.getElementById("results").innerText=
JSON.stringify(fp,null,2)

}
