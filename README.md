🏗️ wip

# Code RAG

Query your lcoal LLM against your code base.
Integration between ollama LLMs and chromaDB for Retrieval Augmented Generation.

Future roadmap:
* integrate with tree-sitter or another source code parser for better chunking of data

```bash
bun install
```

Usage:

```bash
QUERY="What function should I use to generate an embedding?" DATA_PATH="/path/to/root/folder" bun run dev
```

## Dependencies

- Install and run [ollama](https://ollama.com/download)
  - install an embedding model (defaults to all-minilm)
  - install an llm (defaults to llama3)
- Install and run [chromaDB](https://github.com/chroma-core/chroma)
