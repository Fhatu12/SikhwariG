import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { mdToPdf } from "md-to-pdf";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const inputPath = path.join(repoRoot, "docs", "site-owner-guide.md");
const outputPath = path.join(repoRoot, "docs", "site-owner-guide.pdf");
const stylesheetPath = path.join(repoRoot, "docs", "pdf.css");

async function main() {
  const result = await mdToPdf(
    { path: inputPath },
    {
      dest: outputPath,
      basedir: repoRoot,
      stylesheet: [stylesheetPath],
      pdf_options: {
        format: "A4",
        printBackground: true,
        margin: "18mm 16mm 18mm 16mm",
      },
    }
  );

  if (!result?.filename) {
    throw new Error("PDF export did not produce an output file.");
  }

  console.log(`Generated PDF: ${result.filename}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
