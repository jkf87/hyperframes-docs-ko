# 글리치

> 디지털 글리치 아티팩트를 사용한 셰이더 트랜지션

디지털 글리치 아티팩트를 사용한 셰이더 트랜지션

`transition` `shader`

<video class="w-full aspect-video rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800" src="https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/glitch.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/glitch.png" autoplay muted loop playsinline />

## 설치

<CodeGroup>
  ```bash Terminal theme={null}
  npx hyperframes add glitch
  ```
</CodeGroup>

## 상세 정보

| 속성   | 값        |
| ------ | --------- |
| 타입   | Block     |
| 해상도 | 1920×1080 |
| 길이   | 4s        |

## 파일

| 파일          | 대상 경로                  | 타입                    |
| ------------- | -------------------------- | ----------------------- |
| `glitch.html` | `compositions/glitch.html` | hyperframes:composition |

## 사용법

설치 후, 호스트 컴포지션에 블록을 추가합니다:

```html theme={null}
<div data-composition-id="glitch" data-composition-src="compositions/glitch.html" data-start="0" data-duration="4" data-track-index="1" data-width="1920" data-height="1080"></div>
```
