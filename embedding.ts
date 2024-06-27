import ollama from "ollama";

import { logger, renderProgressBar } from "./utils";

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL ?? "all-minilm";
const NB_EMBEDDING_RESULTS = 3;

logger.log(`Running with ${EMBEDDING_MODEL} embedding model.`);

export async function getEmbedding(data: string): Promise<number[]> {
  const { embedding } = await ollama.embeddings({
    model: EMBEDDING_MODEL,
    prompt: data,
  });

  return embedding;
}

export async function embedDataInDB(
  data: { chunks: string[]; id: string }[],
  collection: any,
) {
  logger.log("Embedding data...");
  // let counter = 0;

  for (const { chunks, id } of data) {
    for (const [idx, chunk] of chunks.entries()) {
      // renderProgressBar(counter, chunks.length);
      if (typeof chunk !== "string") {
        logger.warn("Detected non string chunk - skipping");
        continue;
      }
      const embedding = await getEmbedding(chunk);
      await collection?.add({
        ids: [`${id}-${idx}`],
        embeddings: [embedding],
        documents: [chunk],
      });
      // counter++;
    }
  }
}

export async function queryEmbedding(query: string, collection: any) {
  logger.log(`\nQuerying with: "${query}"`);
  const queryEmbedding = await getEmbedding(query);
  const results = await collection?.query({
    queryEmbeddings: [queryEmbedding],
    queryTexts: [query],
    nResults: NB_EMBEDDING_RESULTS,
  });

  return results.documents[0];
}
