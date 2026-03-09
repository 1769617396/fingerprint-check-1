function getNavigatorInfo() {
    const nav = navigator;
    let html = "<table>";
    html += "<tr><th>Property</th><th>Value</th></tr>";

    for (let key in nav) {
        try {
            let value = nav[key];

            if (typeof value === "function") {
                value = "function()";
            }

            if (typeof value === "object") {
                value = JSON.stringify(value);
            }

            html += `<tr><td>${key}</td><td>${value}</td></tr>`;
        } catch (e) {
            html += `<tr><td>${key}</td><td>Access denied</td></tr>`;
        }
    }

    html += "</table>";

    document.getElementById("navigator").innerHTML = html;
}



function getCanvasFingerprint() {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 100;

    ctx.textBaseline = "top";
    ctx.font = "20px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(0, 0, 400, 100);

    ctx.fillStyle = "#069";
    ctx.fillText("Browser Canvas Fingerprint", 10, 40);

    ctx.strokeStyle = "rgba(120,186,176,0.7)";
    ctx.arc(200, 50, 30, 0, Math.PI * 2);
    ctx.stroke();

    const fingerprint = canvas.toDataURL();

    document.getElementById("canvas").innerHTML =
        `<p><b>Canvas Hash:</b></p>
         <textarea rows="5" style="width:100%">${fingerprint}</textarea>`;
}



function getWebGLInfo() {

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
        document.getElementById("webgl").innerText = "WebGL not supported";
        return;
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

    const info = {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    };

    let html = "<table>";
    html += "<tr><th>Parameter</th><th>Value</th></tr>";

    for (let key in info) {
        html += `<tr><td>${key}</td><td>${info[key]}</td></tr>`;
    }

    html += "</table>";

    document.getElementById("webgl").innerHTML = html;
}



window.onload = function () {
    getNavigatorInfo();
    getCanvasFingerprint();
    getWebGLInfo();
};
