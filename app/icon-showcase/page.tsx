import { ACTION_ICONS, Icon, type IconName } from "@/app/components/icons";

import styles from "./page.module.css";

const sizes = [16, 20, 24] as const;
const iconNames = Object.keys(ACTION_ICONS) as IconName[];

export default function IconShowcasePage() {
  return (
    <main className={styles.page} data-testid="icon-showcase">
      <header className={styles.header}>
        <p className={styles.eyebrow}>UI icon quality lab</p>
        <h1>Inline SVG icons</h1>
        <p>
          Контроль 24×24 outline-набора на светлом и тёмном фоне, в рабочих размерах и
          типичных интерфейсных контекстах.
        </p>
      </header>

      <section className={styles.grid} aria-label="Каталог outline-иконок">
        {iconNames.map((name) => {
          const definition = ACTION_ICONS[name as keyof typeof ACTION_ICONS];

          return (
            <article className={styles.card} data-icon-name={name} key={name}>
              <div className={styles.cardHeader}>
                <div>
                  <h2>{definition.label}</h2>
                  <code>{name}</code>
                </div>
                <button
                  aria-label={`Действие: ${definition.label}`}
                  className={styles.iconButton}
                  type="button"
                >
                  <Icon name={name} size={20} />
                </button>
              </div>

              <div className={styles.backgrounds}>
                <div className={styles.lightSample}>
                  <Icon name={name} size={24} />
                </div>
                <div className={styles.darkSample}>
                  <Icon name={name} size={24} />
                </div>
              </div>

              <div className={styles.sizes} aria-label="Размеры 16, 20 и 24 пикселя">
                {sizes.map((size) => (
                  <div data-icon-size={size} key={size}>
                    <Icon name={name} size={size} />
                    <span>{size}px</span>
                  </div>
                ))}
              </div>

              <p className={styles.inlineSample}>
                <Icon name={name} size={16} />
                <span>Иконка рядом с текстом</span>
              </p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
