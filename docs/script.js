let csvData = [];
let headers = [];
let chart;
let darkMode = false;
let fontSize = 16;
const numberFormatter = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 });

const statusEl = document.getElementById("status");
const dataTable = document.getElementById("data-table");
const dashboard = document.getElementById("dashboard");

// Mostrar mensajes accesibles
function setStatus(msg) {
    if (statusEl) {
        statusEl.innerText = msg;
    }
}

// Parsear CSV
function parseCSV(text) {
    const warningsEl = document.getElementById("warnings");
    warningsEl.innerText = "";

    const result = Papa.parse(text.trim(), { skipEmptyLines: true });
    if (result.errors.length) {
        warningsEl.innerText = "Error en CSV: " + result.errors[0].message;
        setStatus("No se pudo procesar el CSV");
        return;
    }

    if (!result.data.length) {
        csvData = [];
        headers = [];
        renderTable();
        populateSelectors();
        updateDashboard();
        updateChart();
        setStatus("El CSV está vacío");
        return;
    }

    headers = result.data[0];
    csvData = result.data.slice(1).map(row => headers.map((_, idx) => row[idx] ?? ""));
    renderTable();
    populateSelectors();
    updateDashboard();
    updateChart();
    setStatus("CSV procesado correctamente");
}

function renderTable() {
    dataTable.innerHTML = "";
    if (!headers.length) {
        return;
    }

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headers.forEach((header, index) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.tabIndex = 0;
        th.textContent = header;
        th.dataset.colIndex = index;
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);

    const tbody = document.createElement("tbody");
    csvData.forEach((row, rowIndex) => {
        const tr = document.createElement("tr");
        row.forEach((cell, colIndex) => {
            const td = document.createElement("td");
            td.contentEditable = "true";
            td.dataset.row = String(rowIndex);
            td.dataset.col = String(colIndex);
            td.setAttribute("role", "textbox");
            td.setAttribute("aria-label", `Fila ${rowIndex + 1}, columna ${headers[colIndex]}`);
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    dataTable.appendChild(thead);
    dataTable.appendChild(tbody);
}

function populateSelectors() {
    const xSel = document.getElementById("x-column");
    const ySel = document.getElementById("y-column");

    xSel.innerHTML = headers.map(h => `<option value="${h}">${h}</option>`).join("");
    ySel.innerHTML = headers.map(h => `<option value="${h}">${h}</option>`).join("");

    if (headers.length) {
        if (!xSel.value) {
            xSel.value = headers[0];
        }
        if (!ySel.value) {
            ySel.value = headers[Math.min(1, headers.length - 1)];
        }
    }
}

function updateChart() {
    if (!headers.length) {
        if (chart) {
            chart.destroy();
            chart = undefined;
        }
        return;
    }

    const xSelect = document.getElementById("x-column");
    const ySelect = document.getElementById("y-column");

    let xCol = xSelect.value || headers[0];
    if (!headers.includes(xCol)) {
        xCol = headers[0];
        xSelect.value = xCol;
    }

    let yCol = ySelect.value || headers[0];
    if (!headers.includes(yCol)) {
        yCol = headers[headers.length - 1];
        ySelect.value = yCol;
    }
    const type = document.getElementById("chart-type").value;
    const orientation = document.getElementById("orientation").value;

    const xIndex = headers.indexOf(xCol);
    const yIndex = headers.indexOf(yCol);
    if (xIndex === -1 || yIndex === -1) {
        return;
    }

    const labels = csvData.map(row => row[xIndex] ?? "");
    const values = csvData.map(row => {
        const value = Number(row[yIndex]);
        return Number.isFinite(value) ? value : 0;
    });

    const ctx = document.getElementById("chart").getContext("2d");
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: type === "line" ? "line" : "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: yCol,
                    data: values,
                    backgroundColor: "#3b82f6",
                    borderColor: "#1d4ed8",
                    borderWidth: 1,
                    tension: 0.3,
                },
            ],
        },
        options: {
            indexAxis: orientation === "horizontal" ? "y" : "x",
            responsive: true,
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true },
            },
            scales: {
                x: { ticks: { color: darkMode ? "#f1f5f9" : "#0f172a" } },
                y: { ticks: { color: darkMode ? "#f1f5f9" : "#0f172a" } },
            },
        },
    });
}

function updateDashboard() {
    if (!headers.length) {
        dashboard.innerHTML = '<p class="stat-message">Carga un CSV para ver un resumen de los datos.</p>';
        return;
    }

    const totalRows = csvData.length;
    const totalCols = headers.length;
    const ySelect = document.getElementById("y-column");
    let yCol = ySelect.value || headers[0];
    if (!headers.includes(yCol)) {
        yCol = headers[0];
        ySelect.value = yCol;
    }
    const yIndex = headers.indexOf(yCol);

    const numericValues = yIndex === -1 ? [] : csvData
        .map(row => Number(row[yIndex]))
        .filter(value => Number.isFinite(value));

    const baseCards = [
        { label: "Registros", value: formatNumber(totalRows) },
        { label: "Columnas", value: formatNumber(totalCols) },
        { label: `Valores numéricos en ${yCol}`, value: formatNumber(numericValues.length) },
    ];

    let html = baseCards.map(card => createStatCard(card.label, card.value)).join("");

    if (numericValues.length) {
        const sum = numericValues.reduce((acc, value) => acc + value, 0);
        const avg = sum / numericValues.length;
        const min = Math.min(...numericValues);
        const max = Math.max(...numericValues);

        const numericCards = [
            { label: "Suma", value: formatNumber(sum) },
            { label: "Promedio", value: formatNumber(avg) },
            { label: "Mínimo", value: formatNumber(min) },
            { label: "Máximo", value: formatNumber(max) },
        ];
        html += numericCards.map(card => createStatCard(card.label, card.value)).join("");
    } else {
        html += '<p class="stat-message">La columna seleccionada no contiene valores numéricos válidos.</p>';
    }

    dashboard.innerHTML = html;
}

function createStatCard(label, value) {
    return `<article class="stat-card"><h3>${label}</h3><p>${value}</p></article>`;
}

function formatNumber(value) {
    return numberFormatter.format(value);
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
    const element = document.getElementById(id);
    element.onchange = () => {
        updateChart();
        updateDashboard();
    };
});
document.getElementById("export-btn").onclick = exportChart;

document.getElementById("darkmode-toggle").onclick = (event) => {
    darkMode = !darkMode;
    document.body.classList.toggle("dark", darkMode);
    event.currentTarget.setAttribute("aria-pressed", String(darkMode));
    event.currentTarget.textContent = darkMode ? "Modo claro" : "Modo oscuro";
    updateChart();
    setStatus(darkMode ? "Modo oscuro activado" : "Modo claro activado");
};

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

dataTable.addEventListener("input", (event) => {
    let cell = event.target;
    if (cell.nodeType === Node.TEXT_NODE) {
        cell = cell.parentElement;
    }
    if (!(cell instanceof HTMLElement)) {
        return;
    }
    if (!cell.matches("td[data-row][data-col]")) {
        cell = cell.closest("td[data-row][data-col]");
    }
    if (!cell) {
        return;
    }

    const rowIndex = Number(cell.dataset.row);
    const colIndex = Number(cell.dataset.col);
    if (!Number.isInteger(rowIndex) || !Number.isInteger(colIndex) || !csvData[rowIndex]) {
        return;
    }

    csvData[rowIndex][colIndex] = cell.textContent.trim();
    updateChart();
    updateDashboard();
    setStatus(`Celda actualizada en fila ${rowIndex + 1}, columna ${headers[colIndex]}`);
});
