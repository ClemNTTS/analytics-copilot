"use client";

import { useEffect, useState } from "react";

const steps = [
  { id: "analyze", label: "Analyse de la question...", icon: "..." },
  { id: "sql", label: "Generation de la requete SQL...", icon: "SQL" },
  { id: "db", label: "Execution en base de donnees...", icon: "DB" },
  { id: "answer", label: "Interpretation des resultats...", icon: "OK" },
];

export default function ThinkingLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-w-[280px] flex-col items-start gap-3 rounded-2xl rounded-tl-none border border-card-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
        </div>
        <span className="text-sm font-bold tracking-tight text-foreground/80">
          L&apos;IA reflechit...
        </span>
      </div>

      <div className="w-full space-y-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isActive
                  ? "origin-left scale-105 opacity-100"
                  : isCompleted
                    ? "opacity-50"
                    : "opacity-20"
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {step.icon}
              </span>
              <span
                className={`text-xs font-semibold ${
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-foreground"
                }`}
              >
                {step.label}
              </span>
              {isCompleted && (
                <svg
                  className="ml-auto h-3 w-3 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-blue-600 transition-all duration-1000 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
