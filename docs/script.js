let csvData = [];
let headers = [];
let chart;
let darkMode = false;
let fontSize = 16;

// Mostrar mensajes accesibles
function setStatus(msg) {
    document.getElementById("status").innerText = msg;
}

// Parsear CSV
function parseCSV(text) {
    const result = Papa.parse(text.trim(), { skipEmptyLines: true });
    if (result.errors.length) {
        document.getElementById("warnings").innerText =
            " Error en CSV: " + result.errors[0].message;
        return;
    }
    headers = result.data[0];
    csvData = result.data.slice(1);
    renderTable();
    populateSelectors();
    updateChart();
    setStatus("CSV procesado correctamente");
}

function renderTable() {
    const table = document.getElementById("data-table");
    table.innerHTML = "";
    if (!headers.length) return;

    let thead = "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";
    let tbody = csvData
        .map(r => "<tr>" + r.map(c => `<td>${c}</td>`).join("") + "</tr>")
        .join("");
    table.innerHTML = thead + tbody;
}

function populateSelectors() {
    const xSel = document.getElementById("x-column");
    const ySel = document.getElementById("y-column");
    xSel.innerHTML = headers.map(h => `<option value="${h}">${h}</option>`).join("");
    ySel.innerHTML = headers.map(h => `<option value="${h}">${h}</option>`).join("");
}

function updateChart() {
    if (!headers.length) return;
    const xCol = document.getElementById("x-column").value;
    const yCol = document.getElementById("y-column").value;
    const type = document.getElementById("chart-type").value;
    const orientation = document.getElementById("orientation").value;

    const labels = csvData.map(r => r[headers.indexOf(xCol)]);
    const values = csvData.map(r => Number(r[headers.indexOf(yCol)]) || 0);

    const ctx = document.getElementById("chart").getContext("2d");
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: type === "line" ? "line" : "bar",
        data: {
            labels: labels,
            datasets: [{
                label: yCol,
                data: values,
                backgroundColor: "#3b82f6",
                borderColor: "#1d4ed8",
                borderWidth: 1,
            }, ],
        },
        options: {
            indexAxis: orientation === "horizontal" ? "y" : "x",
            responsive: true,
            plugins: { legend: { display: true } },
        },
    });
}

function exportChart() {
    html2canvas(document.querySelector(".chart-wrapper")).then(canvas => {
        const link = document.createElement("a");
        link.download = "chart.png";
        link.href = canvas.toDataURL();
        link.click();
    });
    setStatus("Gráfica exportada como imagen");
}

// Eventos
document.getElementById("parse-btn").onclick = () => {
    const text = document.getElementById("csv-input").value;
    parseCSV(text);
};
document.getElementById("csv-file").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        parseCSV(ev.target.result);
        setStatus("Archivo CSV cargado: " + file.name);
    };
    reader.readAsText(file);
};
["x-column", "y-column", "chart-type", "orientation"].forEach(id => {
    document.getElementById(id).onchange = updateChart;
});
document.getElementById("export-btn").onclick = exportChart;

// Modo oscuro
document.getElementById("darkmode-toggle").onclick = () => {
    darkMode = !darkMode;
    document.body.classList.toggle("dark", darkMode);
    setStatus(darkMode ? "Modo oscuro activado" : "Modo claro activado");
};

// Control de tamaño de letra
document.getElementById("increase-font").onclick = () => {
    fontSize += 2;
    document.body.style.fontSize = fontSize + "px";
    setStatus("Tamaño de letra aumentado");
};
document.getElementById("decrease-font").onclick = () => {
    fontSize = Math.max(12, fontSize - 2);
    document.body.style.fontSize = fontSize + "px";
    setStatus("Tamaño de letra disminuido");

};
