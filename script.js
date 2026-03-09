async function runTests() {

const results = {}

/////////////////////////////
// 基础浏览器信息
/////////////////////////////

results.userAgent = navigator.userAgent
results.platform = navigator.platform
results.vendor = navigator.vendor
results.product = navigator.product
results.language = navigator.language
results.languages = navigator.languages
results.cookieEnabled = navigator.cookieEnabled
results.hardwareConcurrency = navigator.hardwareConcurrency
results.deviceMemory = navigator.deviceMemory
results.maxTouchPoints = navigator.maxTouchPoints

/////////////////////////////
// 屏幕信息
/////////////////////////////

results.screen = {
width: screen.width,
height: screen.height,
availWidth: screen.availWidth,
availHeight: screen.availHeight,
colorDepth: screen.colorDepth,
pixelDepth: screen.pixelDepth,
devicePixelRatio: window.devicePixelRatio
}

/////////////////////////////
// 时区
/////////////////////////////

results.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
results.timezoneOffset = new Date().getTimezoneOffset()

/////////////////////////////
// 插件
/////////////////////////////

results.plugins = []
for (let i = 0; i < navigator.plugins.length; i++) {
results.plugins.push(navigator.plugins[i].name)
}

/////////////////////////////
// mimeTypes
/////////////////////////////

results.mimeTypes = []
for (let i = 0; i < navigator.mimeTypes.length; i++) {
results.mimeTypes.push(navigator.mimeTypes[i].type)
}

/////////////////////////////
// webdriver
/////////////////////////////

results.webdriver = navigator.webdriver || false

/////////////////////////////
// automation hints
/////////////////////////////

results.automationHints = {
chromeRuntime: !!window.chrome,
permissionsAPI: !!navigator.permissions,
pluginsLength: navigator.plugins.length,
webdriver: navigator.webdriver
}

/////////////////////////////
// Canvas fingerprint
/////////////////////////////

function canvasFingerprint(){

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

ctx.textBaseline = "top"
ctx.font = "16px Arial"
ctx.fillText("fingerprint-test",2,2)

return canvas.toDataURL()

}

results.canvas = canvasFingerprint()

/////////////////////////////
// WebGL fingerprint
/////////////////////////////

function webglFingerprint(){

const canvas = document.createElement("canvas")
const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

if(!gl) return "no-webgl"

const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")

if(debugInfo){

return {
vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
}

}

return "hidden"

}

results.webgl = webglFingerprint()

/////////////////////////////
// Audio fingerprint
/////////////////////////////

async function audioFingerprint(){

try{

const ctx = new OfflineAudioContext(1,44100,44100)

const oscillator = ctx.createOscillator()
oscillator.type = "triangle"
oscillator.frequency.value = 10000

const compressor = ctx.createDynamicsCompressor()

oscillator.connect(compressor)
compressor.connect(ctx.destination)

oscillator.start(0)

const buffer = await ctx.startRendering()

let sum = 0

const data = buffer.getChannelData(0)

for(let i=0;i<data.length;i++){
sum += Math.abs(data[i])
}

return sum

}catch(e){

return "audio-error"

}

}

results.audio = await audioFingerprint()

/////////////////////////////
// WebRTC local IP
/////////////////////////////

async function getWebRTCIP(){

return new Promise(resolve=>{

const pc = new RTCPeerConnection({iceServers:[]})

pc.createDataChannel("")

pc.createOffer().then(offer=>pc.setLocalDescription(offer))

pc.onicecandidate = event=>{

if(!event || !event.candidate) return

const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
const ipMatch = ipRegex.exec(event.candidate.candidate)

if(ipMatch){

resolve(ipMatch[1])

pc.close()

}

}

setTimeout(()=>resolve("unknown"),2000)

})

}

results.webrtcIP = await getWebRTCIP()

/////////////////////////////
// Permissions API
/////////////////////////////

async function getPermissions(){

const permissionsList = [
"notifications",
"geolocation",
"camera",
"microphone"
]

const output = {}

for(const p of permissionsList){

try{

const status = await navigator.permissions.query({name:p})

output[p] = status.state

}catch(e){

output[p] = "unsupported"

}

}

return output

}

results.permissions = await getPermissions()

/////////////////////////////
// Bot detection scoring
/////////////////////////////

let botScore = 0
const botReasons = []

if(navigator.webdriver){
botScore += 40
botReasons.push("webdriver=true")
}

if(navigator.plugins.length === 0){
botScore += 20
botReasons.push("no plugins")
}

if(!navigator.languages){
botScore += 10
botReasons.push("missing languages")
}

if(screen.width === 0 || screen.height === 0){
botScore += 20
botReasons.push("invalid screen size")
}

if(results.webgl === "no-webgl"){
botScore += 10
botReasons.push("no webgl")
}

results.botDetection = {
score: botScore,
reasons: botReasons,
riskLevel:
botScore > 60 ? "high" :
botScore > 30 ? "medium" :
"low"
}

/////////////////////////////
// 输出
/////////////////////////////

document.getElementById("results").innerText =
JSON.stringify(results,null,2)

}
