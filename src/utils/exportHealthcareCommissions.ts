import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

type ExportColumn = { key: string; label: string };
type ExportRow = Record<string, unknown>;

const COLORS = {
  blue: "FF173B67",
  red: "FFC7202F",
  paleBlue: "FFEAF1F8",
  paleGrey: "FFF3F5F7",
  border: "FFD5DBE2",
  white: "FFFFFFFF",
};

const MONEY_KEYS = new Set([
  "receipted_amount",
  "available_allocation",
  "broker_commission",
  "withholding_tax",
  "commission_payable",
  "transactionstotalamount",
  "transaction_total_amount",
]);
const DATE_KEYS = new Set([
  "sap_payment_receiptdate",
  "receipt_date",
  "paid_at",
]);
const numberValue = (value: unknown) =>
  Number.isFinite(Number(value)) ? Number(value) : 0;
const totalFor = (rows: ExportRow[], key: string) =>
  rows.reduce((sum, row) => sum + numberValue(row[key]), 0);

async function getLogoDataUrl() {
  const response = await fetch("/madison-group-logo.png");
  if (!response.ok) throw new Error("Unable to load Madison Group logo");
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function addBranding(
  workbook: ExcelJS.Workbook,
  sheet: ExcelJS.Worksheet,
  logo: string,
  lastColumn: number,
  reportDate: string,
  reportTitle: string
) {
  const logoId = workbook.addImage({ base64: logo, extension: "png" });
  sheet.addImage(logoId, {
    tl: { col: 0.15, row: 0.2 },
    ext: { width: 185, height: 50 },
  });
  sheet.mergeCells(1, 4, 2, lastColumn);
  const title = sheet.getCell(1, 4);
  title.value = reportTitle.toUpperCase();
  title.font = {
    name: "Montserrat",
    size: 18,
    bold: true,
    color: { argb: COLORS.blue },
  };
  title.alignment = { vertical: "middle", horizontal: "right" };
  sheet.mergeCells(3, 4, 3, lastColumn);
  const subtitle = sheet.getCell(3, 4);
  subtitle.value = `Commission payment report • Generated ${reportDate}`;
  subtitle.font = { size: 9, color: { argb: "FF64748B" } };
  subtitle.alignment = { horizontal: "right" };
  sheet.getRow(1).height = 25;
  sheet.getRow(2).height = 25;
  sheet.getRow(3).height = 18;
  sheet.getRow(4).height = 8;
  sheet.headerFooter.oddFooter =
    `&L${reportTitle}&CPage &P of &N&RConfidential`;
}

function styleHeader(row: ExcelJS.Row, dark = true) {
  row.height = 26;
  row.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: dark ? COLORS.blue : "FFDAE5F0" },
    };
    cell.font = {
      name: "Montserrat",
      size: 9,
      bold: true,
      color: { argb: dark ? COLORS.white : COLORS.blue },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
  });
}

function basePageSetup() {
  return {
    orientation: "landscape" as const,
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: {
      left: 0.25,
      right: 0.25,
      top: 0.45,
      bottom: 0.45,
      header: 0.2,
      footer: 0.2,
    },
  };
}

