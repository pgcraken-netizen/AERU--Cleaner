"use client";

import { useState } from "react";

type Step = 1 | 2 | 3 | 4 | 5;

const periods = [
  { label: "3か月前より古い投稿", days: 90, size: "約 125 MB", posts: "526件" },
  { label: "6か月前より古い投稿", days: 180, size: "約 287 MB", posts: "1,284件" },
  { label: "1年前より古い投稿", days: 365, size: "約 410 MB", posts: "1,967件" },
];

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [period, setPeriod] = useState(180);
  const [mode, setMode] = useState<"safe" | "standard">("standard");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const selected = periods.find((p) => p.days === period) ?? periods[1];

  const startCleanup = () => {
    setRunning(true);
    setStep(5);
    setProgress(0);

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setRunning(false);
          setCompleted(true);
          return 100;
        }
        return p + 5;
      });
    }, 180);
  };

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-[#3e3a35]">
      <div className="mx-auto min-h-screen max-w-5xl px-5 py-8 sm:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-[0.25em] text-[#8c7860]">
              AERU
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Cleaner
            </h1>
          </div>

          <div className="rounded-full border border-[#ded5c8] bg-white/70 px-4 py-2 text-xs text-[#756c63]">
            SAFE &amp; SIMPLE
          </div>
        </header>

        <div className="mb-8">
          <div className="flex justify-between text-xs text-[#8b8177]">
            <span>STEP {step}</span>
            <span>{step}/5</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e5ddd2]">
            <div
              className="h-full rounded-full bg-[#b78d62] transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <section className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-[#e4dbcf] bg-white p-7 shadow-sm sm:p-10">
              <p className="mb-3 text-sm font-semibold text-[#a17c58]">
                Misskey × Google Drive
              </p>

              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                大切な投稿を残して、
                <br />
                Driveを軽くする。
              </h2>

              <p className="mt-5 leading-7 text-[#756d65]">
                古いMisskey投稿の画像や動画をGoogle Driveへアーカイブ。
                保存を確認してから、Misskey Driveの容量を整理します。
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f8f5ef] p-5">
                  <div className="text-xs text-[#988e84]">MISSKEY</div>
                  <div className="mt-2 font-semibold">@aeru</div>
                  <div className="mt-1 text-sm text-[#9b9187]">
                    アカウントを接続
                  </div>
                </div>

                <div className="rounded-2xl bg-[#f8f5ef] p-5">
                  <div className="text-xs text-[#988e84]">GOOGLE DRIVE</div>
                  <div className="mt-2 font-semibold">Google Account</div>
                  <div className="mt-1 text-sm text-[#9b9187]">
                    保存先を接続
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-8 w-full rounded-2xl bg-[#4e4943] px-6 py-4 font-semibold text-white transition hover:bg-[#3d3934]"
              >
                アカウントを接続する
              </button>

              <p className="mt-4 text-center text-xs text-[#9a9188]">
                パスワードはAERU Cleanerに保存しません
              </p>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-[#e4dbcf] bg-white p-7 shadow-sm sm:p-10">
              <p className="text-sm font-semibold text-[#a17c58]">
                STEP 2
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                接続を確認してください
              </h2>

              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-[#f8f5ef] p-5">
                  <div>
                    <div className="text-xs text-[#988e84]">MISSKEY</div>
                    <div className="mt-1 font-semibold">@aeru</div>
                  </div>
                  <span className="text-sm font-semibold text-[#66815e]">
                    ✓ 接続済み
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[#f8f5ef] p-5">
                  <div>
                    <div className="text-xs text-[#988e84]">GOOGLE DRIVE</div>
                    <div className="mt-1 font-semibold">
                      Google Account
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#66815e]">
                    ✓ 接続済み
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#e7ded2] p-5">
                <div className="text-xs text-[#988e84]">
                  現在のMisskey Drive容量
                </div>
                <div className="mt-2 text-3xl font-bold">
                  500 <span className="text-base font-normal">MB / 800 MB</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eee7dd]">
                  <div className="h-full w-[62.5%] rounded-full bg-[#b78d62]" />
                </div>
                <div className="mt-2 text-right text-xs text-[#988e84]">
                  残り 300 MB
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="mt-8 w-full rounded-2xl bg-[#4e4943] px-6 py-4 font-semibold text-white"
              >
                このアカウントで続ける
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-[#e4dbcf] bg-white p-7 shadow-sm sm:p-10">
              <p className="text-sm font-semibold text-[#a17c58]">
                STEP 3
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                どこまで整理しますか？
              </h2>
              <p className="mt-3 text-[#756d65]">
                古い投稿を選ぶと、削減できる容量の目安を表示します。
              </p>

              <div className="mt-7 space-y-3">
                {periods.map((p) => (
                  <button
                    key={p.days}
                    onClick={() => setPeriod(p.days)}
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      period === p.days
                        ? "border-[#b78d62] bg-[#faf5ed]"
                        : "border-[#e5ddd3] bg-white hover:bg-[#faf8f4]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{p.label}</div>
                        <div className="mt-1 text-sm text-[#948a81]">
                          {p.posts}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{p.size}</div>
                        <div className="text-xs text-[#948a81]">
                          解放見込み
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-7 rounded-2xl bg-[#f8f5ef] p-5">
                <div className="text-xs text-[#988e84]">
                  おすすめモード
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setMode("safe")}
                    className={`rounded-xl border p-4 text-left ${
                      mode === "safe"
                        ? "border-[#b78d62] bg-white"
                        : "border-transparent"
                    }`}
                  >
                    <div className="font-semibold">SAFE MODE</div>
                    <div className="mt-1 text-xs text-[#948a81]">
                      アーカイブのみ
                    </div>
                  </button>

                  <button
                    onClick={() => setMode("standard")}
                    className={`rounded-xl border p-4 text-left ${
                      mode === "standard"
                        ? "border-[#b78d62] bg-white"
                        : "border-transparent"
                    }`}
                  >
                    <div className="font-semibold">STANDARD</div>
                    <div className="mt-1 text-xs text-[#948a81]">
                      保存 → 検証 → 削除
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(4)}
                className="mt-8 w-full rounded-2xl bg-[#4e4943] px-6 py-4 font-semibold text-white"
              >
                この条件で確認する
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-[#e4dbcf] bg-white p-7 shadow-sm sm:p-10">
              <p className="text-sm font-semibold text-[#a17c58]">
                STEP 4
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                アーカイブ内容を確認
              </h2>

              <div className="mt-7 rounded-2xl bg-[#f8f5ef] p-6">
                <div className="text-sm text-[#8d8379]">
                  {selected.label}
                </div>
                <div className="mt-2 text-4xl font-bold">
                  {selected.size}
                </div>
                <div className="mt-1 text-sm text-[#8d8379]">
                  {selected.posts}をアーカイブ予定
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#e6ddd2] p-5">
                <div className="font-semibold">Google Driveへ保存</div>
                <div className="mt-3 text-sm leading-7 text-[#756d65]">
                  AERU Cleaner / archive / 2026-08-28
                  <br />
                  投稿情報・画像・動画を投稿単位で保存します。
                </div>
              </div>

              {mode === "standard" && (
                <div className="mt-5 rounded-2xl border border-[#eadbc9] bg-[#fffaf3] p-5 text-sm leading-6 text-[#705f4c]">
                  ⚠️ Google Driveへの保存と検証が成功したファイルのみ、
                  Misskey Driveから削除します。
                </div>
              )}

              <button
                onClick={startCleanup}
                className="mt-8 w-full rounded-2xl bg-[#4e4943] px-6 py-4 font-semibold text-white"
              >
                {mode === "safe"
                  ? "アーカイブを開始"
                  : "アーカイブ＆クリーンアップ開始"}
              </button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-[#e4dbcf] bg-white p-7 shadow-sm sm:p-10">
              {!completed ? (
                <>
                  <p className="text-sm font-semibold text-[#a17c58]">
                    PROCESSING
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {running ? "処理しています…" : "準備しています…"}
                  </h2>

                  <div className="mt-9 space-y-5">
                    {[
                      "投稿情報を取得",
                      "添付ファイルを確認",
                      "Google Driveへ保存",
                      "保存結果を検証",
                      "Misskey Driveを整理",
                    ].map((label, i) => {
                      const threshold = (i + 1) * 20;
                      const done = progress >= threshold;

                      return (
                        <div key={label}>
                          <div className="flex justify-between text-sm">
                            <span>{label}</span>
                            <span>{done ? "✓" : "…"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 h-3 overflow-hidden rounded-full bg-[#eee7dd]">
                    <div
                      className="h-full rounded-full bg-[#b78d62] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="mt-3 text-right text-sm text-[#8d8379]">
                    {progress}%
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-5xl">🎉</div>
                    <h2 className="mt-4 text-3xl font-bold">
                      クリーンアップ完了
                    </h2>
                    <p className="mt-2 text-[#756d65]">
                      Misskey Driveを整理しました。
                    </p>
                  </div>

                  <div className="mt-9 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#f8f5ef] p-5">
                      <div className="text-xs text-[#988e84]">整理前</div>
                      <div className="mt-2 text-2xl font-bold">500 MB</div>
                    </div>

                    <div className="rounded-2xl bg-[#f8f5ef] p-5">
                      <div className="text-xs text-[#988e84]">整理後</div>
                      <div className="mt-2 text-2xl font-bold">213 MB</div>
                    </div>

                    <div className="rounded-2xl bg-[#f8f5ef] p-5">
                      <div className="text-xs text-[#988e84]">解放容量</div>
                      <div className="mt-2 text-2xl font-bold">287 MB</div>
                    </div>

                    <div className="rounded-2xl bg-[#f8f5ef] p-5">
                      <div className="text-xs text-[#988e84]">アーカイブ</div>
                      <div className="mt-2 text-2xl font-bold">1,284件</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setStep(3);
                      setCompleted(false);
                      setProgress(0);
                    }}
                    className="mt-8 w-full rounded-2xl bg-[#4e4943] px-6 py-4 font-semibold text-white"
                  >
                    もう一度整理する
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        <footer className="mt-8 text-center text-xs text-[#aaa097]">
          AERU Cleaner · Misskey Archive &amp; Cleanup
        </footer>
      </div>
    </main>
  );
}
