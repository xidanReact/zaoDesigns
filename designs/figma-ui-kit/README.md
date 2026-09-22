# СНК · UI kit для Figma

Локальный плагин собирает UI kit главной страницы прямо в файле Figma. Значения совпадают с `designs/styles.css`.

Файл Figma: https://www.figma.com/design/Ls3wwl2A8lwXT94ijPboSx
(в нём уже лежит снимок главной страницы, 1440 px)

## Запуск (один раз, нужен десктопный Figma)

1. Откройте файл выше в приложении Figma для компьютера.
2. Меню **Plugins → Development → Import plugin from manifest…** и выберите `designs/figma-ui-kit/manifest.json`.
3. **Plugins → Development → СНК · UI kit builder** — сборка идёт 10–30 секунд.
4. Внизу появится сообщение «UI kit собран». Если были замечания, их список будет на странице **Cover**.

Повторный запуск в том же файле ничего не сломает: плагин увидит коллекции «СНК / …» и остановится.

## Что создаётся

**Переменные**
- `СНК / Primitives`: 12 цветов палитры. Они скрыты от публикации.
- `СНК / Color` (режим Light): семантика `bg`, `surface`, `text`, `accent`, `border`, `blueprint`, `watermark`. Это алиасы на Primitives, с кодом `var(--…)` из CSS.
- `СНК / Spacing` и `СНК / Radius`: `sm` 8, `md` 12, `lg` 20, `full`.

**Стили**
- 21 текстовый стиль: Manrope 500–800 и JetBrains Mono. Размеры и трекинг взяты с сайта.
- 2 мягкие тени.

**Страницы**
- **Cover**
- **Главная · 1440** — снимок сайта
- **Foundations** — цвета, типографика, отступы, радиусы, тени
- **Components**

**Компоненты**

| Компонент | Варианты и свойства |
| --- | --- |
| Icons, Logo | 11 иконок и монограмма СНК (красная) |
| Button | Style (Primary, Outline, Ghost) × Size (M, L) × State (Default, Hover, Focus, Disabled). Свойства: Label, Show icon, Icon |
| Tag, Eyebrow, Spec chip | — |
| Nav item | State × Dropdown |
| Dropdown item, Dropdown menu | — |
| Input | Empty, Focus, Filled, Error |
| Checkbox | Unchecked, Checked, Error |
| Metric | — |
| Direction card | Default, Hover |
| News card | — |
| Header | — |

Все заливки, обводки, отступы и радиусы привязаны к переменным.

Если в Figma нет шрифтов Manrope или JetBrains Mono, плагин подставит Inter и перечислит замены на странице Cover.
