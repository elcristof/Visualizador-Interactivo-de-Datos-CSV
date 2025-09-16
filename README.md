# Visualizador Interactivo de datos CSV

## index.HTML
### Encabezado
* *titulo de la aplicación es: copia de excel*
* *botones de accesibilidad*

 **increase-font:** aumentar el tamaño de la letra en la app

 **decrease-font:** dsiminuir el tamaño de la letra en la app

 **darkmode-toggle:** activar y desactivar el modo oscuro en la app

### CSV
* Input de archivo **.csv**

* Área de texto para pegar CSV manualmente

* Botón Parsear para procesar los datos

* Mensajes de error o advertencia

## Tabla interactiva
- Se renderiza en `<table id="data-table">` con cabecera a partir de `headers`.
- Contenedor con scroll (`.table-container`) y borde.
- Accesible con `tabindex="0"` y `aria-label`.

---

## Gráficas
- Lienzo: `<canvas id="chart">` dentro de `.chart-wrapper`.
- Tipos:
  - **Barras** (`bar`)
  - **Líneas** (`line`)
- Orientación:
  - **Vertical** (`indexAxis: 'x'`)
  - **Horizontal** (`indexAxis: 'y'`)
- Dataset:
  - `label`: nombre de la columna **Y**
  - `data`: números parseados de la columna **Y**
- Colores por defecto (personalizables en `script.js`):
  - `backgroundColor: #3b82f6`
  - `borderColor: #1d4ed8`

---

## Exportar imagen
- Botón ** Exportar PNG** usa **html2canvas** sobre `.chart-wrapper`.
- Descarga **`chart.png`** con la visualización actual.

---

## Accesibilidad
- **`role="status"` + `aria-live="polite"`** para mensajes no intrusivos: `#status`.
- Botones con **`aria-label`** descriptivos.
- **Foco visible** en botones/select/textarea (`outline` ámbar).
- **Contraste** ajustado en modo oscuro/claro.

---

## Controles de interfaz
- **A+** / **A-**: ajustan fuente global (`fontSize` → `document.body.style.fontSize`).
- alterna **modo oscuro** añadiendo/removiendo la clase `.dark` en `<body>`.

---

## API interna (funciones)

### `setStatus(msg: string)`
Escribe un mensaje accesible en `#status` para feedback.

### `parseCSV(text: string)`
Usa PapaParse para convertir texto CSV en:
- `headers`: primera fila.
- `csvData`: resto de filas.
Luego llama `renderTable()`, `populateSelectors()`, `updateChart()`.

### `renderTable()`
Construye la tabla HTML con `<th>` a partir de `headers` y `<td>` desde `csvData`.

### `populateSelectors()`
Rellena `<select id="x-column">` y `<select id="y-column">` con los `headers`.

### `updateChart()`
- Lee **X, Y, Tipo, Orientación**.
- Prepara `labels` y `values` (conversión numérica con fallback `0`).
- Destruye la gráfica anterior si existe y crea una nueva instancia de **Chart**.

### `exportChart()`
Renderiza `.chart-wrapper` a canvas con **html2canvas** y descarga `chart.png`.

---

## Eventos registrados
- **Parsear**: `#parse-btn.onclick` → `parseCSV(...)`.
- **Archivo CSV**: `#csv-file.onchange` → `FileReader` → `parseCSV(...)`.
- **Selects** (`#x-column`, `#y-column`, `#chart-type`, `#orientation`): `onchange` → `updateChart()`.
- **Exportar**: `#export-btn.onclick` → `exportChart()`.
- **Modo oscuro**: `#darkmode-toggle.onclick` → alterna `.dark`.
- **Tipografía**:
  - `#increase-font.onclick` (+2 px, mínimo 12 px)
  - `#decrease-font.onclick` (−2 px, mínimo 12 px)

---

## Personalización
- **Colores** de gráfica: edita `backgroundColor` y `borderColor` del dataset en `updateChart()`.
- **Ancho máximo** de la gráfica: cambia `max-width` en `.chart-wrapper`.
- **Tema**: ajusta variables en `styles.css` (clases base y `.dark`).
- **Mensajes**: centraliza textos de `setStatus(...)` si deseas i18n.

---

## Limitaciones y notas
- **Valores no numéricos** en la columna **Y** se convierten a `0` (puede afectar la visualización).
- **CSV grande**: tablas con miles de filas pueden ser lentas sin paginación.
- **Seguridad**: `FileReader` no sube archivos a ningún servidor; se procesa **localmente** en el navegador.
- **Delimitadores**: PapaParse detecta `,` por defecto; si tu CSV usa `;`, pega el contenido y luego **Parsear** (PapaParse suele auto-detectar).

---

## Solución de problemas
- **“Error en CSV”**: revisa comillas, filas vacías y encabezados; usa el ejemplo de formato.
- **Eje Y vacío / ceros**: confirma que la columna **Y** tiene valores numéricos (sin símbolos).
- **No descarga PNG**: verifica que el navegador permita descargas iniciadas por scripts (prueba en otra pestaña o desactiva bloqueadores).
- **Gráfica en blanco**: confirma que elegiste columnas válidas en **X** y **Y** y que ya ejecutaste **Parsear**.

---

## Ideas de mejora
- Paginación, orden y filtros en la tabla.
- Detección automática de columnas numéricas y categóricas.
- Soporte para múltiples datasets/series.
- Paletas de color accesibles (WCAG) y selector de temas.
- Exportar **CSV limpio** y **configuración** de la gráfica (JSON).
- Deshacer/rehacer y autosave en `localStorage`.

