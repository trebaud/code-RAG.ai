import ollama from "ollama";

import { queryEmbedding, embedDataInDB } from "./embedding";
import { collection } from "./db";
import { loadData } from "./dataLoader";
import { logger } from "./utils";

const DATA_PATH = process.env.DATA_PATH ?? "data/AWS-course-EC2";
const QUERY = process.env.QUERY ?? "How to import Chroma?";
const LLM = process.env.LLM ?? "llama3";

const data = await loadData(DATA_PATH);
await embedDataInDB(data, collection);

const relevantDocs = await queryEmbedding(QUERY, collection);
logger.log({ relevantDocs });
const modelQuery = `${QUERY} - Answer that question using the following text as a resource: ${relevantDocs.join(" ")}`;

logger.log(`Query: "${QUERY}" >>`);
const stream = await ollama.generate({
  model: LLM,
  prompt: modelQuery,
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.response);
}
