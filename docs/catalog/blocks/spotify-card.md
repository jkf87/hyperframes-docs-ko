# Spotify 지금 재생 중

> 앨범 아트와 프로그레스 바가 있는 애니메이션 Spotify 재생 중 카드

앨범 아트와 프로그레스 바가 있는 애니메이션 Spotify 재생 중 카드

`social` `overlay` `spotify`

<video class="w-full aspect-video rounded-xl object-cover bg-zinc-100 dark:bg-zinc-800" src="https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/spotify-card.mp4" poster="https://static.heygen.ai/hyperframes-oss/docs/images/catalog/blocks/spotify-card.png" autoplay muted loop playsinline />

## 설치

<CodeGroup>
  ```bash Terminal theme={null}
  npx hyperframes add spotify-card
  ```
</CodeGroup>

## 상세 정보

| 속성   | 값        |
| ------ | --------- |
| 타입   | Block     |
| 크기   | 1080×1920 |
| 재생 시간 | 5s     |

## 파일

| 파일                | 대상 경로                        | 타입                    |
| ------------------- | -------------------------------- | ----------------------- |
| `spotify-card.html` | `compositions/spotify-card.html` | hyperframes:composition |

## 사용법

설치 후, 호스트 컴포지션에 블록을 추가하세요:

```html theme={null}
<div data-composition-id="spotify-card" data-composition-src="compositions/spotify-card.html" data-start="0" data-duration="5" data-track-index="1" data-width="1080" data-height="1920"></div>
```
