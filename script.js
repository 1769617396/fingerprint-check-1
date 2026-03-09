function getNavigatorInfo() {
    const output = document.getElementById("output");
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

            html += `<tr>
                        <td>${key}</td>
                        <td>${value}</td>
                     </tr>`;
        } catch (err) {
            html += `<tr>
                        <td>${key}</td>
                        <td>Access denied</td>
                     </tr>`;
        }
    }

    html += "</table>";
    output.innerHTML = html;
}

window.onload = getNavigatorInfo;
