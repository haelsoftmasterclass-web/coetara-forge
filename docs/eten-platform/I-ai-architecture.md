# I. AI Architecture

**Goal:** AI that helps people learn, grounded in approved content, safe for tenants, affordable to run, and not locked to one provider.
**Timing:** AI foundation and a limited ETEN pilot in Phase 2; full AI features in Phase 3 ([Part 3](./03-prd-features-and-scope.md)). Nothing in the MVP depends on AI, but MVP content is stored in a structured way that makes later retrieval possible.

## I.1 Overall design

```text
 Learner / Instructor / Admin UI
          │  (feature requests: "explain", "practice questions", "recommend")
          ▼
 ┌──────────────────────────── API: AI module ────────────────────────────┐
 │  Feature services                                                       │
 │   Tutor · Course assistant · Question generator · Recommender ·         │
 │   Grading assistant · Mentor matcher · Career assistant                 │
 │          │                                                              │
 │  Policy & guardrails: permissions, tenant AI settings, credit check,    │
 │  input moderation, prompt-injection defences, PII redaction             │
 │          │                                                              │
 │  Context builder (retrieval) ──► Retriever ──► pgvector (content_chunks)│
 │          │                         filtered by tenant + entitlement     │
 │  Prompt registry (versioned templates per feature)                      │
 │          │                                                              │
 │  AI Gateway: provider adapters, model routing, retries, timeouts,      │
 │  streaming, caching, token metering, cost logging                       │
 └──────────┬───────────────────────────────────────────┬─────────────────┘
            ▼                                           ▼
   LLM providers (adapters):                     Embedding providers
   e.g. Anthropic, OpenAI, Azure OpenAI,         (adapter, same idea)
   Google, self-hosted open-weight models
```

