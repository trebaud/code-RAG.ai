🚧 wip

# Code RAG

Query your lcoal LLM about your code base.
Integration between ollama LLMs and chromaDB for Retrieval Augmented Generation.

```bash
bun install
```

Usage:

```bash
QUERY="What function should I use to generate an embedding?" DATA_PATH="/path/to/root/folder" bun run index.ts
```

## Dependencies

- Install and run [ollama](https://ollama.com/download)
  - install an embedding model (defaults to all-minilm)
  - install an llm (defaults to llama3)
- Install and run [chromaDB](https://github.com/chroma-core/chroma)
