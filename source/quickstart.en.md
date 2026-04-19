# Quickstart

> Create, preview, and render your first Hyperframes video in under two minutes.

Go from zero to a rendered MP4, either by prompting your AI agent or by starting a project manually.

## Option 1: With an AI coding agent (recommended)

Install the HyperFrames skills, then describe the video you want:

```bash
npx skills add heygen-com/hyperframes
```

This teaches your agent (Claude Code, Cursor, Gemini CLI, Codex) how to write correct compositions and GSAP animations. In Claude Code the skills register as slash commands, `/hyperframes` for composition authoring, `/hyperframes-cli` for CLI commands, and `/gsap` for animation help. Invoking the slash command loads the skill context explicitly, which produces correct output the first time.

### Try it: example prompts

- **Cold start, describe what you want**
  - Using `/hyperframes`, create a 10-second product intro with a fade-in title over a dark background and subtle background music.
- **Warm start, turn existing context into a video**
  - Take a look at this GitHub repo https://github.com/heygen-com/hyperframes and explain its uses and architecture to me using `/hyperframes`.
  - Summarize the attached PDF into a 45-second pitch video using `/hyperframes`.
  - Turn this CSV into an animated bar chart race using `/hyperframes`.
- **Format-specific**
  - Make a 9:16 TikTok-style hook video about [topic] using `/hyperframes`, with bouncy captions synced to a TTS narration.
- **Iterate, talk to the agent like a video editor**
  - Make the title 2x bigger, swap to dark mode, and add a fade-out at the end.
  - Add a lower third at 0:03 with my name and title.

The agent handles scaffolding, animation, and rendering. See the prompting guide for more patterns.

> Skills encode HyperFrames-specific patterns, like required `class="clip"` on timed elements, GSAP timeline registration, and `data-*` attribute semantics, that are not in generic web docs. Using skills produces correct compositions from the start.

## Option 2: Start a project manually

### Prerequisites

- **Node.js 22+**: runtime for the CLI and dev server
- **FFmpeg**: video encoding for local renders

#### Install instructions

1. **Install Node.js 22+**
   - Check your version:

   ```bash
   node --version
   ```

   - Expected output:

   ```bash
   v22.0.0   # or any version >= 22
   ```

2. **Install FFmpeg**
   - FFmpeg is required for local video rendering.
   - macOS:

   ```bash
   brew install ffmpeg
   ```

   - Ubuntu / Debian:

   ```bash
   sudo apt install ffmpeg
   ```

   - Windows:

   ```bash
   # Download from https://ffmpeg.org/download.html
   # or install via winget:
   winget install ffmpeg
   ```

   - Verify installation:

   ```bash
   ffmpeg -version
   ```

   - Expected output:

   ```bash
   ffmpeg version 7.x ...
   ```

### Create your first video

1. **Scaffold the project**

   ```bash
   npx hyperframes init my-video
   cd my-video
   ```

   - This starts an interactive wizard for example selection and media import.
   - To skip prompts:

   ```bash
   npx hyperframes init my-video --non-interactive --example blank
   ```

   - See Examples for all available examples.
   - Generated structure:

   ```text
   my-video/
   ├── meta.json
   ├── index.html
   ├── compositions/
   │   ├── intro.html
   │   └── captions.html
   └── assets/
   │   └── video.mp4
   ```

   | Path | Purpose |
   | --- | --- |
   | `meta.json` | Project metadata (name, ID, creation date) |
   | `index.html` | Root composition, your video's entry point |
   | `compositions/` | Sub-compositions loaded via `data-composition-src` |
   | `assets/` | Media files (video, audio, images) |

   - If you have a source video, pass it with `--video` for automatic transcription and captions:

   ```bash
   npx hyperframes init my-video --example warm-grain --video ./intro.mp4
   ```

   - `hyperframes init` installs AI agent skills automatically, so you can hand off to your AI agent at any point.

2. **Preview in the browser**

   ```bash
   npx hyperframes preview
   ```

   - This starts Hyperframes Studio and opens your composition in the browser.
   - Edits to `index.html` reload automatically.
   - The dev server supports hot reload.

3. **Edit the composition**

   - Open the project with your AI coding agent.
   - Or edit `index.html` directly. Minimal composition:

   ```html
   <div id="root" data-composition-id="my-video"
        data-start="0" data-width="1920" data-height="1080">

     <!-- 1. Define a timed text clip on track 0 -->
     <h1 id="title" class="clip"
         data-start="0" data-duration="5" data-track-index="0"
         style="font-size: 72px; color: white; text-align: center;
                position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%);">
       Hello, Hyperframes!
     </h1>

     <!-- 2. Load GSAP for animation -->
     <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>

     <!-- 3. Create a paused timeline and register it -->
     <script>
       const tl = gsap.timeline({ paused: true });
       tl.from("#title", { opacity: 0, y: -50, duration: 1 }, 0);
       window.__timelines = window.__timelines || {};
       window.__timelines["my-video"] = tl;
     </script>
   </div>
   ```

   - Three rules to remember:
     - Root element must have `data-composition-id`, `data-width`, and `data-height`.
     - Timed elements need `data-start`, `data-duration`, `data-track-index`, and `class="clip"`.
     - GSAP timeline must be created with `{ paused: true }` and registered on `window.__timelines`.

4. **Render to MP4**

   ```bash
   npx hyperframes render --output output.mp4
   ```

   - Expected output:

   ```bash
   ✔ Capturing frames... 150/150
   ✔ Encoding MP4...
   ✔ output.mp4 (1920x1080, 5.0s, 30fps)
   ```

   - Your video is now at `output.mp4`.

## Requirements summary

| Dependency | Required | Notes |
| --- | --- | --- |
| **Node.js** 22+ | Yes | Runtime for CLI and dev server |
| **npm** or bun | Yes | Package manager |
| **FFmpeg** | Yes | Video encoding for local renders |
| **Docker** | No | Optional, for deterministic and reproducible renders |

## Next steps

- Browse the Catalog: 50+ ready-to-use blocks, transitions, overlays, data visualizations, and effects
- GSAP Animation: add fade, slide, scale, and custom animations
- Examples: start from built-in examples like Warm Grain and Swiss Grid
- Rendering: explore render options such as quality presets, Docker mode, and GPU encoding
