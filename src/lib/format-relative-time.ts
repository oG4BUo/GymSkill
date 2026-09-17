/**
 * ISO 8601形式の日時文字列を、日本語の相対時刻表示に変換する。
 * 保存データは常にISO形式(new Date().toISOString())に統一し、画面表示の直前でこの関数を通す。
 *
 * 旧バージョンのlocalStorageに残っている「18分前」「たった今」のような非ISO文字列を渡された場合は、
 * Dateとして解析できないため、その文字列をそのまま返す(後方互換のフォールバック)。
 */
export function formatRelativeTime(value: string, now: Date = new Date()): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diffMinutes < 1) return "たった今";
  if (diffMinutes < 60) return `${diffMinutes}分前`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}時間前`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "昨日";
  if (diffDays < 7) return `${diffDays}日前`;

  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
