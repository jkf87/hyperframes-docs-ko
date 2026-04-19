# Review Report: docs/quickstart.md

**Source**: `source/quickstart.en.md`
**Translation**: `docs/quickstart.md`
**Reviewed**: 2026-04-20

---

## Changes Made

### 1. Heading hierarchy fix (structural)

The section "첫 번째 비디오 만들기" (Create your first video) was at `##` (h2) level, making it appear as a top-level section independent of "옵션 2". In the original, `### Create your first video` is nested under `## Option 2: Start a project manually`. Fixed:

| Location | Before | After |
|---|---|---|
| Line 96 | `## 첫 번째 비디오 만들기` | `### 첫 번째 비디오 만들기` |
| Line 98 | `### 1. 프로젝트 생성` | `#### 1. 프로젝트 생성` |
| Line 141 | `### 2. 브라우저에서 미리보기` | `#### 2. 브라우저에서 미리보기` |
| Line 149 | `### 3. 컴포지션 편집하기` | `#### 3. 컴포지션 편집하기` |
| Line 185 | `### 4. MP4로 렌더링하기` | `#### 4. MP4로 렌더링하기` |

---

## No Change Needed (verified OK)

- **Translation fidelity**: All content from the source is present; no omissions or hallucinated additions.
- **Code blocks**: All bash, HTML, and JS code blocks are intact and unmodified. Comments inside the HTML code block are appropriately translated to Korean.
- **Markdown tables**: All four tables render correctly with proper alignment.
- **Directory tree**: The Korean version correctly fixes the original's minor tree-drawing error (`└── assets/` followed by `│` was changed to spaces).
- **Terminology**: Technical terms (GSAP, CLI, FFmpeg, Docker, `data-*` attributes, `class="clip"`, `window.__timelines`) are kept in English, which is correct.
- **"원문" backlink** (line 7): Not in the original, but is a standard translation convention. Kept.
- **Added hyperlinks** in "프롬프팅 가이드" and "다음 단계": The original had plain text with no links; the Korean version adds full URLs. This is an improvement for usability. Kept.

---

## Remaining Caveats

1. **영상 vs 비디오**: The translation uses both "영상" (lines 3, 22-28, 199, 207) and "비디오" (lines 42, 62, 96, 129-131) for "video". Both are acceptable in Korean, but a single term would improve consistency. Consider standardizing to one.

2. **"설치 방법" heading level**: The original uses `#### Install instructions` (h4) under `### Prerequisites`. The Korean version promotes this to `### 설치 방법` (h3), making it a sibling of `### 사전 준비` rather than a child. This is a deliberate restructuring that reads well, but diverges from the original hierarchy. No action taken.

3. **Link verification**: The added URLs (e.g., `https://hyperframes.heygen.com/guides/prompting`, `https://hyperframes.heygen.com/catalog/blocks/data-chart`) were not verified against live endpoints. Should be spot-checked before publishing.

4. **"결정적이고 재현 가능한 렌더링"** (line 208): Translates "deterministic and reproducible renders". "결정적" is a literal translation of "deterministic" — "결정론적" is the more standard Korean CS term. Minor; both are understood.
