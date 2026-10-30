// Jalankan sekali: npx tsx scripts/csv-to-json.ts
// Mengubah data/heroes.csv dan data/skins.csv menjadi data/heroes.json dan data/skins.json
import { readFileSync, writeFileSync } from "node:fs";

const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') inQuotes = false;
      else cell += char;
    } else if (char === '"') inQuotes = true;
    else if (char === ",") { row.push(cell); cell = ""; }
    else if (char === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (char !== "\r") cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }

  return rows.filter((r) => r.some((value) => value.trim() !== ""));
};


const toValue = (raw: string): string | number | null => {
  const value = raw.trim();
  if (value === "" || value.toLowerCase() === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
};

const convert = (name: string) => {
  const text = readFileSync(new URL(`../data/${name}.csv`, import.meta.url), "utf-8")
    .replace(/^\uFEFF/, "");
  const [header, ...rows] = parseCsv(text);

  const data = rows.map((r) =>
    Object.fromEntries(header!.map((key, i) => [key.trim(), toValue(r[i] ?? "")])),
  );

  writeFileSync(
    new URL(`../data/${name}.json`, import.meta.url),
    JSON.stringify(data, null, 2),
  );
  console.log(`data/${name}.json : ${data.length} baris`);
};

convert("heroes");
convert("skins");