import { ProgressBar } from "@heroui/react";

const RULES = [
  { id: "len", label: "8+ characters", test: (p) => p.length >= 8 },
  { id: "lower", label: "Lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "upper", label: "Uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "num", label: "Number", test: (p) => /\d/.test(p) },
];

export function PasswordStrength({ password = "" }) {
  const passed = RULES.filter((r) => r.test(password)).length;
  const label = ["Too weak", "Weak", "Fair", "Good", "Strong"][passed];
  const color = passed <= 1 ? "danger" : passed < 4 ? "warning" : "success";

  return (
    <div className="space-y-2" aria-live="polite">
      <ProgressBar
        aria-label="Password strength"
        value={(passed / RULES.length) * 100}
        color={color}
        size="sm"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground/70">Password strength</span>
          <ProgressBar.Output>{label}</ProgressBar.Output>
        </div>
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {RULES.map((r) => (
          <li key={r.id} className={r.test(password) ? "text-success" : "text-foreground/70"}>
            {r.test(password) ? "✓" : "•"} {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
