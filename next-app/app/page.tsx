"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { executeNaturalLanguageQuery } from "./actions.ts/handleLLM";
import { useChat } from "@/components/ChatProvider";
import SmartChart from "@/components/SmartChart";
import ThinkingLoader from "@/components/ThinkingLoader";

const suggestedQuestions = [
  "Montre-moi la repartition du MRR par type d'offre sous forme de graphique.",
  "Quel est le MRR total actuel et sa croissance sur les 6 derniers mois ?",
  "Quels sont les 5 clients avec le MRR le plus eleve ?",
  "Liste les clients avec des factures en retard et le montant total du.",
  "Quels sont les 3 plans d'abonnement qui generent le plus de MRR ?",
];

export default function Home() {
  const { messages, setMessages, input, setInput } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuery = async (query: string) => {
    if (!query.trim() || isLoading) {
      return;
    }

    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setIsLoading(true);

    try {
      const result = await executeNaturalLanguageQuery(query, history);

      if (result.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.error, error: true },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer || "Voici les resultats de votre recherche.",
          sql: result.sql,
          data: result.data,
          chartConfig: result.chartConfig,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Desole, une erreur critique est survenue.",
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleQuery(input);
    setInput("");
  };

  return (
    <div className="flex h-full w-full flex-col bg-background transition-colors duration-300">
      <main className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex flex-col ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[95%] rounded-2xl border p-4 shadow-sm sm:max-w-[85%] ${
                  message.role === "user"
                    ? "rounded-tr-none border-blue-600 bg-blue-600 text-white"
                    : message.error
                      ? "rounded-tl-none border-red-500/20 bg-red-500/10 text-red-500"
                      : "rounded-tl-none border-card-border bg-card text-foreground"
                }`}
              >
                <div className="overflow-x-auto text-sm leading-relaxed font-medium sm:text-base">
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-black text-blue-600 dark:text-blue-400">
                            {children}
                          </strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="my-2 list-disc space-y-1 pl-4">
                            {children}
                          </ul>
                        ),
                        table: ({ children }) => (
                          <div className="my-4 overflow-x-auto rounded-lg border border-current/20">
                            <table className="w-full border-collapse text-left text-xs sm:text-sm">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-current/5 font-black uppercase tracking-wider">
                            {children}
                          </thead>
                        ),
                        th: ({ children }) => (
                          <th className="border border-current/10 p-2">{children}</th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-current/10 p-2">{children}</td>
                        ),
                        tr: ({ children }) => (
                          <tr className="even:bg-current/5 transition-colors hover:bg-current/10">
                            {children}
                          </tr>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>

                {message.chartConfig && message.data && (
                  <SmartChart data={message.data} config={message.chartConfig} />
                )}

                {message.sql && (
                  <details className="group mt-4 border-t border-current/10 pt-3">
                    <summary className="flex cursor-pointer select-none items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50 transition-all hover:opacity-100 group-open:mb-2">
                      Requete SQL
                    </summary>
                    <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-[11px] text-emerald-400 sm:text-xs">
                      {message.sql}
                    </pre>
                  </details>
                )}
              </div>

              <span className="mt-1 px-2 text-[10px] font-bold uppercase tracking-tight opacity-40">
                {message.role === "user" ? "Utilisateur" : "Assistant"}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start">
              <ThinkingLoader />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t border-card-border bg-card/50 p-4 backdrop-blur-sm sm:p-6">
        <div className="mx-auto max-w-3xl">
          {messages.length <= 1 && (
            <div className="mb-4">
              <p className="mb-2 px-2 text-xs font-bold uppercase text-zinc-400">
                Exemples de questions
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => setInput(question)}
                    className="rounded-lg bg-muted p-3 text-left text-xs font-semibold text-foreground/80 transition-all hover:bg-zinc-200/80 dark:hover:bg-zinc-700/60"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Posez votre question analytique..."
              className="flex-1 rounded-2xl border-2 border-transparent bg-muted p-4 pr-14 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-background sm:text-base"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute top-2 right-2 bottom-2 flex aspect-square items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg transition-transform hover:bg-blue-700 active:scale-95 disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-widest opacity-40">
            NL2SQL demo powered by a configurable LLM endpoint
          </p>
        </div>
      </footer>
    </div>
  );
}
