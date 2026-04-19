## 첫 번째 영상 만들기 (계속)

3. **컴포지션 편집하기**

   - AI 코딩 에이전트로 프로젝트를 열어 작업할 수 있습니다.
   - 또는 `index.html`을 직접 편집해도 됩니다. 최소 구성 예시는 다음과 같습니다:

   ```html
   <div id="root" data-composition-id="my-video"
        data-start="0" data-width="1920" data-height="1080">

     <!-- 1. 트랙 0에 타이밍이 지정된 텍스트 클립 정의 -->
     <h1 id="title" class="clip"
         data-start="0" data-duration="5" data-track-index="0"
         style="font-size: 72px; color: white; text-align: center;
                position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%);">
       Hello, Hyperframes!
     </h1>

     <!-- 2. 애니메이션을 위해 GSAP 로드 -->
     <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>

     <!-- 3. 일시정지 상태의 타임라인 생성 후 등록 -->
     <script>
       const tl = gsap.timeline({ paused: true });
       tl.from("#title", { opacity: 0, y: -50, duration: 1 }, 0);
       window.__timelines = window.__timelines || {};
       window.__timelines["my-video"] = tl;
     </script>
   </div>
   ```

   - 기억해야 할 세 가지 규칙:
     - 루트 요소에는 반드시 `data-composition-id`, `data-width`, `data-height` 속성이 있어야 합니다.
     - 타이밍이 지정된 요소에는 `data-start`, `data-duration`, `data-track-index` 속성과 `class="clip"`이 필요합니다.
     - GSAP 타임라인은 반드시 `{ paused: true }` 옵션으로 생성하고, `window.__timelines`에 등록해야 합니다.

4. **MP4로 렌더링하기**

   ```bash
   npx hyperframes render --output output.mp4
   ```

   - 예상 출력:

   ```bash
   ✔ Capturing frames... 150/150
   ✔ Encoding MP4...
   ✔ output.mp4 (1920x1080, 5.0s, 30fps)
   ```

   - 렌더링이 완료되면 `output.mp4` 파일에 영상이 생성됩니다.

## 요구 사항 요약

| 의존성 | 필수 여부 | 비고 |
| --- | --- | --- |
| **Node.js** 22+ | 예 | CLI 및 개발 서버 실행 환경 |
| **npm** 또는 bun | 예 | 패키지 매니저 |
| **FFmpeg** | 예 | 로컬 렌더링 시 영상 인코딩에 사용 |
| **Docker** | 아니오 | 선택 사항, 결정적이고 재현 가능한 렌더링을 위해 사용 |

## 다음 단계

- 카탈로그 둘러보기: 50개 이상의 바로 사용 가능한 블록, 전환 효과, 오버레이, 데이터 시각화, 이펙트 제공
- GSAP 애니메이션: 페이드, 슬라이드, 스케일 및 커스텀 애니메이션 추가
- 예제: Warm Grain, Swiss Grid 등 내장 예제로 시작하기
- 렌더링: 품질 프리셋, Docker 모드, GPU 인코딩 등 렌더링 옵션 살펴보기
