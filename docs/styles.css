let csvData = [];
let headers = [];
let chart;
let darkMode = false;
let fontSize = 16;

// estado de UI
let globalFilter = "";
let selectedRowIndexes = new Set();
let sortState = { index: null, asc: true };

// Mostrar mensajes accesibles
function setStatus(msg) {
  document.getElementById("status").innerText = msg;
}

// ===== CSV =====
function parseCSV(text) {
  const result = Papa.parse(text.trim(), { skipEmptyLines: true });
  if (result.errors.length) {
    document.getElementById("warnings").innerText = "Error en CSV: " + result.errors[0].message;
    return;
  }
  headers = result.data[0];
  csvData = result.data.slice(1);
  selectedRowIndexes.clear();
  sortState = { index: null, asc: true };
  setStatus("CSV procesado correctamente");
  updateAll();
}

// ===== Helpers de datos =====
function applyGlobalFilter(rows, term) {
  if (!term) return rows;
  const needle = term.toLowerCase();
  return rows.filter(r =>
    r.some(c => String(c ?? "").toLowerCase().includes(needle))
  );
}

function applySort(rows) {
  if (sortState.index == null) return rows;
  const idx = sortState.index;
  const asc = sortState.asc;
  const cloned = [...rows];
  cloned.sort((a, b) => {
    const av = a[idx];
    const bv = b[idx];
    const an = Number(av);
    const bn = Number(bv);
    const bothNumeric = !Number.isNaN(an) && !Number.isNaN(bn);
    let cmp;
    if (bothNumeric) cmp = an - bn;
    else cmp = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" });
    return asc ? cmp : -cmp;
  });
  return cloned;
}

function numericSeries(rows, colIndex) {
  return rows
    .map(r => Number(r[colIndex]))
    .filter(v => Number.isFinite(v));
}

function computeStats(rows, metricIndex) {
  const nums = numericSeries(rows, metricIndex);
  const n = nums.length;
  if (n === 0) return { sum: 0, avg: 0, min: 0, max: 0, count: 0 };
  const sum = nums.reduce((a, b) => a + b, 0);
  const avg = sum / n;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return { sum, avg, min, max, count: n };
}

function getFilteredData() {
  const filtered = applyGlobalFilter(csvData, globalFilter);
  return applySort(filtered);
}

function getWorkingData() {
  const filtered = getFilteredData();
  if (selectedRowIndexes.size === 0) return filtered;
  // map selection (which stores original indices) to current filtered order
  return filtered.filter((row) => {
    const originalIndex = csvData.indexOf(row);
    return selectedRowIndexes.has(originalIndex);
  });
}

