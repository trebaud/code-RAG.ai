import crypto from "crypto";
import fs from "fs";

export const logger = console;

export function removeEmptyLines(inputString: string): string {
  return inputString.replace(/\n\s*\n/g, "\n");
}

export function getRandomHash(): string {
  return crypto.randomBytes(6).toString("hex");
}

export function splitFileIntoChunks(text: string, chunkSize: number): string[] {
  const lines = text.split("\n");
  const result: string[] = [];

  const MAX_CHARS_PER_LINE = 200;

  for (let i = 0; i < lines.length; i += chunkSize) {
    const line = lines[i];

    if (line.length > MAX_CHARS_PER_LINE) {
      // Split the long line into chunks of up to `MAX_CHARS_PER_LINE` characters
      const chunks: string[] = [];
      let start = 0;

      while (start < line.length) {
        const end = Math.min(start + chunkSize, line.length);
        chunks.push(line.substring(start, end));
        start = end;
      }

      // Join the chunks and add to the result array
      result.push(chunks.join(" "));
    } else {
      result.push(line);
    }
  }

  return result;
}

export function getFileType(path: string) {
  const stat = fs.statSync(path);
  if (stat.isDirectory()) {
    return "directory";
  } else if (stat.isFile()) {
    const { type } = Bun.file(path);
    if (!type) {
      return "unknown";
    }
    return type;
  } else {
    return "unkown";
  }
}

export function renderProgressBar(
  progress: number,
  total: number,
  barLength: number = 100,
): void {
  const progressPercentage = (progress / total) * 100;
  const filledLength = Math.round((progressPercentage / 100) * barLength);
  const emptyLength = barLength - filledLength;

  const filledBar = "█".repeat(filledLength);
  const emptyBar = "░".repeat(emptyLength);

  const bar = `\r[${filledBar}${emptyBar}] ${progressPercentage.toFixed(2)}%`;

  process.stdout.write(bar);
}