**Principles**
1. **Provider-agnostic:** features call `AiGateway::complete(feature, messages, options)`; the gateway picks the model from configuration (`ai_model_routes`: feature → provider → model → fallback). Swapping providers is a config change plus an adapter, never a feature rewrite.
2. **Grounded first:** course-related answers come from retrieved, approved content with citations.
3. **Honest when unsure:** if retrieval finds nothing relevant, the assistant says the course material doesn't cover it and, if the tenant allows general knowledge, clearly labels the answer as general information not from the course.
4. **Human in the loop** for anything that affects grades, credentials or published content.
5. **Tenant control and privacy:** tenants can switch AI off, choose features, set budgets; tenant data is never used to train provider models (use providers' no-training/zero-retention API terms where available).

## I.2 AI services

| Service | What it does | Inputs | Output | Oversight | Phase |
| --- | --- | --- | --- | --- | --- |
| **Course assistant / "Ask about this lesson"** | Explain, summarise, give examples, answer questions about the current lesson/course | Question, lesson/course context, retrieved chunks | Answer with citations to lessons | Thumbs up/down; instructors see aggregated questions | P2 pilot |
| **AI tutor** | Multi-turn tutoring: Socratic hints, "test my understanding", "explain why my answer was wrong" | Conversation, learner progress, attempt details (own only) | Hints, explanations, mini-quizzes | Doesn't reveal answers to active graded assessments | P3 |
| **Practice question generator (learner)** | Generate ungraded practice questions from a lesson | Lesson chunks | Questions + explanations | Marked "AI-generated practice"; not counted for grades | P3 |
| **Assessment generator (instructor)** | Draft questions for the bank from approved content | Selected lessons, difficulty, types, skill tags | Draft questions with sources | **Instructor must review and approve** before use | P3 |
| **Study plan** | Weekly plan towards a goal/exam date | Goal, available hours, progress, path | Plan with linked items | Learner editable | P3 |
| **Recommendations** | Next course/path/mentor/project/assessment | Goals, skills, history, scores, interests | Ranked items with reasons ("Because your networking score was 55%") | Rules + ML ranking; explanation always shown | P3 (rules in MVP) |
| **Grading assistant** | Suggest rubric scores and feedback for essays/projects | Submission, rubric, brief | Suggested scores + feedback draft | **Reviewer decides**; suggestion stored separately | P3 |
| **Skill assessment (adaptive)** | Adaptive questioning to estimate level | Item bank with difficulty | Level estimate + evidence | Counts as evidence only via approved item bank | P3 |
| **Mentor matching** | Match learners to mentors | Goals, skills, domain, language, budget, availability, mentor expertise | Top 3 mentors with reasons | Learner chooses | P3 |
| **Career assistant** | Explain roles, skill gaps, next steps | Profile, skills, goals, tenant career content | Guidance with links | Clearly labelled as guidance, not advice | P3 |
| **Content helpers (instructor)** | Draft lesson summaries, captions clean-up, outlines | Instructor content | Drafts | Instructor edits and publishes | P3 |

## I.3 Data sources

| Source | Used by | Rules |
| --- | --- | --- |
| Lesson text blocks, PDFs (extracted text), video/audio transcripts | Assistant, tutor, generators | Only published content; tenant-scoped; learner must be entitled (enrolled or preview) |
| Organisation-approved resources (uploaded by admins into an "AI knowledge" library) | Assistant, career assistant | Admin marks resources as AI-approved |
| Course metadata, outcomes, skill tags | All | |
| Learner's own progress, attempts, skills | Tutor, recommendations, study plan | Only the learner's own data; never shared across learners |
| Mentor profiles (public parts) | Mentor matching | Public profile fields only |
| Aggregate signals (popular next courses) | Recommendations | Aggregated and anonymised within tenant |
| General model knowledge | Optional per tenant | Labelled "General information (not from your course)" |

Excluded: private mentor notes, payment data, other learners' data, raw personal identifiers (names/emails are not sent to providers unless strictly needed).

## I.4 Retrieval architecture (RAG)

1. **Ingestion (on publish/update):** `ContentPublished` event → extract text (blocks, PDF text, transcripts) → clean → split into chunks (~400 to 800 tokens, overlapping, respecting headings) → embed → store in `content_chunks` with `organization_id`, `course_id`, `lesson_id`, `chunk_index`, `content_hash`, `embedding`.
2. **Re-index** only changed chunks (hash comparison). Deleting/unpublishing removes chunks.
3. **Query:**
   - Build a search query from the question + current lesson context.
   - **Hybrid search:** vector similarity (pgvector HNSW index) + Postgres full-text (keywords, product names like "AZ-104"), merged with reciprocal rank fusion.
   - **Hard filters in SQL:** `organization_id = current tenant` (also enforced by RLS) AND `course_id IN (learner's entitled courses)`. Retrieval can never return another tenant's content.
   - Prefer chunks from the current lesson, then course, then tenant library.
   - Optional re-ranking step for top 20 → top 6.
4. **Answer generation** with retrieved chunks inserted as clearly delimited, numbered sources; model instructed to cite `[1]`, `[2]`; citations rendered as links to the lesson (and timestamp for video transcripts).
5. **Groundedness check (P3):** lightweight check that each cited claim appears in its source; low-confidence answers get a "Check this in the lesson" note.
6. **Scale path:** pgvector is fine to millions of chunks; move to a dedicated vector store only if latency/volume require it (adapter interface exists).

## I.5 Prompt architecture

- **Prompt registry:** versioned templates per feature stored in code (reviewed via PR) with IDs like `assistant.lesson.v3`. Each AI call logs the template version for debugging and evaluation.
- **Layers:**
  1. *System layer (platform):* role, safety rules, honesty rules ("If the sources don't contain the answer, say so"), citation format, refusal to reveal graded answers, tone.
  2. *Tenant layer:* academy name, terminology, tone settings, whether general knowledge is allowed, language.
  3. *Feature layer:* task-specific instructions (explain, quiz, plan).
  4. *Context layer:* retrieved sources (delimited and labelled as untrusted content), learner level, current lesson.
  5. *User layer:* the learner's message.
- **Prompt-injection defence:** retrieved content and user text are wrapped and labelled as data; the system layer instructs the model not to follow instructions inside sources; outputs are post-checked (no hidden links, no attempts to call tools that weren't allowed). AI features have **no write access** to the platform except through explicit, permission-checked actions (e.g. "save this study plan" calls the normal API as the user).
- **Structured outputs:** generators return JSON validated against a schema (question type, stem, options, correct answer, explanation, source chunk IDs); invalid output is retried or rejected.
- **Evaluation:** a test set per feature (questions with expected grounded answers) runs in CI when prompts or models change; tracks groundedness, helpfulness, refusal correctness, cost and latency.

## I.6 Permissions

| Feature | Who can use | Data scope |
| --- | --- | --- |
| Course assistant, tutor, practice questions | Learners (`ai.assistant.use`) in tenants with the feature on | Entitled courses + own progress |
| Assessment generator, content helpers | Instructors for their own courses; admins | Own course content |
| Grading assistant | Reviewers/instructors for assigned items | The submission + rubric |
| Recommendations, mentor matching | Learners (own) | Own data + public catalogue/mentors |
| AI settings, usage | Org admins (`ai.settings.manage`) | Tenant |
| Model routing, provider keys, global budgets | Super admin | Platform |

All AI endpoints run inside the normal tenant context (RLS applies) and the normal policies.

## I.7 Cost controls and usage limits

| Control | Design |
| --- | --- |
| Credits | Plans include monthly AI credits (1 credit ≈ a defined token amount by model tier); add-on packs (P2) |
| Per-learner limits | Daily message cap (e.g. 50/day default) and per-conversation length cap; configurable per tenant |
| Tenant budget | Hard monthly cap; alert at 80%; behaviour at 100% configurable (block or degrade to cheaper model) |
| Platform budget | Global spend alerts per provider; kill switch per feature |
| Model routing by task | Small, cheap models for classification, query rewriting, summaries; larger models only for tutoring and generation |
| Caching | Cache embeddings by content hash; cache answers to identical questions on the same lesson (per tenant, with short TTL); use provider prompt caching for long, repeated system/context prefixes where supported |
| Context discipline | Top-k chunks with token budget; summarise long conversations |
| Metering | Every call logs tokens in/out, model, cost (`ai_usage`), feature, tenant, user → AI usage dashboards (tenant and platform) |
| Timeouts & fallbacks | Per-feature timeouts; fallback model; graceful message if AI unavailable (core learning never blocked) |

## I.8 Human oversight

- AI-generated questions start as **drafts** and require instructor approval; their origin is stored (`source = ai`, model, prompt version).
- AI grading suggestions are shown to reviewers side by side with the rubric; the reviewer's decision is final and recorded as theirs. Learners are told when AI assisted grading.
- Feedback loop: thumbs up/down with reason on every answer; instructors see frequent questions and low-rated answers per lesson (a great signal for improving content).
- Tenants can review AI conversation samples (anonymised by default) for quality; access is permissioned and audited.
- Incident path: a "Report a problem" button on AI answers routes to tenant admins and the platform team.
- Recommendations always show **why** they were made; learners can dismiss ("Not interested") which feeds back into ranking.

## I.9 Privacy and safety

- **Data processing terms:** use provider API terms that exclude training on customer data; prefer zero/limited retention options; document sub-processors in the DPA.
- **Data minimisation:** send only needed context; strip names/emails from prompts unless needed; never send payment or private mentor note data.
- **Regional considerations:** choose provider regions compatible with tenant data-residency commitments; enterprise tenants can restrict to specific providers/regions or disable AI.
- **Content safety:** moderation on inputs and outputs (harassment, self-harm, illegal content) with safe responses and escalation for self-harm signals per tenant policy.
- **Minors:** if a tenant serves under-18 learners (some universities/schools), stricter defaults (no general knowledge mode, extra moderation).
- **Transparency:** UI labels AI content clearly ("AI assistant · answers based on this course"); a help page explains how the AI works and its limits.
- **Retention:** AI conversations retained 12 months by default (configurable), deletable by the learner; usage metrics kept longer without content.
- **Accessibility:** assistant usable by keyboard and screen readers; streamed responses announced politely.
