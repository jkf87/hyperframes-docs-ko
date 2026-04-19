# YouTube Lower Third

> 아바타와 채널 정보가 포함된 애니메이션 YouTube 구독 하단 자막

# YouTube Lower Third

아바타와 채널 정보가 포함된 애니메이션 YouTube 구독 하단 자막

`social` `overlay` `youtube`

<video class="w-full aspect-video rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800" src="https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/yt-lower-third.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/yt-lower-third.png" autoplay muted loop playsinline />

## 설치

<CodeGroup>
  ```bash Terminal theme={null}
  npx hyperframes add yt-lower-third
  ```
</CodeGroup>

## 상세 정보

| 속성   | 값        |
| ------ | --------- |
| 타입   | Block     |
| 크기   | 1920×1080 |
| 길이   | 4.5s      |

## 파일

| 파일                  | 대상 경로                          | 타입                    |
| --------------------- | ---------------------------------- | ----------------------- |
| `yt-lower-third.html` | `compositions/yt-lower-third.html` | hyperframes:composition |
| `assets/avatar.jpg`   | `assets/avatar.jpg`                | hyperframes:asset       |

## 사용법

설치 후 호스트 컴포지션에 블록을 추가합니다:

```html theme={null}
<div data-composition-id="yt-lower-third" data-composition-src="compositions/yt-lower-third.html" data-start="0" data-duration="4.5" data-track-index="1" data-width="1920" data-height="1080"></div>
```
