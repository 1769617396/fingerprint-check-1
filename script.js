async function runTests() {

const results = {}


// webdriver
results.webdriver = navigator.webdriver || false


// user agent
results.userAgent = navigator.userAgent


// languages
results.languages = navigator.languages


// platform
results.platform = navigator.platform


// hardware
results.hardwareConcurrency = navigator.hardwareConcurrency
results.deviceMemory = navigator.deviceMemory


// headless detection
results.headless = (
navigator.webdriver ||
navigator.plugins.length === 0 ||
navigator.languages === ''
)


// canvas fingerprint
function canvasFingerprint(){

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

ctx.textBaseline = "top"
ctx.font = "16px Arial"
ctx.fillText("fingerprint-test", 2, 2)

return canvas.toDataURL()

}

results.canvas = canvasFingerprint()


// webgl fingerprint
function webglFingerprint(){

const canvas = document.createElement("canvas")
const gl = canvas.getContext("webgl")

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


// audio fingerprint
async function audioFingerprint(){

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

for(let i=0;i<buffer.getChannelData(0).length;i++){

sum += Math.abs(buffer.getChannelData(0)[i])

}

return sum

}

results.audio = await audioFingerprint()


// automation hints
results.automationHints = {

chromeRuntime: !!window.chrome,
permissionsQuery: navigator.permissions ? true : false,
pluginsLength: navigator.plugins.length

}


// show results
document.getElementById("results").innerText =
JSON.stringify(results,null,2)

}
