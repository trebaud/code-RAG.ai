import { Glob } from "bun";
// import pdfParse from "pdf-parse";

import { splitFileIntoChunks, getFileType } from "./utils";

import { logger, removeEmptyLines } from "./utils";

const CHUNK_SIZE = parseInt(process.env.CHUNK_SIZE as string) || 5;

// async function loadFromPDF(filePath: string) {
//   const dataBuffer = fs.readFileSync(filePath);
//   const pdfData = await pdfParse(dataBuffer);
//   return pdfData.text;
// }

async function loadFromCodeBase(
  accessor: string,
): Promise<{ id: string; chunks: string[] }[]> {
  const globPattern = accessor || "**/*.ts";
  const glob = new Glob(globPattern);
  const codeSrc = [];
  for await (const filePath of glob.scan(".")) {
    // TODO parametrize ignore paths
    if (filePath.includes("node_modules")) continue;

    const [{ chunks, id }] = await loadFromFile(filePath);
    codeSrc.push({
      id, // maybe concat with file line nb
      chunks,
    });
  }

  return codeSrc;
}

async function loadFromFile(
  accessor: string,
): Promise<{ chunks: string[]; id: string }[]> {
  const file = Bun.file(accessor);
  const content = await file.text();
  const chunks = splitFileIntoChunks(removeEmptyLines(content), CHUNK_SIZE);
  return [{ chunks, id: accessor }];
}

function dataLoaderFactory(
  accessor: string,
): (accessor: string) => Promise<{ chunks: string[]; id: string }[]> {
  const type = getFileType(accessor);
  logger.log(`Loading data from "${type}" file type.`);
  switch (type) {
    case "directory":
      return loadFromCodeBase;
    case "application/octet-stream":
    case "text/plain;charset=utf-8":
      return loadFromFile;
    case "unknown":
      throw new Error(
        `File at ${accessor} with type ${type} could not resolve loader`,
      );
    default:
      throw new Error(
        `File at ${accessor} with type ${type} could not resolve loader`,
      );
  }
}

export async function loadData(
  accessor: string,
): Promise<{ chunks: string[]; id?: string }[]> {
  const dataLoader = dataLoaderFactory(accessor);
  const data = await dataLoader(accessor);
  return data;
}
