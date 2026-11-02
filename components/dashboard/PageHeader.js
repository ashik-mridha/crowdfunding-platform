export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {description && <p className="text-foreground/70">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
