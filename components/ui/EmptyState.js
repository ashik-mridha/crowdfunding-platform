export function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-divider px-6 py-14 text-center">
      {Icon && (
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent-ink">
          <Icon className="size-7" aria-hidden="true" />
        </span>
      )}
      <h2 className="text-lg font-bold">{title}</h2>
      {description && <p className="max-w-md text-sm text-foreground/70">{description}</p>}
      {children}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-3xl border border-danger/30 bg-danger/5 px-6 py-12 text-center"
    >
      <h2 className="text-lg font-bold text-danger">We could not load this</h2>
      <p className="max-w-md text-sm text-foreground/70">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="min-h-11 rounded-xl bg-danger px-5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
        >
          Try again
        </button>
      )}
    </div>
  );
}
