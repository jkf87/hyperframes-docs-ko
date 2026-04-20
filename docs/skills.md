--- 
--- 

# 스킬로 Claude 확장

Claude Code에서 Claude의 기능을 확장하기 위한 스킬을 생성, 관리 및 공유하세요. 여기에는 사용자 지정 명령과 번들 스킬이 포함됩니다.

스킬은 Claude가 할 수 있는 일을 확장합니다. 지침과 함께 `SKILL.md` 파일을 생성하면 Claude가 이를 도구 키트에 추가합니다. Claude는 관련성이 있을 때 스킬을 사용하거나 `/skill-name`으로 직접 호출할 수 있습니다.

동일한 플레이북, 체크리스트 또는 다단계 절차를 채팅에 계속 붙여넣는 경우, 또는 `CLAUDE.md` 섹션이 사실보다는 절차로 커진 경우 스킬을 만드세요. `CLAUDE.md` 콘텐츠와 달리 스킬의 본문은 사용될 때만 로드되므로, 긴 참조 자료는 필요할 때까지 거의 비용이 들지 않습니다.

참고(Note) 태그는 번역에서 제거되었습니다.

`/help` 및 `/compact`와 같은 내장 명령과 `/debug` 및 `/simplify`와 같은 번들 스킬은 [명령어 참조](/commands)를 참조하세요.

