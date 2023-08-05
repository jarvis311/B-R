import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportPDF = (columns, rows) => {
    const columnsPdf = columns.map((items) => {
        return {
            title: items.headerName,
            field: items.field,
        };
    });
    const doc = new jsPDF();
    doc.autoTable({
        theme: "grid",
        columns: columnsPdf.map((col) => ({ ...col, dataKey: col.field })),
        body: rows,
    });
    doc.save(Date.now() + ".pdf");
};