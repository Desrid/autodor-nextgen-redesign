import type { Meta, StoryObj } from "@storybook/nextjs-vite";

type VariantRow = Readonly<{
  group: string;
  purpose: string;
  variants: string;
  recommendation: string;
}>;

const VARIANTS: readonly VariantRow[] = [
  {
    group: "Контентная карточка",
    purpose: "Один переход к подробному материалу",
    variants: "Сервисная / Лояльности / Новостная / Важная тема / Будущий проект",
    recommendation:
      "Выбирать по плотности информации, а не объединять в одну визуальную карточку.",
  },
  {
    group: "Статусная карточка",
    purpose: "Показать состояние дороги здесь и сейчас",
    variants: "RoadStatusRail / Контактная панель",
    recommendation:
      "RoadStatusRail — для нескольких коротких статусов; contact panel — для реквизитов и действий.",
  },
  {
    group: "Действие",
    purpose: "Перевести пользователя к следующему шагу",
    variants: "Текстовый CTA / Primary button / Контурная иконка / Плавающая кнопка",
    recommendation:
      "Text CTA — из карточки; primary — в диалоге; icon — локальная навигация; floating — глобальное действие.",
  },
  {
    group: "Выбор раздела",
    purpose: "Переключить контекст без ухода со страницы",
    variants: "ContactsTabs / HeaderNav megamenu / Стрелки rail",
    recommendation:
      "Tabs — равноправные панели; megamenu — маршрутизация; стрелки — последовательный набор карточек.",
  },
  {
    group: "Статистика",
    purpose: "Сопоставить проверенные данные",
    variants: "StatisticsBlock / RoadStatistics",
    recommendation:
      "Dashboard — общая картина; RoadStatistics — аналитика одной дороги.",
  },
];

function VariantMatrix() {
  return (
    <div style={{ overflowX: "auto", padding: "3rem var(--page-gutter)" }}>
      <table
        style={{
          width: "100%",
          minWidth: "58rem",
          borderCollapse: "collapse",
          background: "var(--color-surface)",
          color: "var(--color-text)",
        }}
      >
        <caption
          style={{
            paddingBottom: "1.5rem",
            fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
            fontWeight: 700,
            textAlign: "left",
          }}
        >
          Матрица визуальных вариантов
        </caption>
        <thead>
          <tr>
            {["Группа", "Смысл", "Визуальные варианты", "Правило выбора"].map(
              (heading) => (
                <th
                  key={heading}
                  scope="col"
                  style={{
                    borderBottom: "2px solid var(--color-brand-black)",
                    padding: "1rem",
                    textAlign: "left",
                  }}
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {VARIANTS.map((row) => (
            <tr key={row.group}>
              <th
                scope="row"
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  padding: "1rem",
                  textAlign: "left",
                  verticalAlign: "top",
                }}
              >
                {row.group}
              </th>
              <td
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  padding: "1rem",
                  verticalAlign: "top",
                }}
              >
                {row.purpose}
              </td>
              <td
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  padding: "1rem",
                  verticalAlign: "top",
                }}
              >
                {row.variants}
              </td>
              <td
                style={{
                  borderBottom: "1px solid var(--color-border)",
                  padding: "1rem",
                  verticalAlign: "top",
                }}
              >
                {row.recommendation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const meta = {
  title: "Каталог/Матрица выбора",
  component: VariantMatrix,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Таблица смысловых дублей с визуально разными реализациями. Выбор здесь определит будущую унификацию.",
      },
    },
  },
} satisfies Meta<typeof VariantMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Comparison: Story = {};
