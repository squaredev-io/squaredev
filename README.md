<p align="center">
<img src="https://raw.githubusercontent.com/squaredev-io/squaredev/preview/public/sqd-dark-trans.png#gh-light-mode-only">
<img src="https://raw.githubusercontent.com/squaredev-io/squaredev/preview/public/sqd-light-trans.png#gh-dark-mode-only">
</p>

---

# SquareDev

SquareDev for developing applications powered by language models. Use cases include:

- 📈 Chat with your data
- 💬 Generate personalized text (emails, newsletter, notifications)
- 🤖 Chatbots
- 📊 Analyzing structured data
- 🔎 Semantic search
- 📚 Text & knowledge extraction
- 🧹 Structure unstructured data

## Features

- [x] Document Loaders
  - [x] PDF
  - [ ] JSON (coming soon)
  - [ ] Website (coming soon)
- [x] Vectors & Embeddings
  - [x] [Retrieval Augmented Generation](https://www.perplexity.ai/search/Retrieval-Augmented-Generation-wdAKdu4sSE.s1td7mtXqEQ?s=c)
  - [x] [Semantic search](https://www.perplexity.ai/search/semantic-search-eXS9K0oARMizIBbAkSvSAw?s=c)
  - [ ] Memory (coming soon)
- [x] Hosted Large Language Models (OSS & APIs)
  - [x] Open AI
  - [ ] [HuggingFaceH4/zephyr-7b-beta)](https://huggingface.co/HuggingFaceH4/zephyr-7b-beta)
- [ ] Monitoring (coming soon)
  - [ ] Usage (coming soon)
  - [ ] User feedback (coming soon)

![Architecture](/public/steps.png 'Architecture')

## Documentation

Full documentation (coming soon)

Full details on how to contribute will be available soon. For now please leave a ⭐️ and watch the repo.

## Community & Support

- [GitHub Discussions](https://github.com/squaredev-io/squaredev/discussions). Best for: help with building, discussion about best practices.
- [GitHub Issues](https://github.com/squaredev-io/squaredev/issues). Best for: bugs and errors you encounter using SquareDev.

## Status

- [x] Alpha: We are testing SquareDev with a closed set of customers
- [ ] Public Alpha: Anyone can sign up over at SquareDev.io. But go easy on us, there are a few kinks
- [ ] Public Beta: Stable enough for most use-cases
- [ ] Public: General Availability

We are currently in Alpha. Watch "releases" of this repo to get notified of major updates.

## How it works

SquareDev is a combination of open source tools that makes it easy to build with LLMs. Sitting on the shoulder of giant like [LangChain](https://www.langchain.com/), [Hugging Face](https://huggingface.co/), [Supabase](https://supabase.com/) and others. [SquareDev](https://squaredev.io/) is building the tools for developers with or without AI expertise to build with LLMs.

### Architecture

![Architecture](/public/architecture.png 'Architecture')

### Components

- Studio: The UI you will be interacting with to setup your project, manage your data, get API keys and other settings.
- API: The API is the gateway to your project. It is the interface that allows you to interact with your project.
- Knowledge engine: Handles all the magic that has to do with LLMs and embeddings of Retrieval, Memory, Contextual search, text extraction and other core features.
- Monitoring: Monitors your project and provides insights on performance, latency, malicious usage and other metrics.
