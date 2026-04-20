import { defineConfig } from 'vitepress'
import { generatedNav, generatedSidebar } from './generated-nav'

export default defineConfig({
  title: 'HyperFrames 한국어 문서',
  description: 'HeyGen HyperFrames 공식 문서 한국어 번역',
  lang: 'ko-KR',
  base: '/hyperframes-docs-ko/',
  cleanUrls: false,
  ignoreDeadLinks: true,
  head: [
    ['meta', { name: 'author', content: 'jkf87' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
  ],
  themeConfig: {
    nav: generatedNav,
    sidebar: generatedSidebar,
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jkf87/hyperframes-docs-ko' },
    ],
    outline: { label: '목차', level: [2, 3] },
    lastUpdated: { text: '마지막 수정' },
    docFooter: { prev: '이전', next: '다음' },
    returnToTopLabel: '맨 위로',
  },
})
