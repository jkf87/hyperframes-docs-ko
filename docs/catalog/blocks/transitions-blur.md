# 블러 전환

> 장면 간 블러 기반 트랜지션 쇼케이스

# Blur Transitions

장면 간 블러 기반 트랜지션 쇼케이스

`transition` `showcase`

<video class="w-full aspect-video rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800" src="https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/transitions-blur.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/transitions-blur.png" autoplay muted loop playsinline />

## 설치

<CodeGroup>
  ```bash Terminal theme={null}
  npx hyperframes add transitions-blur
  ```
</CodeGroup>

## 상세 정보

| 속성   | 값        |
| ------ | --------- |
| 유형   | Block     |
| 해상도 | 1920×1080 |
| 길이   | 20s       |

## 파일

| 파일                    | 대상 경로                            | 유형                    |
| ----------------------- | ------------------------------------ | ----------------------- |
| `transitions-blur.html` | `compositions/transitions-blur.html` | hyperframes:composition |

## 사용법

설치 후, 호스트 컴포지션에 블록을 추가합니다:

```html theme={null}
<div data-composition-id="transitions-blur" data-composition-src="compositions/transitions-blur.html" data-start="0" data-duration="20" data-track-index="1" data-width="1920" data-height="1080"></div>
```
