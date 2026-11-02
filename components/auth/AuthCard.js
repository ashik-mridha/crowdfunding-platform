export function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-10 sm:py-14">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="text-foreground/70">{subtitle}</p>
      </div>
      <div className="space-y-5 rounded-3xl border border-divider bg-surface p-5 shadow-sm sm:p-8">
        {children}
      </div>
      <p className="text-center text-sm text-foreground/70">{footer}</p>
    </div>
  );
}

export function OrDivider() {
  return (
    <div
      className="flex items-center gap-3 text-xs uppercase tracking-wide text-foreground/70"
      role="separator"
    >
      <span className="h-px flex-1 bg-divider" />
      or
      <span className="h-px flex-1 bg-divider" />
    </div>
  );
}

export function FormAlert({ children }) {
  if (!children) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      {children}
    </div>
  );
}