export async function exportHealthcareCommissions(
  data: ExportRow[],
  columns: ExportColumn[],
  reportTitle = "Healthcare Commissions"
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Madison Group";
  workbook.company = "Madison Group";
  workbook.title = reportTitle;
  workbook.subject = reportTitle;
  workbook.created = new Date();

  const logo = await getLogoDataUrl();
  const reportDate = new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  const groups = new Map<string, ExportRow[]>();
  [...data]
    .sort((a, b) =>
      String(a.broker_name || "Unassigned").localeCompare(
        String(b.broker_name || "Unassigned")
      )
    )
    .forEach((row) => {
      const broker = String(row.broker_name || "Unassigned Broker").trim();
      groups.set(broker, [...(groups.get(broker) || []), row]);
    });

  const summary = workbook.addWorksheet("Broker Summary", {
    views: [{ showGridLines: false }],
    pageSetup: basePageSetup(),
  });
  addBranding(workbook, summary, logo, 7, reportDate, reportTitle);
  summary.getRow(5).values = [
    "Broker",
    "Records",
    "Receipted",
    "Allocation",
    "Broker Commission",
    "WHT",
    "Commission Payable",
  ];
  styleHeader(summary.getRow(5));

  groups.forEach((rows, broker) => {
    const row = summary.addRow([
      broker,
      rows.length,
      totalFor(rows, "receipted_amount"),
      totalFor(rows, "available_allocation"),
      totalFor(rows, "broker_commission"),
      totalFor(rows, "withholding_tax"),
      totalFor(rows, "commission_payable"),
    ]);
    row.height = 21;
    row.eachCell((cell, index) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: row.number % 2 === 0 ? COLORS.paleBlue : COLORS.white },
      };
      cell.border = {
        bottom: { style: "hair", color: { argb: COLORS.border } },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: index > 1 ? "right" : "left",
      };
    });
  });

  const summaryTotal = summary.addRow([
    "GRAND TOTAL",
    data.length,
    totalFor(data, "receipted_amount"),
    totalFor(data, "available_allocation"),
    totalFor(data, "broker_commission"),
    totalFor(data, "withholding_tax"),
    totalFor(data, "commission_payable"),
  ]);
  summaryTotal.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.red },
    };
    cell.font = { bold: true, color: { argb: COLORS.white } };
  });
  summary.columns = [
    { width: 38 },
    { width: 12 },
    { width: 18 },
    { width: 18 },
    { width: 20 },
    { width: 16 },
    { width: 20 },
  ];
  summary.getColumn(2).numFmt = "#,##0";
  for (let index = 3; index <= 7; index += 1) {
    summary.getColumn(index).numFmt = "#,##0.00;[Red]-#,##0.00";
  }
  summary.autoFilter = { from: "A5", to: "G5" };
  summary.views = [{ state: "frozen", ySplit: 5, showGridLines: false }];

  const details = workbook.addWorksheet("Commission Details", {
    views: [{ showGridLines: false }],
    pageSetup: { ...basePageSetup(), printTitlesRow: "1:6" },
  });
  addBranding(
    workbook,
    details,
    logo,
    columns.length,
    reportDate,
    reportTitle
  );

  const cards = [
    {
      from: 1,
      to: 2,
      text: `${groups.size} BROKERS`,
    },
    {
      from: 3,
      to: 5,
      text: `RECEIPTED  ${totalFor(data, "receipted_amount").toLocaleString("en-KE", { minimumFractionDigits: 2 })}`,
    },
    {
      from: 6,
      to: 8,
      text: `ALLOCATION  ${totalFor(data, "available_allocation").toLocaleString("en-KE", { minimumFractionDigits: 2 })}`,
    },
    {
      from: 9,
      to: Math.max(9, columns.length),
      text: `PAYABLE  ${totalFor(data, "commission_payable").toLocaleString("en-KE", { minimumFractionDigits: 2 })}`,
    },
  ];
  cards.forEach(({ from, to, text }) => {
    details.mergeCells(5, from, 5, to);
    const cell = details.getCell(5, from);
    cell.value = text;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.paleBlue },
    };
    cell.font = { bold: true, color: { argb: COLORS.blue } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  details.getRow(5).height = 25;
  details.addRow([]);

  groups.forEach((rows, broker) => {
    const brokerRow = details.addRow([broker]);
    details.mergeCells(brokerRow.number, 1, brokerRow.number, columns.length);
    brokerRow.height = 26;
    brokerRow.getCell(1).value =
      `${broker.toUpperCase()}  •  ${rows.length} RECORD${rows.length === 1 ? "" : "S"}`;
    brokerRow.getCell(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.blue },
    };
    brokerRow.getCell(1).font = {
      bold: true,
      color: { argb: COLORS.white },
    };
    brokerRow.getCell(1).alignment = {
      vertical: "middle",
      horizontal: "left",
      indent: 1,
    };

    const header = details.addRow(columns.map((column) => column.label));
    styleHeader(header, false);

    rows.forEach((record, recordIndex) => {
      const row = details.addRow(
        columns.map((column) => {
          const value = record[column.key];
          if (MONEY_KEYS.has(column.key)) return numberValue(value);
          if (DATE_KEYS.has(column.key) && value) {
            const date = new Date(String(value));
            return Number.isNaN(date.getTime()) ? String(value) : date;
          }
          return value === null || value === undefined || value === ""
            ? "-"
            : value;
        })
      );
      row.height = 21;
      row.eachCell((cell, index) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: recordIndex % 2 === 0 ? COLORS.white : COLORS.paleGrey,
          },
        };
        cell.font = { size: 9, color: { argb: "FF273444" } };
        cell.alignment = {
          vertical: "middle",
          horizontal: MONEY_KEYS.has(columns[index - 1].key)
            ? "right"
            : "left",
        };
        cell.border = {
          bottom: { style: "hair", color: { argb: COLORS.border } },
        };
      });
    });

    const subtotal = details.addRow(
      columns.map((column, index) => {
        if (index === 0) return `${broker} subtotal`;
        return MONEY_KEYS.has(column.key)
          ? totalFor(rows, column.key)
          : "";
      })
    );
    subtotal.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE2E8EF" },
      };
      cell.font = { bold: true, color: { argb: COLORS.blue } };
      cell.border = {
        top: { style: "thin", color: { argb: COLORS.blue } },
      };
    });
    details.addRow([]);
  });

  const grandTotal = details.addRow(
    columns.map((column, index) => {
      if (index === 0) return "GRAND TOTAL";
      return MONEY_KEYS.has(column.key)
        ? totalFor(data, column.key)
        : "";
    })
  );
  grandTotal.height = 26;
  grandTotal.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.red },
    };
    cell.font = { bold: true, color: { argb: COLORS.white } };
  });

  columns.forEach((column, index) => {
    const sheetColumn = details.getColumn(index + 1);
    sheetColumn.width = Math.min(
      32,
      Math.max(
        MONEY_KEYS.has(column.key) ? 16 : 13,
        column.label.length + 3,
        column.key.includes("customer") || column.key.includes("broker")
          ? 24
          : 0
      )
    );
    if (MONEY_KEYS.has(column.key)) {
      sheetColumn.numFmt = "#,##0.00;[Red]-#,##0.00";
    } else if (DATE_KEYS.has(column.key)) {
      sheetColumn.numFmt = "dd-mmm-yyyy";
    } else {
      sheetColumn.numFmt = "@";
    }
  });
  details.views = [{ state: "frozen", ySplit: 6, showGridLines: false }];

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${reportTitle.replace(/[^a-z0-9]+/gi, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}
