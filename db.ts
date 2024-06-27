import { ChromaClient } from "chromadb";

const COLLECTION_NAME = process.env.COLLECTION_NAME ?? "test-collection";

export async function setupChromaDB() {
  const chroma = new ChromaClient({ path: "localhost:8000" });
  await chroma.deleteCollection({ name: COLLECTION_NAME });
  const collection = await chroma.getOrCreateCollection({
    name: COLLECTION_NAME,
  });
  return collection;
}

const collection = await setupChromaDB();
export { collection };
