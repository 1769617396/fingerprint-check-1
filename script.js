function createWebGLContext() {
    const canvas = document.createElement("canvas");
    return canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
}

function showBasicInfo(gl) {

    const info = {
        version: gl.getParameter(gl.VERSION),
        shadingLanguage: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER)
    };

    let html = "<table>";

    for (let key in info) {
        html += `<tr><td>${key}</td><td>${info[key]}</td></tr>`;
    }

    html += "</table>";

    document.getElementById("webgl-basic").innerHTML = html;
}

function showGPUInfo(gl) {

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

    if (!debugInfo) {
        document.getElementById("webgl-gpu").innerText =
            "WEBGL_debug_renderer_info not available";
        return;
    }

    const gpu = {
        unmaskedVendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        unmaskedRenderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    };

    let html = "<table>";

    for (let key in gpu) {
        html += `<tr><td>${key}</td><td>${gpu[key]}</td></tr>`;
    }

    html += "</table>";

    document.getElementById("webgl-gpu").innerHTML = html;
}

function showCapabilities(gl) {

    const caps = {
        MAX_TEXTURE_SIZE: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        MAX_VERTEX_ATTRIBS: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        MAX_RENDERBUFFER_SIZE: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
        MAX_VIEWPORT_DIMS: gl.getParameter(gl.MAX_VIEWPORT_DIMS).toString()
    };

    let html = "<table>";

    for (let key in caps) {
        html += `<tr><td>${key}</td><td>${caps[key]}</td></tr>`;
    }

    html += "</table>";

    document.getElementById("webgl-cap").innerHTML = html;
}

function showExtensions(gl) {

    const ext = gl.getSupportedExtensions();

    let html = "<ul>";

    ext.forEach(e => {
        html += `<li>${e}</li>`;
    });

    html += "</ul>";

    document.getElementById("webgl-ext").innerHTML = html;
}

function generateFingerprint(gl) {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("webgl");

    const data = [
        ctx.getParameter(ctx.VERSION),
        ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION),
        ctx.getParameter(ctx.VENDOR),
        ctx.getParameter(ctx.RENDERER),
        ctx.getSupportedExtensions().join(",")
    ].join("###");

    const hash = simpleHash(data);

    document.getElementById("webgl-fp").innerHTML =
        `<p>${hash}</p>`;
}

function simpleHash(str) {

    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        const chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }

    return hash.toString();
}

window.onload = function () {

    const gl = createWebGLContext();

    if (!gl) {
        alert("WebGL not supported");
        return;
    }

    showBasicInfo(gl);
    showGPUInfo(gl);
    showCapabilities(gl);
    showExtensions(gl);
    generateFingerprint(gl);
};