// ===== Render: Tabla =====
function renderTable() {
  const table = document.getElementById("data-table");
  table.innerHTML = "";
  if (!headers.length) return;

  const filtered = getFilteredData();

  // header con sort
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  headers.forEach((h, i) => {
    const th = document.createElement("th");
    const btn = document.createElement("button");
    btn.className = "th-sort";
    btn.type = "button";
    btn.title = "Ordenar";
    btn.setAttribute("aria-label", `Ordenar por ${h}`);
    btn.textContent = h;

    const sortIcon = document.createElement("span");
    sortIcon.className = "sort-icon";
    if (sortState.index === i) sortIcon.textContent = sortState.asc ? " ▲" : " ▼";
    btn.appendChild(sortIcon);

    btn.onclick = () => {
      if (sortState.index === i) sortState.asc = !sortState.asc;
      else { sortState.index = i; sortState.asc = true; }
      renderTable();
      updateKPIs();
      updateChart();
    };
    th.appendChild(btn);
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  // body
  const tbody = document.createElement("tbody");
  filtered.forEach((row, idxFiltered) => {
    const tr = document.createElement("tr");

    const originalIndex = csvData.indexOf(row);
    const selected = selectedRowIndexes.has(originalIndex);
    if (selected) tr.classList.add("selected");

    tr.tabIndex = 0;
    tr.setAttribute("role", "row");
    tr.title = "Click o Enter para (des)seleccionar";

    tr.onclick = () => {
      toggleRowSelection(originalIndex);
      tr.classList.toggle("selected");
      updateKPIs();
      updateChart();
    };
    tr.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        tr.click();
      }
    };

    row.forEach((c) => {
      const td = document.createElement("td");
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // detalle de filas
  const statRowsDetail = document.getElementById("stat-rows-detail");
  statRowsDetail.textContent = `${selectedRowIndexes.size} seleccionadas`;
}

function toggleRowSelection(originalIndex) {
  if (selectedRowIndexes.has(originalIndex)) selectedRowIndexes.delete(originalIndex);
  else selectedRowIndexes.add(originalIndex);
}

// ===== Selectores (X, Y, métrica) =====
function populateSelectors() {
  const xSel = document.getElementById("x-column");
  const ySel = document.getElementById("y-column");
  const mSel = document.getElementById("metric-column");

  const options = headers.map(h => `<option value="${h}">${h}</option>`).join("");
  xSel.innerHTML = options;
  ySel.innerHTML = options;
  mSel.innerHTML = options;

  // valores por defecto prácticos
  xSel.selectedIndex = 0;
  ySel.selectedIndex = Math.min(1, headers.length - 1);
  mSel.selectedIndex = ySel.selectedIndex;
}

// ===== KPIs =====
function updateKPIs() {
  if (!headers.length) return;
  const mColName = document.getElementById("metric-column").value || headers[0];
  const mIdx = headers.indexOf(mColName);

  const visible = getFilteredData();
  const working = getWorkingData();

  // básicos
  document.getElementById("stat-rows").textContent = String(working.length);
  document.getElementById("stat-cols").textContent = String(headers.length);

  // métricos
  const s = computeStats(working, mIdx);
  document.getElementById("stat-sum").textContent = numberFmt(s.sum);
  document.getElementById("stat-avg").textContent = numberFmt(s.avg);
  document.getElementById("stat-min").textContent = numberFmt(s.min);
  document.getElementById("stat-max").textContent = numberFmt(s.max);

  // detalle selección
  document.getElementById("stat-rows-detail").textContent =
    `${selectedRowIndexes.size} seleccionadas (de ${visible.length} visibles)`;
}

function numberFmt(n) {
  if (!Number.isFinite(n)) return "0";
  return new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 }).format(n);
}

// ===== Chart =====
function updateChart() {
  if (!headers.length) return;

  const xCol = document.getElementById("x-column").value || headers[0];
  const yCol = document.getElementById("y-column").value || headers[1] || headers[0];
  const type = document.getElementById("chart-type").value;
  const orientation = document.getElementById("orientation").value;

  const rows = getWorkingData();
  const labels = rows.map(r => r[headers.indexOf(xCol)]);
  const values = rows.map(r => Number(r[headers.indexOf(yCol)]) || 0);

  const ctx = document.getElementById("chart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: type === "line" ? "line" : "bar",
    data: {
      labels,
      datasets: [{
        label: yCol,
        data: values,
        backgroundColor: "#3b82f6",
        borderColor: "#1d4ed8",
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: orientation === "horizontal" ? "y" : "x",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: { mode: "index", intersect: false }
      },
      scales: {
        x: { ticks: { autoSkip: true, maxTicksLimit: 12 } },
        y: { beginAtZero: true }
      }
    }
  });
}

// ===== Export =====
function exportChart() {
  html2canvas(document.querySelector(".chart-wrapper")).then(canvas => {
    const link = document.createElement("a");
    link.download = "chart.png";
    link.href = canvas.toDataURL();
    link.click();
  });
  setStatus("Gráfica exportada como imagen");
}

// ===== Eventos =====
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

["x-column", "y-column", "chart-type", "orientation", "metric-column"].forEach(id => {
  document.getElementById(id).onchange = () => {
    updateKPIs();
    updateChart();
  };
});

document.getElementById("export-btn").onclick = exportChart;

document.getElementById("darkmode-toggle").onclick = () => {
  darkMode = !darkMode;
  document.body.classList.toggle("dark", darkMode);
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

document.getElementById("global-filter").oninput = (e) => {
  globalFilter = e.target.value;
  renderTable();
  updateKPIs();
  updateChart();
};

document.getElementById("clear-selection").onclick = () => {
  selectedRowIndexes.clear();
  renderTable();
  updateKPIs();
  updateChart();
  setStatus("Selección de filas limpiada");
};

// ===== Ciclo de actualización inicial =====
function updateAll() {
  populateSelectors();
  renderTable();
  updateKPIs();
  updateChart();
}
