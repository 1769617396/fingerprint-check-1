async function collectFingerprint(){

const fp = {}

//////////////////////////
// Navigator
//////////////////////////

fp.navigator = {
userAgent: navigator.userAgent,
platform: navigator.platform,
vendor: navigator.vendor,
product: navigator.product,
hardwareConcurrency: navigator.hardwareConcurrency,
deviceMemory: navigator.deviceMemory,
language: navigator.language,
languages: navigator.languages,
webdriver: navigator.webdriver,
maxTouchPoints: navigator.maxTouchPoints,
doNotTrack: navigator.doNotTrack
}

//////////////////////////
// Screen
//////////////////////////

fp.screen = {
width: screen.width,
height: screen.height,
availWidth: screen.availWidth,
availHeight: screen.availHeight,
colorDepth: screen.colorDepth,
pixelDepth: screen.pixelDepth,
devicePixelRatio: window.devicePixelRatio
}

//////////////////////////
// Window
//////////////////////////

fp.window = {
innerWidth: window.innerWidth,
innerHeight: window.innerHeight,
outerWidth: window.outerWidth,
outerHeight: window.outerHeight
}

//////////////////////////
// Timezone
//////////////////////////

fp.time = {
timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
timezoneOffset: new Date().getTimezoneOffset(),
locale: Intl.DateTimeFormat().resolvedOptions().locale
}

//////////////////////////
// Canvas fingerprint
//////////////////////////

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")
ctx.textBaseline = "top"
ctx.font = "16px Arial"
ctx.fillText("fingerprint-test",2,2)

fp.canvas = canvas.toDataURL()

//////////////////////////
// WebGL fingerprint
//////////////////////////

const glCanvas = document.createElement("canvas")
const gl = glCanvas.getContext("webgl")

if(gl){

const dbg = gl.getExtension("WEBGL_debug_renderer_info")

if(dbg){

fp.webgl = {
vendor: gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL),
renderer: gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)
}

}

}

//////////////////////////
// Audio fingerprint
//////////////////////////

try{

const ctxAudio = new OfflineAudioContext(1,44100,44100)

const oscillator = ctxAudio.createOscillator()
oscillator.type = "triangle"
oscillator.frequency.value = 10000

const compressor = ctxAudio.createDynamicsCompressor()

oscillator.connect(compressor)
compressor.connect(ctxAudio.destination)

oscillator.start(0)

const buffer = await ctxAudio.startRendering()

let sum = 0
const data = buffer.getChannelData(0)

for(let i=0;i<data.length;i++){
sum += Math.abs(data[i])
}

fp.audio = sum

}catch(e){

fp.audio = "blocked"

}

//////////////////////////
// Plugins
//////////////////////////

fp.plugins = []

for(let i=0;i<navigator.plugins.length;i++){

fp.plugins.push(navigator.plugins[i].name)

}

//////////////////////////
// MimeTypes
//////////////////////////

fp.mimeTypes = []

for(let i=0;i<navigator.mimeTypes.length;i++){

fp.mimeTypes.push(navigator.mimeTypes[i].type)

}

//////////////////////////
// Media devices
//////////////////////////

try{

const devices = await navigator.mediaDevices.enumerateDevices()

fp.mediaDevices = devices.map(d=>({
kind:d.kind,
label:d.label
}))

}catch(e){

fp.mediaDevices = "blocked"

}

//////////////////////////
// Permissions
//////////////////////////

const perms = ["camera","microphone","geolocation","notifications"]

fp.permissions = {}

for(const p of perms){

try{

const r = await navigator.permissions.query({name:p})
fp.permissions[p] = r.state

}catch(e){

fp.permissions[p] = "unsupported"

}

}

return fp
}
