type Base = { id: string; label: string; hint?: string; required?: boolean; name?: string };

export function TextField({ id, label, hint, required, name, type = "text", autoComplete, placeholder, defaultValue }: Base & { type?: string; autoComplete?: string; placeholder?: string; defaultValue?: string }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required ? <span className="text-ember-deep" aria-hidden="true">*</span> : <span className="font-normal text-faint">(optional)</span>}
      </label>
      <input id={id} name={name || id} type={type} className="input" required={required} autoComplete={autoComplete} placeholder={placeholder} defaultValue={defaultValue} aria-describedby={hint ? `${id}-hint` : undefined} />
      {hint ? <p id={`${id}-hint`} className="hint">{hint}</p> : null}
      <p className="error-msg" hidden />
    </div>
  );
}

export function TextArea({ id, label, hint, required, name, rows = 5, placeholder }: Base & { rows?: number; placeholder?: string }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required ? <span className="text-ember-deep" aria-hidden="true">*</span> : <span className="font-normal text-faint">(optional)</span>}
      </label>
      {hint ? <p id={`${id}-hint`} className="hint -mt-1">{hint}</p> : null}
      <textarea id={id} name={name || id} rows={rows} className="input" required={required} placeholder={placeholder} aria-describedby={hint ? `${id}-hint` : undefined} />
      <p className="error-msg" hidden />
    </div>
  );
}

export function Select({ id, label, hint, required, name, options, placeholder = "Select…", defaultValue = "" }: Base & { options: string[]; placeholder?: string; defaultValue?: string }) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {required ? <span className="text-ember-deep" aria-hidden="true">*</span> : <span className="font-normal text-faint">(optional)</span>}
      </label>
      <select id={id} name={name || id} className="input" required={required} defaultValue={defaultValue}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {hint ? <p className="hint">{hint}</p> : null}
      <p className="error-msg" hidden />
    </div>
  );
}

export function Choices({ id, label, hint, required, name, options, cols = 2 }: Base & { options: string[]; cols?: 2 | 3 }) {
  return (
    <fieldset className="field">
      <legend className="mb-2">
        {label} {required ? <span className="text-ember-deep" aria-hidden="true">*</span> : null}
      </legend>
      {hint ? <p className="hint -mt-1 mb-1">{hint}</p> : null}
      <div className={`grid gap-2.5 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {options.map((o, i) => (
          <label key={o} className="choice" htmlFor={`${id}-${i}`}>
            <input type="radio" id={`${id}-${i}`} name={name || id} value={o} required={required} data-error="Please choose one option." />
            {o}
          </label>
        ))}
      </div>
      <p className="error-msg" hidden />
    </fieldset>
  );
}
