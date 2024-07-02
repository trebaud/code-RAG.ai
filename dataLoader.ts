import { Glob } from "bun";

import { splitFileIntoChunks, getFileType } from "./utils";

import { logger, removeEmptyLines } from "./utils";

const CHUNK_SIZE = parseInt(process.env.CHUNK_SIZE as string) || 10;

async function loadFromCodeBase(
  accessor: string,
): Promise<{ id: string; chunks: string[] }[]> {
  const globPattern = "**/*.{ts,json,md,vue}";
  const glob = new Glob(globPattern);

  const codeSrc = [];
  const indexedFiles = [];
  for await (const filePath of glob.scan(accessor)) {
    // TODO parametrize ignore paths
    if (filePath.includes("node_modules")) continue;
    const [{ chunks, id }] = await loadFromFile(`${accessor}/${filePath}`);
    codeSrc.push({
      id, // maybe concat with file line nb
      chunks,
    });
    indexedFiles.push(filePath);
  }
  console.log("Indexed files: ", indexedFiles);
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
  logger.log(`Loading data from ${accessor}, "${type}" file type.`);
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
): Promise<{ chunks: string[]; id: string }[]> {
  const dataLoader = dataLoaderFactory(accessor);
  return dataLoader(accessor);
}
