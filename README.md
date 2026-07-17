# Autodor Next-Generation Homepage

Изолированный редизайн главной страницы Государственной компании «Автодор». Репозиторий создан с нуля и не использует код, компоненты или ассеты прежних концепций. Работа ведётся только в `Desrid/autodor-nextgen-redesign`; merge в `main` запрещён до независимого green verdict.

## Scope

Главная собрана в точном порядке итогового Figma-прототипа `1767:6575`: хедер, сеть дорог, сервисы, программа лояльности, новости, важная информация, медиагалерея, контакты, статистика, услуги дочерних обществ, социальные обязательства, будущие проекты и подвал. Hidden-блок документов не выводится отдельной секцией, но доступен из меню. Плавающие чат и возврат наверх находятся вне потока секций.

Приоритет источников:

1. Figma — структура, подписи, порядок и видимость;
2. Google Sheets — функциональный состав 17 требований;
3. утверждённый брендбук — айдентика;
4. действующий сайт — факты, контакты, ссылки и юридические тексты.

Не подтверждённые цифры и названия не публикуются. Для статистики и будущих проектов показаны честные source-gated состояния; причины зафиксированы в `docs/open-questions.md` и матрице трассируемости.

## Stack

- Next.js App Router 16, React 19, TypeScript strict;
- Server Components по умолчанию, клиентские листья только для меню, hero, tabs и плавающих утилит;
- CSS custom properties и адаптивный CSS без runtime-зависимости от Tailwind;
- Vitest, Testing Library, Playwright, axe-core, ESLint и Prettier;
- HTML/CSS fallbacks вместо блокирующего WebGL; MapLibre и GSAP намеренно не добавлены без подтверждённой геометрии и motion-необходимости.

Архитектурные решения и лицензии находятся в `docs/architecture/`.

## Local setup

Требуются Node.js 24 и npm 11.

```bash
npm install
npm run dev
```

Production-проверка:

```bash
npm run format
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

E2E использует `http://127.0.0.1:3000` или значение `PLAYWRIGHT_BASE_URL`:

```bash
npm run test:e2e
npm run test:e2e:update
```

Viewport matrix: `1920`, `1440`, `1024`, `768`, `390`, `375`, `320`, а также отдельный `390` reduced-motion project.

## Preview states

- `/` и `/?car=off` — hero без машинки-поинтера;
- `/?car=on` — статичная машинка-поинтер, не перекрывающая контент;
- reduced motion и Save-Data отключают загрузку video sources, сохраняя poster и весь смысловой контент;
- без JavaScript остаются заголовки, факты, ссылки, список девяти дорог и статические fallback-состояния карты.

## Media pipeline

Синтетические изображения являются атмосферными, а не документальными изображениями конкретных дорог. Происхождение, права, prompts, размеры, crops, alt-тексты и SHA-256 записаны в `docs/assets/asset-registry.md`.

Воспроизводимые команды:

```bash
node .tools/optimize-media.mjs
node .tools/prepare-video-sources.mjs
node .tools/create-road-loops.mjs <ffmpeg>
node .tools/transcode-road-mp4.mjs <full-ffmpeg>
```

Hero использует source order WebM → MP4, `muted`, `playsInline`, `poster`, pause control и lazy capability gate. Encoder binaries не входят в репозиторий.

## Evidence and release gate

- source audits: `docs/source-audit/`;
- 17 требований: `docs/requirements/traceability-matrix.md`;
- дизайн и motion: `docs/design/`;
- ассеты и лицензии: `docs/assets/asset-registry.md`;
- QA, accessibility и performance: `docs/qa/`;
- visual baselines: `e2e/visual.spec.ts-snapshots/`.

CI и локальные проверки не выполняют push, merge или deployment. Release возможен только после зелёных build/tests, проверенного responsive, отсутствия broken links/console errors и независимого решения валидатора в `docs/qa/final-validation.md`.
