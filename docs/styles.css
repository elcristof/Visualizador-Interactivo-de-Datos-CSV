:root{
  --bg:#f8fafc;
  --fg:#111;
  --brand:#2563eb;
  --brand-2:#3b82f6;
  --focus:#f59e0b;
  --muted:#e2e8f0;
  --border:#ddd;
  --card:#ffffff;
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--fg);
  font-size: 16px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--brand);
  color: white;
}

.controls button { margin-left: 5px; }

main { padding: 1rem; }

.grid2{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:1rem;
}
.grid4{
  display:grid;
  grid-template-columns: repeat(4, minmax(160px,1fr));
  gap:1rem;
}
@media (max-width:1000px){
  .grid4{ grid-template-columns: repeat(2,minmax(160px,1fr));}
}
@media (max-width:700px){
  .grid2{ grid-template-columns: 1fr; }
  .grid4{ grid-template-columns: 1fr; }
}

textarea {
  width: 100%;
  height: 120px;
  margin: 0.5rem 0;
}

.table-container {
  max-height: 360px;
  overflow: auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: var(--card);
}

table {
  width: 100%;
  border-collapse: collapse;
}
table th, table td {
  border-bottom: 1px solid var(--border);
  padding: 8px 10px;
}
table th {
  background: #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1;
}
.th-sort{
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  font-weight: 700;
  cursor: pointer;
}
.sort-icon{ opacity:.7; }

tbody tr.selected{
  background: #dbeafe; /* azul claro */
}
tbody tr:hover{
  background: #f1f5f9;
}

.chart-wrapper {
  width: 100%;
  height: 420px;
  max-width: 900px;
  margin-top: 1rem;
  background: var(--card);
  border-radius: 10px;
  padding: 10px;
  border: 1px solid var(--border);
}

/* Botones */
button {
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  background: var(--brand-2);
  color: white;
}
button:hover { background: var(--brand); }
button.secondary{
  background:#64748b;
}
button.secondary:hover{
  background:#475569;
}

button:focus, select:focus, textarea:focus, input:focus {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}

input[type="search"]{
  width:100%;
  padding:.6rem .8rem;
  border:1px solid var(--border);
  border-radius:10px;
  background:var(--card);
}

/* KPIs */
.kpi-controls{
  display:flex;
  gap:1rem;
  align-items:center;
  margin:.5rem 0 1rem;
}
.kpi-grid{
  display:grid;
  grid-template-columns: repeat(6, minmax(120px,1fr));
  gap:1rem;
}
@media (max-width:1100px){
  .kpi-grid{ grid-template-columns: repeat(3, minmax(120px,1fr)); }
}
@media (max-width:600px){
  .kpi-grid{ grid-template-columns: repeat(2, minmax(120px,1fr)); }
}
.kpi-card{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:16px;
  padding:14px;
  box-shadow: 0 1px 2px rgba(0,0,0,.04);
}
.kpi-card h3{
  margin:.2rem 0 .4rem;
  font-size:.95rem;
  color:#334155;
}
.kpi-card p{
  margin:0;
  font-size:1.6rem;
  font-weight:800;
}
.kpi-card small{
  color:#475569;
}

/* Hint */
.hint{ color:#475569; display:block; margin-top:.5rem; }

/* Dark mode */
.dark{
  --bg:#0f172a;
  --fg:#f1f5f9;
  --brand:#1e293b;
  --brand-2:#334155;
  --focus:#f59e0b;
  --muted:#334155;
  --border:#1f2937;
  --card:#0b1220;
}
.dark header{ background: var(--brand); }
.dark table th{ background: var(--muted); }
.dark tbody tr:hover{ background:#0f172a; }
.dark .kpi-card h3{ color:#cbd5e1; }
.dark .kpi-card small{ color:#94a3b8; }
