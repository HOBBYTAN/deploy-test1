"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, History, User, Loader2 } from "lucide-react";
import { getPastLifeFromName, PastLife } from "@/lib/past-life-logic";

export default function PastLifePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ pastLife: PastLife; story: string } | null>(null);

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setResult(null);

    // 1. Get deterministic past life data
    const pastLife = getPastLifeFromName(name);

    try {
      // 2. Fetch AI storytelling
      const response = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ...pastLife }),
      });

      const data = await response.json();
      if (data.story) {
        setResult({ pastLife, story: data.story });
      } else if (response.status !== 200) {
        // Handle API errors that return a JSON response but no story
        console.error("API Error:", data.error || "Unknown error from API");
        setResult({
          pastLife,
          story: `신비로운 운명의 가림막이 잠시 드리워졌지만, 당신은 분명 ${pastLife.year}년의 ${pastLife.title}이었습니다. (API 오류로 인해 기본 스토리 제공)`
        });
      }
    } catch (error: unknown) { // Explicitly type error as unknown
      console.error("Error revealing past life:", error);
      // Fallback in case of network or parsing failure
      setResult({
        pastLife,
        story: `신비로운 운명의 가림막이 잠시 드리워졌지만, 당신은 분명 ${pastLife.year}년의 ${pastLife.title}이었습니다. (네트워크 오류로 인해 기본 스토리 제공)`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 mystic-bg opacity-50 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl animate-pulse" />

      <div className="z-10 w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-white/5 border border-white/10 animate-float">
              <Sparkles className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gold-text tracking-tighter">
            전생의 당신을 만나보세요
          </h1>
          <p className="text-indigo-200/70 mb-12 text-xl md:text-2xl font-light tracking-wide leading-relaxed">
            당신의 이름 속에 숨겨진 수천 년의 기록을 깨웁니다.
          </p>
        </motion.div>

        {!result && (
          <motion.form
            onSubmit={handleReveal}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="당신의 이름을 입력하세요"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-indigo-100/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !name}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl font-semibold text-white hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-purple-500/20"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <History className="w-5 h-5" />
                    운명 확인하기
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-indigo-300/40 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>300개 이상의 다양한 전생 데이터가 준비되어 있습니다</span>
            </div>
          </motion.form>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="mt-8 space-y-6"
            >
              <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border-white/20">
                <div className="mb-8">
                  <span className="px-6 py-2 rounded-full bg-white/10 text-indigo-300 border border-white/10 text-base font-semibold tracking-widest uppercase">
                    {result.pastLife.year < 0 ? `기원전 ${Math.abs(result.pastLife.year)}년` : `서기 ${result.pastLife.year}년`}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                  &quot;{name}&quot;님은 전생에 <br />
                  <span className="gold-text">[{result.pastLife.title}]</span> <br />
                  이었습니다.
                </h2>

                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-transparent opacity-40" />
                  <p className="text-lg md:text-xl text-indigo-50/90 leading-[1.8] pl-6 italic font-serif tracking-normal text-left whitespace-pre-wrap">
                    {result.story}
                  </p>
                </div>

                <div className="mt-12 flex justify-center gap-4">
                  <button
                    onClick={() => setResult(null)}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium"
                  >
                    다른 이름 검색하기
                  </button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-indigo-300/40 text-sm flex items-center justify-center gap-2"
              >
                <span>이 이야기는 인공지능이 당신의 우연을 바탕으로 엮어낸 판타지입니다.</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="absolute bottom-8 text-indigo-300/20 text-xs">
        © 2026 Past Life Finder. Powered by OpenAI.
      </footer>
    </main>
  );
}