**사용자 지정 명령이 스킬에 통합되었습니다.** `.claude/commands/deploy.md`의 파일과 `.claude/skills/deploy/SKILL.md`의 스킬은 모두 `/deploy`를 생성하며 동일하게 작동합니다. 기존 `.claude/commands/` 파일은 계속 작동합니다. 스킬은 선택적 기능을 추가합니다: 지원 파일을 위한 디렉토리, [사용자 또는 Claude가 스킬을 호출하는 방법을 제어](#control-who-invokes-a-skill)하기 위한 frontmatter, 그리고 Claude가 관련성이 있을 때 자동으로 로드하는 기능.

Claude Code 스킬은 여러 AI 도구에서 작동하는 [Agent Skills](https://agentskills.io) 오픈 표준을 따릅니다. Claude Code는 [호출 제어](#control-who-invokes-a-skill), [서브에이전트 실행](#run-skills-in-a-subagent), [동적 컨텍스트 삽입](#inject-dynamic-context)과 같은 추가 기능으로 표준을 확장합니다.

## 번들 스킬

Claude Code는 `/simplify`, `/batch`, `/debug`, `/loop`, `/claude-api`를 포함하여 모든 세션에서 사용할 수 있는 번들 스킬 세트를 포함합니다. 고정된 로직을 직접 실행하는 내장 명령과 달리, 번들 스킬은 프롬프트 기반입니다: Claude에게 상세한 플레이북을 제공하고 Claude가 도구를 사용하여 작업을 조율하도록 합니다. 다른 스킬과 동일하게 `/` 뒤에 스킬 이름을 입력하여 호출합니다.

번들 스킬은 [명령어 참조](/commands)에 내장 명령과 함께 나열되어 있으며, 목적 열에 **스킬**로 표시됩니다.

## 시작하기

### 첫 번째 스킬 만들기

이 예시는 Claude에게 시각적 다이어그램과 유추를 사용하여 코드를 설명하도록 가르치는 스킬을 만듭니다. 기본 frontmatter를 사용하므로, Claude는 무언가가 어떻게 작동하는지 물을 때 자동으로 로드하거나 `/explain-code`로 직접 호출할 수 있습니다.

Steps 및 Step 태그는 번역에서 제거되었습니다.

**스킬 디렉토리 생성**
개인 스킬 폴더에 스킬을 위한 디렉토리를 만드세요. 개인 스킬은 모든 프로젝트에서 사용할 수 있습니다.

```bash
mkdir -p ~/.claude/skills/explain-code
```

**SKILL.md 작성**
모든 스킬에는 두 부분으로 구성된 `SKILL.md` 파일이 필요합니다: Claude에게 스킬을 언제 사용할지 알려주는 YAML frontmatter(`---` 마커 사이)와 스킬이 호출될 때 Claude가 따르는 지침이 포함된 마크다운 콘텐츠입니다. `name` 필드는 `/슬래시-명령어`가 되고, `description`은 Claude가 자동으로 로드할 시기를 결정하는 데 도움이 됩니다.

`~/.claude/skills/explain-code/SKILL.md`를 만드세요:

```yaml  theme={null}
--- 
name: explain-code
description: 시각적 다이어그램과 유추를 사용하여 코드를 설명합니다. 코드가 어떻게 작동하는지 설명하거나, 코드베이스에 대해 가르치거나, 사용자가 "이것은 어떻게 작동합니까?"라고 물을 때 사용하세요.

코드를 설명할 때 항상 다음을 포함하세요:

1. **유추로 시작**: 코드를 일상생활의 무언가와 비교
2. **다이어그램 그리기**: ASCII 아트를 사용하여 흐름, 구조 또는 관계를 보여줍니다.
3. **코드 자세히 살펴보기**: 단계별로 어떤 일이 일어나는지 설명합니다.
4. **함정 강조**: 일반적인 실수나 오해는 무엇입니까?

설명은 대화식으로 유지하세요. 복잡한 개념의 경우 여러 유추를 사용하세요.
```

**스킬 테스트**
두 가지 방법으로 테스트할 수 있습니다:

**Claude가 자동으로 호출하도록 허용**하려면 설명과 일치하는 내용을 물어보세요:

```text
이 코드는 어떻게 작동합니까?
```

**또는 스킬 이름으로 직접 호출**하세요:

```text
/explain-code src/auth/login.ts
```

어떤 방식이든 Claude는 설명에 유추와 ASCII 다이어그램을 포함해야 합니다.

### 스킬이 있는 위치

스킬을 저장하는 위치는 누가 사용할 수 있는지 결정합니다:

| 위치 | 경로 | 적용 대상 |
| :--------- | :-------------------------------------------------- | :----------------------------- |
| 엔터프라이즈 | [관리되는 설정](/settings#settings-files) 참조 | 조직의 모든 사용자 |
| 개인 | `~/.claude/skills/<skill-name>/SKILL.md` | 모든 프로젝트 |
| 프로젝트 | `.claude/skills/<skill-name>/SKILL.md` | 이 프로젝트만 |
| 플러그인 | `<plugin>/skills/<skill-name>/SKILL.md` | 플러그인이 활성화된 경우 |

스킬이 여러 수준에서 동일한 이름을 공유하는 경우, 우선 순위가 높은 위치가 승리합니다: 엔터프라이즈 > 개인 > 프로젝트. 플러그인 스킬은 `plugin-name:skill-name` 네임스페이스를 사용하므로 다른 수준과 충돌할 수 없습니다. `.claude/commands/`에 파일이 있는 경우에도 동일하게 작동하지만, 스킬과 명령이 동일한 이름을 공유하는 경우 스킬이 우선합니다.

#### 실시간 변경 감지

Claude Code는 파일 변경에 대해 스킬 디렉토리를 감시합니다. `~/.claude/skills/`, 프로젝트 `.claude/skills/`, 또는 `--add-dir` 디렉토리 내의 `.claude/skills/` 아래에 스킬을 추가, 편집 또는 제거하면 다시 시작할 필요 없이 현재 세션 내에서 적용됩니다. 세션 시작 시 존재하지 않았던 최상위 스킬 디렉토리를 생성하려면 새 디렉토리를 감시하려면 Claude Code를 다시 시작해야 합니다.

#### 중첩 디렉토리에서 자동 검색

하위 디렉토리의 파일로 작업할 때 Claude Code는 중첩된 `.claude/skills/` 디렉토리에서 스킬을 자동으로 검색합니다. 예를 들어, `packages/frontend/`의 파일을 편집하는 경우 Claude Code는 `packages/frontend/.claude/skills/`에서도 스킬을 찾습니다. 이는 패키지마다 자체 스킬을 가질 수 있는 모노리포 설정을 지원합니다.

각 스킬은 `SKILL.md`를 진입점으로 하는 디렉토리입니다:

```text
my-skill/
├── SKILL.md           # 주 지침 (필수)
├── template.md        # Claude가 채울 템플릿
├── examples/
│   └── sample.md      # 예상 형식을 보여주는 예시 출력
└── scripts/
    └── validate.sh    # Claude가 실행할 수 있는 스크립트
```

`SKILL.md`는 주요 지침을 포함하며 필수입니다. 다른 파일은 선택 사항이며 더 강력한 스킬을 구축할 수 있게 합니다: Claude가 채울 템플릿, 예상 형식을 보여주는 예시 출력, Claude가 실행할 수 있는 스크립트, 또는 상세한 참조 문서. Claude가 해당 내용과 로드 시기를 알 수 있도록 `SKILL.md`에서 이러한 파일을 참조하세요. 자세한 내용은 [지원 파일 추가](#add-supporting-files)를 참조하세요.

참고(Note) 태그는 번역에서 제거되었습니다.

`.claude/commands/`의 파일은 여전히 작동하며 동일한 [frontmatter](#frontmatter-reference)를 지원합니다. 스킬은 지원 파일과 같은 추가 기능을 지원하므로 권장됩니다.

#### 추가 디렉토리의 스킬

`--add-dir` 플래그는 구성 검색이 아닌 [파일 접근 권한을 부여](/permissions#additional-directories-grant-file-access-not-configuration)하지만, 스킬은 예외입니다: 추가된 디렉토리 내의 `.claude/skills/`는 자동으로 로드됩니다. 세션 중에 변경 사항이 어떻게 반영되는지 [실시간 변경 감지](#live-change-detection)를 참조하세요.

서브에이전트, 명령 및 출력 스타일과 같은 다른 `.claude/` 구성은 추가 디렉토리에서 로드되지 않습니다. 로드되는 것과 로드되지 않는 것에 대한 전체 목록과 프로젝트 간 구성을 공유하는 권장 방법을 보려면 [예외 표](/permissions#additional-directories-grant-file-access-not-configuration)를 참조하세요.

참고(Note) 태그는 번역에서 제거되었습니다.

`--add-dir` 디렉토리의 CLAUDE.md 파일은 기본적으로 로드되지 않습니다. 로드하려면 `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`을 설정하세요. [추가 디렉토리에서 로드](/memory#load-from-additional-directories)를 참조하세요.

## 스킬 구성

스킬은 `SKILL.md` 상단의 `---` 마커 사이의 YAML frontmatter와 그 뒤에 오는 마크다운 콘텐츠를 통해 구성됩니다.

### 스킬 콘텐츠 유형

스킬 파일에는 어떤 지침이든 포함될 수 있지만, 스킬을 어떻게 호출할지 생각하는 것이 무엇을 포함할지 결정하는 데 도움이 됩니다:

**참조 콘텐츠**는 Claude가 현재 작업에 적용하는 지식을 추가합니다. 규칙, 패턴, 스타일 가이드, 도메인 지식. 이 콘텐츠는 Claude가 대화 컨텍스트와 함께 사용할 수 있도록 인라인으로 실행됩니다.

```yaml  theme={null}
name: api-conventions
description: 이 코드베이스에 대한 API 설계 패턴

API 엔드포인트를 작성할 때:
- RESTful 명명 규칙 사용
- 일관된 오류 형식 반환
- 요청 유효성 검사 포함
```

**작업 콘텐츠**는 배포, 커밋 또는 코드 생성과 같은 특정 작업에 대한 단계별 지침을 Claude에게 제공합니다. 이들은 Claude가 언제 실행할지 결정하도록 하는 대신 `/skill-name`으로 직접 호출하고 싶은 경우가 많습니다. Claude가 자동으로 트리거하는 것을 방지하려면 `disable-model-invocation: true`를 추가하세요.

```yaml  theme={null}
name: deploy
description: 애플리케이션을 프로덕션에 배포합니다.
context: fork
disable-model-invocation: true

애플리케이션 배포:
1. 테스트 스위트 실행
2. 애플리케이션 빌드
3. 배포 대상에 푸시
```

`SKILL.md`에는 무엇이든 포함될 수 있지만, 스킬이 어떻게 호출되기를 원하는지(사용자에 의해, Claude에 의해, 또는 둘 다)와 어디에서 실행되기를 원하는지(인라인 또는 서브에이전트에서)를 생각하는 것이 무엇을 포함할지 결정하는 데 도움이 됩니다. 복잡한 스킬의 경우, 주요 스킬에 집중하기 위해 [지원 파일](#add-supporting-files)을 추가할 수도 있습니다.

### Frontmatter 참조

마크다운 콘텐츠 외에도 `SKILL.md` 파일 상단의 `---` 마커 사이의 YAML frontmatter 필드를 사용하여 스킬 동작을 구성할 수 있습니다:

```yaml  theme={null}
name: my-skill
description: 이 스킬이 하는 일
disable-model-invocation: true
allowed-tools: Read Grep

여기에 스킬 지침...
```

모든 필드는 선택 사항입니다. Claude가 스킬을 언제
