type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; hint?: string; error?: string };

export function Field({ label, name, hint, error, className = "", ...rest }: Props) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-2 block font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`h-14 w-full rounded-2xl border bg-foam px-4 text-base outline-none transition-colors focus:border-pine ${
          error ? "border-red-700" : "border-pine/15"
        }`}
        {...rest}
      />
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-red-800">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="mt-1.5 text-sm text-pine/55">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
