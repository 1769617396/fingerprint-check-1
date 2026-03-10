// ================== WebGL 部分 ==================
function createWebGLContext() {
    const canvas = document.createElement("canvas");
    return canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
}

function renderTable(id, obj) {
    let html = "<table>";
    for (let key in obj) {
        html += `<tr><td>${key}</td><td>${obj[key]}</td></tr>`;
    }
    html += "</table>";
    document.getElementById(id).innerHTML = html;
}

function showWebGLInfo(gl) {
    // 基本信息
    const basicInfo = {
        version: gl.getParameter(gl.VERSION),
        shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER)
    };
    renderTable("webgl-basic", basicInfo);

    // GPU info
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const gpuInfo = debugInfo ? {
        unmaskedVendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        unmaskedRenderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    } : {unmaskedVendor: "N/A", unmaskedRenderer: "N/A"};
    renderTable("webgl-gpu", gpuInfo);

    // WebGL capabilities
    const caps = {
        MAX_TEXTURE_SIZE: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        MAX_VERTEX_ATTRIBS: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        MAX_RENDERBUFFER_SIZE: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
        MAX_VIEWPORT_DIMS: gl.getParameter(gl.MAX_VIEWPORT_DIMS).toString()
    };
    renderTable("webgl-cap", caps);

    // Supported extensions
    const extensions = gl.getSupportedExtensions();
    document.getElementById("webgl-ext").innerHTML = "<pre>" + JSON.stringify(extensions, null, 2) + "</pre>";

    // Fingerprint
    const fpData = [
        gl.getParameter(gl.VERSION),
        gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        gl.getParameter(gl.VENDOR),
        gl.getParameter(gl.RENDERER),
        extensions.join(",")
    ].join("###");
    document.getElementById("webgl-fp").innerText = simpleHash(fpData);
}

// ================== Canvas Fingerprint 部分 ==================
function generateCanvasFingerprint() {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");

    // 渲染文本和图形
    ctx.fillStyle = "#f60";
    ctx.fillRect(0, 0, 200, 50);
    ctx.fillStyle = "#069";
    ctx.font = "20px Arial";
    ctx.fillText("Hello WebGL + Canvas!", 2, 30);

    // 获取 Base64 数据
    const dataURL = canvas.toDataURL();

    // 哈希
    const hash = simpleHash(dataURL);

    // 模拟厂商信息（Canvas本身没有vendor，只能通过 hash 模拟）
    const simulatedVendor = "CanvasRenderer";
    const simulatedRenderer = "Canvas 2D";

    // 输出
    const canvasInfo = {
        simulatedVendor,
        simulatedRenderer,
        fingerprintHash: hash
    };

    renderTable("canvas-fp", canvasInfo);
}

// ================== 简单 Hash 函数 ==================
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // 转 32 位有符号整数
    }
    return hash;
}

// ================== 初始化 ==================
window.onload = function() {
    const gl = createWebGLContext();
    if (!gl) {
        alert("WebGL not supported");
        return;
    }

    showWebGLInfo(gl);
    generateCanvasFingerprint();
};
