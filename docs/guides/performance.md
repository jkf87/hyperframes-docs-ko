# 성능

> 미리보기 재생을 원활하게 유지하고 무거운 컴포지션을 진단하는 방법.

미리보기는 컴포지션을 실시간으로 재생하므로, 33ms(30fps 기준)보다 오래 걸리는 프레임은 끊김으로 나타납니다. 이 페이지에서는 프레임 예산을 초과하는 패턴과 이를 발견하는 방법을 다룹니다.

## 미리보기 vs. 렌더링

렌더링은 프레임을 하나씩 캡처하여 영상으로 합칩니다. 느린 프레임이 있으면 렌더링 시간이 길어지지만, 일시 정지가 보이지는 않습니다 — 완성된 mp4를 감상하면 됩니다.

미리보기는 같은 작업을 실시간으로 수행합니다. 프레임 하나를 그리는 데 200ms가 걸리면, 200ms의 정지가 그대로 보입니다.

그래서 "렌더링은 잘 나오는데 미리보기가 끊긴다"는 것은 페인팅이 무거운 컴포지션에서 예상되는 동작입니다. 미리보기가 고장 난 것이 아니라, 개별 프레임이 실시간 재생에 비해 너무 무거운 것입니다.

## 무거운 CSS 패턴

미리보기가 30fps 아래로 떨어지는 가장 흔한 원인이 되는 패턴들입니다.

### backdrop-filter: blur()

큰 영역에 적용된 `backdrop-filter: blur(radius)`는 컴포지터가 요소 뒤의 픽셀을 읽어 블러 커널을 실행하고 결과를 합성하도록 강제합니다. 비용은 블러 영역과 반경에 비례하여 증가합니다.

블러 레이어를 겹치면 비용이 곱절로 늘어납니다. 점진적으로 커지는 반경(1, 2, 4, 8, 16, 32, 64, 128px)을 가진 8개 레이어는 중급 GPU에서 1920x1080 영역 기준 프레임당 200ms를 쉽게 소비합니다.

**대처 방법:**

* 레이어 중첩은 최대 2-3개로 제한하고 반경은 수동으로 조정
* 넓은 영역에 `blur(128px)` 또는 `blur(64px)` 사용 자제 — 가장 큰 반경이 비용의 대부분을 차지
* 정적 블러의 경우 한 번만 PNG로 렌더링한 후 일반 `&lt;img&gt;` 오버레이로 사용

### filter: blur() 및 filter: drop-shadow()

`backdrop-filter`와 같은 원리지만, 요소 뒤가 아닌 요소 자체에 적용됩니다. 작은 요소에서는 문제없지만 큰 요소에서는 비용이 높습니다.

### 다수 요소의 그림자

소수의 요소에 `box-shadow`와 `text-shadow`를 사용하는 것은 괜찮습니다. 그러나 애니메이션도 적용된 수십 개의 요소에 사용하면, 컴포지터가 매 프레임마다 그림자가 있는 각 레이어를 다시 래스터화합니다.

### mask-image가 적용된 큰 그라디언트

`backdrop-filter`와 결합된 `mask-image`는 추가 컴포지터 패스를 강제할 수 있습니다. 같은 요소에 둘 다 있다면 둘 다 필요한지 검토하세요.

## 이미지 크기

이미지 소스 해상도가 파일 크기보다 중요합니다. Chrome은 JPEG와 PNG를 표시하기 전에 원시 RGBA 비트맵으로 디코딩합니다 — 디코딩된 비트맵 크기는 다음과 같습니다:

```
bitmap_bytes = width × height × 4
```

7000×5000 소스 이미지는 디스크상의 JPEG가 2MB이든 5MB이든 관계없이 디코딩 시 140MB입니다.

**경험 법칙:** 소스 이미지를 캔버스 크기의 최대 2배로 리사이즈하세요. 1920x1080 캔버스의 경우 3840x2160 소스 이미지면 이미 과잉입니다. 그 이상은 화면에 표시되지 않는 메모리와 텍스처 업로드 비용을 지불하는 것입니다.

```bash Terminal theme={null}
# ImageMagick을 사용하여 디렉토리 내 이미지를 일괄 축소
mogrify -path resized -resize 3840x3840\> *.jpg
```

## 느린 컴포지션 측정하기

추측하지 말고 측정하세요. Chrome DevTools에 필요한 모든 것이 있습니다.

<Steps>
  <Step title="미리보기 실행">
    미리보기 서버를 시작하고 Chrome에서 엽니다:

    ```bash Terminal theme={null}
    npx hyperframes preview
    ```
  </Step>

  <Step title="DevTools → Performance 열기">
    `Cmd+Option+I` (macOS) 또는 `Ctrl+Shift+I` (Linux/Windows)를 누른 후 **Performance** 탭으로 전환합니다.
  </Step>

  <Step title="재생 중 녹화">
    녹화 버튼을 누르고, 미리보기에서 재생을 클릭한 후, 끊김이 발생하는 장면을 3-5초 동안 실행시킨 다음 녹화를 중지합니다.
  </Step>

  <Step title="메인 스레드 트랙 분석">
    긴 작업(타임라인에서 빨간색으로 표시)을 찾습니다. 가장 높은 막대를 펼쳐서 Chrome이 어떤 레이블을 붙였는지 확인합니다:

    * **Composite Layers / Paint** 시간이 긴 경우 = 컴포지터 비용 (backdrop-filter, 그림자, 큰 텍스처)
    * **Decode Image** = 첫 페인트 시 이미지 디코딩 (Chrome 131+ 이후 드물며, 기본적으로 이미지는 별도 스레드에서 디코딩)
    * **Layout / Recalculate Style** = 스크립트에 의한 레이아웃 스래싱
    * **Script** = JS 작업 (컴포지션에서는 드물며, 작성자 스크립트를 확인)
  </Step>
</Steps>

어떤 카테고리가 지배적인지 알면 무엇을 변경해야 하는지 알 수 있습니다.

<Tip>
  단독으로 60fps로 실행되는 컴포지션이 특정 장면에서만 끊긴다면, 보통 컴포짓 비용 문제입니다. 해당 장면에서 어떤 레이어가 표시되는지 확인하세요.
</Tip>

## 미리보기가 불가피하게 느린 경우

일부 컴포지션은 실시간 재생에 정당하게 너무 무겁습니다. 가능한 것을 줄였는데도 미리보기가 끊긴다면, mp4로 렌더링하여 출력을 확인하는 워크플로가 적합합니다 — 렌더링은 여전히 정확합니다.

```bash Terminal theme={null}
npx hyperframes render --quality draft --output preview.mp4
```

드래프트 품질은 빠르게 렌더링되며, 인코더 수준의 세부 사항을 제외하면 최종 렌더링과 시각적으로 거의 동일합니다.

## 다음 단계

<CardGroup cols={2}>
  <Card title="문제 해결" icon="wrench" href="/guides/troubleshooting">
    환경, 도구 및 렌더링 문제
  </Card>

  <Card title="흔한 실수" icon="triangle-exclamation" href="/guides/common-mistakes">
    렌더링을 깨뜨리는 컴포지션 함정
  </Card>

  <Card title="렌더링" icon="film" href="/guides/rendering">
    렌더링 모드, 옵션 및 플래그
  </Card>

  <Card title="CLI 레퍼런스" icon="terminal" href="/packages/cli">
    CLI 명령어 전체 목록
  </Card>
</CardGroup>
