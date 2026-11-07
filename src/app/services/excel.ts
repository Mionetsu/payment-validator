import * as XLSX from 'xlsx';
import type { RawRow } from '../models/validation.models';

const MAX_COLUMN_WIDTH = 60;

/** Reads the first sheet of an .xlsx file and returns one object per row. */
export function readRows(data: ArrayBuffer | Uint8Array): RawRow[] {
  const workbook = XLSX.read(data, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Raw values are kept on purpose: numbers stay numbers, text stays text.
  // `defval: null` makes empty cells appear as null instead of disappearing.
  return XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: null });
}

/** Builds an .xlsx file in memory from the processed rows. */
export function buildWorkbookData(rows: RawRow[]): ArrayBuffer {
  const sheet = XLSX.utils.json_to_sheet(rows);

  // Width of each column = its longest value (header included), with a small margin.
  const headers = Object.keys(rows[0] ?? {});
  sheet['!cols'] = headers.map((header) => {
    const longest = rows.reduce(
      (max, row) => Math.max(max, String(row[header] ?? '').length),
      header.length,
    );
    return { wch: Math.min(longest + 2, MAX_COLUMN_WIDTH) };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Resultado');

  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
}