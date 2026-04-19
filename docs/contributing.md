# 기여하기

> Hyperframes에 기여하는 방법.

Hyperframes에 기여해 주셔서 감사합니다! 이 가이드는 환경 설정, 테스트 실행, 풀 리퀘스트 제출에 필요한 모든 것을 다룹니다.

## 시작하기

<Steps>
  <Step title="포크 및 클론">
    GitHub에서 저장소를 포크한 다음 클론하세요:

    ```bash theme={null}
    git clone https://github.com/YOUR_USERNAME/hyperframes.git
    cd hyperframes
    ```
  </Step>

  <Step title="의존성 설치">
    Hyperframes는 패키지 관리에 [bun](https://bun.sh/)을 사용합니다:

    ```bash theme={null}
    bun install
    ```
  </Step>

  <Step title="전체 패키지 빌드">
    모노레포를 빌드하여 모든 것이 정상적으로 컴파일되는지 확인하세요:

    ```bash theme={null}
    bun run build
    ```
  </Step>

  <Step title="스튜디오 실행">
    개발 서버를 시작하여 설정이 올바른지 확인하세요:

    ```bash theme={null}
    bun run dev
    ```

    스튜디오가 `http://localhost:3000`에서 미리보기와 함께 열리면 환경 준비가 완료된 것입니다.
  </Step>

  <Step title="브랜치 생성">
    작업을 위한 기능 브랜치를 생성하세요:

    ```bash theme={null}
    git checkout -b my-feature
    ```
  </Step>
</Steps>

## 개발

### 주요 명령어

```bash theme={null}
bun install                          # 전체 의존성 설치
bun run dev                          # 스튜디오 시작 (컴포지션 에디터 + 라이브 미리보기)
bun run build                        # 전체 패키지 빌드
bun run --filter '*' typecheck       # 전체 패키지 타입 검사
```

### 테스트 실행

<CodeGroup>
  ```bash Core theme={null}
  bun run --filter @hyperframes/core test
  ```

  ```bash Engine theme={null}
  bun run --filter @hyperframes/engine test
  ```

  ```bash Runtime Contract theme={null}
  bun run --filter @hyperframes/core test:hyperframe-runtime-ci
  ```

  ```bash Producer (Docker) theme={null}
  cd packages/producer && bun run docker:build:test && bun run docker:test
  ```
</CodeGroup>

### 전체 테스트 실행

```bash theme={null}
bun run --filter '*' test
```

## 패키지

| 패키지                                        | 경로                | 설명                                        |
| --------------------------------------------- | ------------------- | ------------------------------------------- |
| [`@hyperframes/core`](/packages/core)         | `packages/core`     | 타입, HTML 생성, 런타임, 린터               |
| [`@hyperframes/engine`](/packages/engine)     | `packages/engine`   | 시크 가능한 페이지-투-비디오 캡처 엔진      |
| [`@hyperframes/producer`](/packages/producer) | `packages/producer` | 전체 렌더링 파이프라인 (캡처 + 인코딩)      |
| [`@hyperframes/studio`](/packages/studio)     | `packages/studio`   | 컴포지션 에디터 UI                          |
| [`hyperframes`](/packages/cli)                | `packages/cli`      | 생성, 미리보기, 렌더링을 위한 CLI           |

## 무엇을 작업할까

어디서 시작해야 할지 모르겠다면, 다음을 참고하세요:

* **Good first issues** — GitHub에서 `good first issue` 레이블이 붙은 이슈를 찾아보세요
* **문서** — 문서를 개선하고, 예제를 추가하고, 오타를 수정하세요
* **린터 규칙** — 더 많은 컴포지션 실수를 잡을 수 있는 새로운 규칙을 추가하세요
* **예제** — 새로운 스타터 예제를 만드세요
* **버그 수정** — 이슈 트래커에서 보고된 버그를 확인하세요

## 풀 리퀘스트

### 커밋 형식

모든 커밋과 PR 제목에 [Conventional Commit](https://www.conventionalcommits.org/) 형식을 사용하세요:

```
feat: add timeline export
fix: resolve seek overflow at composition boundary
docs: add GSAP easing examples
refactor: extract frame buffer pool into shared module
test: add regression test for nested composition timing
```

### CI 요구 사항

PR이 병합되기 전에 다음 항목을 모두 통과해야 합니다:

* **빌드** — `bun run build`가 성공해야 합니다
* **타입 검사** — `bun run --filter '*' typecheck`에서 오류가 없어야 합니다
* **테스트** — 모든 테스트 스위트가 통과해야 합니다
* **시맨틱 PR 제목** — PR 제목이 Conventional Commit 형식을 따라야 합니다

### 리뷰 프로세스

* PR에는 메인테이너 1명 이상의 승인이 필요합니다
* PR은 집중적으로 유지하세요 — PR당 하나의 기능 또는 수정만 포함하세요
* 무엇이 변경되었고 왜 변경되었는지 명확하게 설명하세요
* 새로운 기능과 버그 수정에는 테스트를 추가하세요

## 이슈 보고

* 버그 보고와 기능 요청에는 [GitHub Issues](https://github.com/heygen-com/hyperframes/issues)를 사용하세요
* 새로운 이슈를 생성하기 전에 기존 이슈를 검색하세요
* 버그 보고 시 다음 내용을 포함하세요:
  * 재현 절차
  * 예상 동작과 실제 동작
  * Hyperframes 버전 (`npx hyperframes info`)
  * 운영체제 및 Node.js 버전

## 커뮤니티

<CardGroup cols={2}>
  <Card title="GitHub Issues" icon="github" href="https://github.com/heygen-com/hyperframes/issues">
    버그를 보고하고, 기능을 요청하고, 아이디어를 논의하세요.
  </Card>

  <Card title="행동 강령" icon="handshake" href="https://github.com/heygen-com/hyperframes/blob/main/CODE_OF_CONDUCT.md">
    커뮤니티의 표준과 기대 사항입니다.
  </Card>
</CardGroup>

## 라이선스

기여함으로써, 귀하의 기여물이 [MIT 라이선스](https://github.com/heygen-com/hyperframes/blob/main/LICENSE) 하에 라이선스될 것에 동의하게 됩니다.
