# 로컬 CLI 변경 사항 테스트

> 릴리스 전 CLI 변경사항을 로컬 빌드를 사용하여 모노레포 외부에서 테스트하는 방법.

CLI 또는 CLI가 번들링하는 패키지(core, engine, producer, studio)를 수정한 경우, 실제 프로젝트에서 *모노레포 외부*에서 — 최종 사용자가 `hyperframes preview`를 실행하는 것과 동일한 방식으로 — 해당 변경사항을 테스트해야 합니다.

## 사전 요구사항

먼저 모노레포를 빌드하세요. 소스 파일을 변경할 때마다 테스트 전에 다시 빌드해야 합니다.

```bash theme={null}
# From the monorepo root
bun run build
```

## 옵션 1: bun link (권장)

`bun link`는 `$PATH`에 있는 `hyperframes` 바이너리가 로컬 빌드를 가리키도록 설정합니다. 터미널 세션 간에 유지되며 재링크 없이 새 빌드를 자동으로 반영합니다.

```bash theme={null}
# If you previously installed hyperframes globally, remove it first —
# a global install takes priority over bun link and shadows your local build.
npm uninstall -g hyperframes 2>/dev/null

# Link your local build
cd packages/cli
bun link

# Verify — should print your local version AND point to the monorepo
hyperframes --version
which hyperframes
```

이제 어떤 디렉토리에서든 `hyperframes`를 정상적으로 사용할 수 있습니다:

```bash theme={null}
cd ~/my-video-project
hyperframes preview .
```

**`bun run build`를 실행할 때마다** 링크된 바이너리는 이미 최신 상태입니다 — 재링크가 필요 없습니다.

작업이 끝난 후 릴리스 버전으로 복원하려면:

```bash theme={null}
bun unlink hyperframes
npm install -g hyperframes@latest
```

## 옵션 2: node 별칭 (PATH 변경 없음)

글로벌 `$PATH`를 건드리고 싶지 않다면, 셸 별칭을 추가하거나 `node`를 직접 호출하세요:

```bash theme={null}
# Temporary alias for your current shell session
alias hyperframes="node /path/to/hyperframes/packages/cli/dist/cli.js"

# Or invoke directly
node /path/to/hyperframes/packages/cli/dist/cli.js preview .
```

`/path/to/hyperframes`를 실제 모노레포 경로로 교체하세요.

## 옵션 3: npm pack (실제 배포 아티팩트 테스트)

번들된 studio와 예제를 포함하여 릴리스에서 실제로 배포될 내용을 검증하고 싶을 때 사용하세요.

```bash theme={null}
cd packages/cli
npm pack
# Creates: hyperframes-<version>.tgz

# Test it in an isolated directory
mkdir /tmp/pack-test && cd /tmp/pack-test
npx /path/to/hyperframes/packages/cli/hyperframes-<version>.tgz init my-video
cd my-video
npx /path/to/hyperframes/packages/cli/hyperframes-<version>.tgz preview .
```

## 수정 브랜치 테스트

특정 버그 수정을 검증할 때, 테스트 프로젝트 아카이브 중 하나를 추출하고 시나리오를 실행하세요:

```bash theme={null}
# Example: testing audio-after-seek fix
unzip golden-lyric-video.zip && cd golden-lyric-video
hyperframes preview .
# 1. Press Play — confirm audio plays
# 2. Drag the timeline scrubber to a different position
# 3. Press Play again — audio should resume from the seeked position
```

주요 테스트 시나리오:

| 버그                        | 프로젝트                    | 단계                                             |
| -------------------------- | -------------------------- | ------------------------------------------------- |
| 탐색 후 오디오 무음    | `golden-lyric-video`       | 재생 → 탐색 → 다시 재생, 오디오 확인            |
| 렌더링 0%에서 멈춤         | 아무 프로젝트                        | Renders 탭 → Export → 진행 바 확인         |
| 재시작 후 다운로드 404 | 아무 프로젝트                        | 렌더링 완료 → `Ctrl+C` → 재시작 → 다운로드 |
| 타임라인 조기 중단       | `intro-vid`                | 재생 → `0:05`까지 도달해야 하며, `0:03`에서 멈추면 안 됨    |
| Lottie 누락             | `hyperframe-build-up-demo` | 재생 → 0–2초 동안 로켓이 보여야 함                |
| 빈 썸네일           | 아무 프로젝트                        | Compositions 사이드바에 미리보기가 표시되어야 함         |

## 문제 해결

**`bun run build` 후 변경사항이 반영되지 않음**

CLI 바이너리는 `packages/cli/dist/cli.js`에 있는 단일 번들 파일입니다. 변경사항이 `@hyperframes/core` 또는 다른 워크스페이스 패키지에 있는 경우, `bun run build`가 *모든* 패키지를 다시 빌드했는지 확인하세요 — CLI는 빌드 시점에 의존성을 번들링합니다.

**`hyperframes`가 여전히 이전 버전 / 이전 UI를 표시함**

글로벌로 설치된 `hyperframes` 패키지가 `bun link`를 가립니다. 어떤 바이너리가 활성화되어 있는지 확인하세요:

```bash theme={null}
which hyperframes
```

모노레포가 아닌 글로벌 저장소를 가리키고 있다면, 글로벌 설치를 제거하고 다시 링크하세요:

```bash theme={null}
npm uninstall -g hyperframes
cd packages/cli && bun link
```

**포트가 이미 사용 중**

`hyperframes preview`는 기본적으로 포트 3002를 사용하며, 해당 포트가 사용 중이면 자동으로 증가합니다. `--port`를 전달하여 특정 포트를 사용할 수 있습니다:

```bash theme={null}
hyperframes preview . --port 4000
```
