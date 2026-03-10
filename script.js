function initWebGL() {

    const canvas = document.createElement("canvas");

    const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");

    if (!gl) {

        document.body.innerHTML +=
            "<p>WebGL not supported</p>";

        return;
    }

    showBasicInfo(gl);
    showGPUInfo(gl);
    showCapabilities(gl);
    showExtensions(gl);
    generateFingerprint(gl);
}

function showBasicInfo(gl) {

    const info = {
        version: gl.getParameter(gl.VERSION),
        shading: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER)
    };

    renderTable("webgl-basic", info);
}

function showGPUInfo(gl) {

    const ext = gl.getExtension("WEBGL_debug_renderer_info");

    if (!ext) {

        document.getElementById("webgl-gpu").innerText =
            "WEBGL_debug_renderer_info not available";

        return;
    }

    const gpu = {
        vendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
    };

    renderTable("webgl-gpu", gpu);
}

function showCapabilities(gl) {

    const caps = {
        MAX_TEXTURE_SIZE: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        MAX_VERTEX_ATTRIBS: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        MAX_RENDERBUFFER_SIZE: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)
    };

    renderTable("webgl-cap", caps);
}

function showExtensions(gl) {

    const ext = gl.getSupportedExtensions();

    document.getElementById("webgl-ext").innerHTML =
        "<pre>" + JSON.stringify(ext, null, 2) + "</pre>";
}

function generateFingerprint(gl) {

    const data = [
        gl.getParameter(gl.VERSION),
        gl.getParameter(gl.RENDERER),
        gl.getParameter(gl.VENDOR)
    ].join("###");

    const hash = simpleHash(data);

    document.getElementById("webgl-fp").innerText = hash;
}

function renderTable(id, obj) {

    let html = "<table>";

    for (let key in obj) {

        html +=
            "<tr><td>" + key + "</td><td>" + obj[key] + "</td></tr>";
    }

    html += "</table>";

    document.getElementById(id).innerHTML = html;
}

function simpleHash(str) {

    let hash = 0;

    for (let i = 0; i < str.length; i++) {

        hash = ((hash << 5) - hash) + str.charCodeAt(i);

        hash |= 0;
    }

    return hash;
}

window.onload = initWebGL;
