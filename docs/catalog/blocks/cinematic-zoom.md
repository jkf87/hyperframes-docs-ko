# 시네마틱 줌

> 극적인 줌 블러가 적용된 셰이더 전환 효과

# Cinematic Zoom

극적인 줌 블러가 적용된 셰이더 전환 효과

`transition` `shader`

<video class="w-full aspect-video rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800" src="https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/cinematic-zoom.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/cinematic-zoom.png" autoplay muted loop playsinline />

## 설치

<CodeGroup>
  ```bash Terminal theme={null}
  npx hyperframes add cinematic-zoom
  ```
</CodeGroup>

## 세부 정보

| 속성   | 값        |
| ------ | --------- |
| 타입   | Block     |
| 해상도 | 1920×1080 |
| 길이   | 4s        |

## 파일

| 파일                  | 대상 경로                          | 타입                    |
| --------------------- | ---------------------------------- | ----------------------- |
| `cinematic-zoom.html` | `compositions/cinematic-zoom.html` | hyperframes:composition |

## 사용법

설치 후 호스트 컴포지션에 블록을 추가하세요:

```html theme={null}
<div data-composition-id="cinematic-zoom" data-composition-src="compositions/cinematic-zoom.html" data-start="0" data-duration="4" data-track-index="1" data-width="1920" data-height="1080"></div>
```
