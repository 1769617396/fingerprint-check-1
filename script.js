// ========================================================
// 1️⃣ WebGL Fingerprint
// ========================================================

function initWebGL() {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
        document.body.innerHTML += "<p>WebGL not supported</p>";
        return;
    }

    showBasicInfo(gl);
    showGPUInfo(gl);
    showCapabilities(gl);
    showExtensions(gl);
    generateWebGLFingerprint(gl);
    generateCanvasFingerprint(); // ⚡ Canvas fingerprint 补充
}

// ---------- WebGL 基本信息 ----------
function showBasicInfo(gl) {
    const info = {
        version: gl.getParameter(gl.VERSION),
        shading: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER)
    };
    renderTable("webgl-basic", info);
}

// ---------- WebGL GPU 信息 ----------
function showGPUInfo(gl) {
    const ext = gl.getExtension("WEBGL_debug_renderer_info");

    if (!ext) {
        document.getElementById("webgl-gpu").innerText = "WEBGL_debug_renderer_info not available";
        return;
    }

    const gpu = {
        unmaskedVendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
        unmaskedRenderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
    };

    renderTable("webgl-gpu", gpu);
}

// ---------- WebGL 能力 ----------
function showCapabilities(gl) {
    const caps = {
        MAX_TEXTURE_SIZE: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        MAX_VERTEX_ATTRIBS: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        MAX_RENDERBUFFER_SIZE: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
        MAX_VIEWPORT_DIMS: gl.getParameter(gl.MAX_VIEWPORT_DIMS).toString()
    };
    renderTable("webgl-cap", caps);
}

// ---------- WebGL 扩展 ----------
function showExtensions(gl) {
    const ext = gl.getSupportedExtensions();
    document.getElementById("webgl-ext").innerHTML = "<pre>" + JSON.stringify(ext, null, 2) + "</pre>";
}

// ---------- WebGL 指纹 ----------
function generateWebGLFingerprint(gl) {
    const data = [
        gl.getParameter(gl.VERSION),
        gl.getParameter(gl.RENDERER),
        gl.getParameter(gl.VENDOR),
        gl.getSupportedExtensions().join(",")
    ].join("###");

    const hash = simpleHash(data);
    document.getElementById("webgl-fp").innerText = hash;
}

// ========================================================
// 2️⃣ Canvas Fingerprint（补充）
// ========================================================

function generateCanvasFingerprint() {
    // 创建隐藏 canvas
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");

    // ⚡ Canvas 渲染文字和形状
    ctx.textBaseline = "top";
    ctx.font = "16px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(10, 10, 150, 30);
    ctx.fillStyle = "#069";
    ctx.fillText("WebGL + Canvas Test!", 15, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("WebGL + Canvas Test!", 18, 18);

    // 读取像素数据
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // 计算 hash
    const hash = simpleHash(data);

    // 输出
    document.getElementById("canvas-fp").innerText = hash;
}

// ========================================================
// 3️⃣ 公共工具函数
// ========================================================

function renderTable(id, obj) {
    let html = "<table>";
    for (let key in obj) {
        html += `<tr><td>${key}</td><td>${obj[key]}</td></tr>`;
    }
    html += "</table>";
    document.getElementById(id).innerHTML = html;
}

// 32位有符号整数哈希
function simpleHash(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const val = typeof data[i] === "number" ? data[i] : data[i].charCodeAt(0);
        hash = ((hash << 5) - hash) + val;
        hash |= 0; // 强制32位
    }
    return hash >>> 0; // ⚡ 转成无符号，避免负数
}

window.onload = initWebGL;
