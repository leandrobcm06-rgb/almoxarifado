import { o as __toESM } from "../_runtime.mjs";
import { n as utils, r as writeFileSync, t as readSync } from "../_libs/xlsx.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-utils-Br7mJ8Y_.js
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
function exportToExcel(rows, filename, sheet = "Dados") {
	const ws = utils.json_to_sheet(rows);
	const wb = utils.book_new();
	utils.book_append_sheet(wb, ws, sheet);
	writeFileSync(wb, `${filename}.xlsx`);
}
function exportToPDF(title, headers, rows, filename, orientation = "portrait") {
	const doc = new import_jspdf_node_min.default({ orientation });
	doc.setFontSize(14);
	doc.text(title, 14, 16);
	doc.setFontSize(9);
	doc.text(`Gerado em ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}`, 14, 22);
	autoTable(doc, {
		head: [headers],
		body: rows,
		startY: 28,
		styles: { fontSize: 8 },
		headStyles: { fillColor: [
			60,
			60,
			60
		] }
	});
	doc.save(`${filename}.pdf`);
}
async function parseExcelFile(file) {
	const wb = readSync(await file.arrayBuffer(), { type: "array" });
	const ws = wb.Sheets[wb.SheetNames[0]];
	return utils.sheet_to_json(ws, { defval: null });
}
//#endregion
export { exportToPDF as n, parseExcelFile as r, exportToExcel as t };
