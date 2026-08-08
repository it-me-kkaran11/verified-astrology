/**
 * Mocked Astra reply engine.
 * Astra has exactly three jobs: log a prediction, explain trust scores,
 * and summarize the user's own verification record. Tone: warm, cosmic,
 * grounded in the verification record — never vague mysticism.
 */

export type AstraIntent = "log" | "trust" | "history" | "unknown";

export type AstraStats = {
  total: number;
  resolved: number;
  trueCount: number;
  falseCount: number;
  pending: number;
  accuracy: number;
  streak: number;
  topAstrologer?: { name: string; trust_score: number } | null;
};

const LOG_WORDS = ["log", "add", "record", "new prediction", "told me", "consultation", "reading"];
const TRUST_WORDS = ["trust score", "trustscore", "score mean", "what is trust", "how is trust", "ranking", "leaderboard"];
const HISTORY_WORDS = ["my history", "my record", "my accuracy", "how accurate", "how am i", "my predictions", "summary", "streak"];

export function detectIntent(text: string): AstraIntent {
  const t = text.toLowerCase();
  if (HISTORY_WORDS.some((w) => t.includes(w))) return "history";
  if (TRUST_WORDS.some((w) => t.includes(w))) return "trust";
  if (LOG_WORDS.some((w) => t.includes(w))) return "log";
  return "unknown";
}

export function trustExplainer(): string {
  return "A Trust Score is simply an astrologer's confirmed hit rate: verified predictions divided by total resolved predictions, times 100, rounded to one decimal. Nothing else moves it — not follower count, not how long they've practised, not money. Every point comes from a real person checking in and saying \"yes, that happened\" or \"no, it didn't\". So a 78.4 means roughly four out of five of their logged calls held up under scrutiny, and a score with only a handful of predictions behind it deserves less weight than the same score built on hundreds. That's why the total prediction count sits next to the badge on the leaderboard.";
}

export function historySummary(s: AstraStats): string {
  if (s.total === 0) {
    return "Your ledger is empty for now — nothing logged, nothing confirmed. That's a clean start, not a bad sign. Tell me about a prediction someone gave you in a reading and I'll log it with a check-in date, and your record begins there.";
  }
  if (s.resolved === 0) {
    return `You have ${s.total} prediction${s.total === 1 ? "" : "s"} on the books and none resolved yet, so there's no accuracy rate to quote honestly. Once the first check-in date passes, Home will ask you whether it happened — that answer is what starts building both your streak and the astrologer's Trust Score.`;
  }
  const top = s.topAstrologer
    ? ` Most of what you're tracking comes through ${s.topAstrologer.name}, currently sitting at a ${s.topAstrologer.trust_score} Trust Score publicly.`
    : "";
  const streak = s.streak > 0
    ? ` You're on a ${s.streak}-day check-in streak — that consistency is what makes the number mean anything.`
    : " Your streak is at zero right now; one honest check-in today restarts it.";
  return `Here's your record as it stands: ${s.total} predictions logged, ${s.resolved} resolved, ${s.trueCount} confirmed true and ${s.falseCount} marked false — a ${s.accuracy}% confirmation rate.${s.pending > 0 ? ` ${s.pending} are still open and waiting on their check-in date.` : ""}${top}${streak}`;
}

export function logIntro(): string {
  return "Good — let's get it on the record before the details blur. Fill in what you were told, who told you, and the date by which it should have happened. I'll write it straight into your predictions ledger as pending, and Home will ask you to confirm it when that date passes.";
}

export function logConfirmation(text: string, astrologer: string, dueAt: string): string {
  const when = new Date(dueAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `Logged: "${text}" — attributed to ${astrologer}, check-in due ${when}. It's pending until you tell me what actually happened, and your yes or no will move their Trust Score either way. That's the whole point: the claim exists in writing before the outcome does.`;
}

export function fallback(): string {
  return "I'll stay in my lane here — I'm built for three things rather than general horoscopes. I can log a prediction you were given in a consultation elsewhere, explain exactly what an astrologer's Trust Score is measuring, or walk you through your own record and confirmation rate. Which of those do you want?";
}

export const ASTRA_GREETING =
  "I'm Astra. I keep the receipts rather than the mystique. Bring me a prediction from a reading and I'll log it with a check-in date, ask me what a Trust Score actually measures, or ask me how your own record is holding up.";

export const QUICK_PROMPTS = [
  "Log a prediction I was given",
  "What does a trust score mean?",
  "Summarize my prediction history",
] as const;
