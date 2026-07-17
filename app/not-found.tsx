import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found" tabIndex={-1}>
      <p>Страница не найдена</p>
      <h1>Такого адреса нет</h1>
      <p>Проверьте ссылку или вернитесь к сервисам Государственной компании.</p>
      <Link href="/">На главную</Link>
    </main>
  );
}
