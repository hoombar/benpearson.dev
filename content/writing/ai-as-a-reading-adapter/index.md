---
title: "AI as a Reading Adapter"
slug: ai-as-a-reading-adapter
content_type: post
summary: "How I use AI to turn noisy AI information streams into reading and listening material I will actually consume."
date: 2026-05-25
draft: true
tags:
  - ai
  - workflows
  - reading
---

Keeping up with AI is a strange kind of reading problem.

There is too much material, but that is not quite the hard part. I can cope with there being more papers, model releases, engineering posts, and interesting experiments than I will ever read. The harder part is that most of it arrives in forms that do not fit the way I actually pay attention.

An interesting paper appears while I am meant to be working. A good engineering write-up gets buried in a feed. A useful thread points to something deeper, but the deeper thing is a PDF, a repo, or a long post that needs a clear half-hour. By the time I have found the thing, saved it, and vaguely promised myself I will come back to it, the moment has usually passed.

That has made me think less about AI as a way to answer questions, and more about AI as a way to adapt reading material into forms I will actually use.

I have started thinking of these workflows as reading adapters. They do not remove the need to choose what matters, and they definitely do not remove the need to think. They change the format, length, and context of the material so it can fit into a real habit: reading on a Kobo, listening while doing something else, or reviewing a guided summary when I have a small pocket of attention.

The main example is a Kobo workflow I have been building. It crawls a set of curated AI and product-engineering sources, scores candidates for things like relevance, practicality, evidence, durability, freshness, novelty, and source quality, then picks one high-value source for a deeper read. An AI model turns that source into a guided EPUB, adds source provenance and critic notes, and the finished file is delivered to Google Drive so the Kobo can pull it down when it syncs.

The important bit is not that this is fully automated. The important bit is that the output lands somewhere I already want to read. A web article sitting in a tab competes with every other tab. A PDF in a downloads folder competes with forgetting. An EPUB on a Kobo is a very different thing. It is calmer, more deliberate, and easier to treat as reading rather than browsing.

The critic pass matters for the same reason. I do not want the generated EPUB to pretend it is the source. I want it to be a guided version of the source, with enough provenance and caveats that I can keep my judgement engaged. If the model is summarising a paper or engineering post, I want to know what it used, why that source was selected, and where the weak spots might be. That does not make the result perfect, but it makes the workflow easier to trust and tune.

NotebookLM is the other version of the same idea. Instead of turning a source into something I can read on a Kobo, it turns a pile of notes or curated material into something I can listen to. That changes the kind of attention involved. Audio is not a good format for everything, and I would not use it for careful technical work, but it is good for catching themes, revisiting material, and keeping a topic warm in my head.

The pattern is similar in both cases. I start with material that is too scattered or awkward to use directly. I use AI to reshape it into a format with a clearer path through it. Then I read or listen to it in a setting where that format makes sense.

There is a trap here, which is that the workflow can start to feel like the achievement. It is easy to build an impressive pipeline that produces more material than I can read, or summaries that feel productive without changing what I understand. That is why I think the useful measure is not how much content the system generates. It is whether it creates better moments of attention.

For me, that means a small number of useful outputs. One good deep read on the Kobo is better than a folder of generated briefings. One listenable synthesis from NotebookLM is better than pretending I am going to revisit every note manually. The goal is not to industrialise my reading. It is to make the useful material easier to meet at the right time.

I have put some of this work into my [open-source Claude skills repo](https://github.com/hoombar/claude-skills), mostly because the workflows are easier to reuse when the assumptions are written down. The Kobo pipeline is there as a skill, with the source discovery, scoring, EPUB generation, critic pass, and delivery path documented. The NotebookLM process is simpler, but it sits in the same family of workflows: collect the material, shape it into a form I can use, then leave enough structure that I can come back to the original context if needed.

That last part is the bit I care about most. AI can make it very easy to produce plausible text, but plausible text is not the same as useful reading. The workflow has to preserve the trail back to the source, and it has to fit into a habit where I will actually spend attention on it.

I still read original sources. I still ignore most things. I still have to decide what is worth caring about. But when the stream is too noisy, AI can help me turn a few pieces of it into something I can read, listen to, and think with.

That feels like one of the more practical uses of AI for me at the moment: not replacing the reading, but making better inputs for it.
