"use client";

import type { BookForm } from "@/lib/form";
import { GENRES, STATUS_ORDER, STATUS_META } from "@/lib/categories";

type Props = {
  value: BookForm;
  onChange: (patch: Partial<BookForm>) => void;
};

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelCls = "mb-1 block text-xs font-medium text-muted";

export default function BookFormFields({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelCls}>Título *</label>
        <input
          className={inputCls}
          value={value.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="El nombre del libro"
          required
        />
      </div>

      <div>
        <label className={labelCls}>Autor/a</label>
        <input
          className={inputCls}
          value={value.author}
          onChange={(e) => onChange({ author: e.target.value })}
        />
      </div>

      <div>
        <label className={labelCls}>Estado</label>
        <select
          className={inputCls}
          value={value.status}
          onChange={(e) => onChange({ status: e.target.value as BookForm["status"] })}
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].emoji} {STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Tipo</label>
        <select
          className={inputCls}
          value={value.is_fiction}
          onChange={(e) => onChange({ is_fiction: e.target.value as BookForm["is_fiction"] })}
        >
          <option value="">—</option>
          <option value="si">Ficción</option>
          <option value="no">No ficción</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Género</label>
        <input
          className={inputCls}
          list="genre-options"
          value={value.genre}
          onChange={(e) => onChange({ genre: e.target.value })}
          placeholder="Ej: Fantasía"
        />
        <datalist id="genre-options">
          {GENRES.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </div>

      <div className="sm:col-span-2">
        <label className={labelCls}>Categorías / etiquetas (separadas por coma)</label>
        <input
          className={inputCls}
          value={value.categories}
          onChange={(e) => onChange({ categories: e.target.value })}
          placeholder="distopía, feminismo, aventuras"
        />
      </div>

      <div>
        <label className={labelCls}>Páginas</label>
        <input
          className={inputCls}
          type="number"
          min={0}
          value={value.pages}
          onChange={(e) => onChange({ pages: e.target.value })}
        />
      </div>

      <div>
        <label className={labelCls}>Año</label>
        <input
          className={inputCls}
          type="number"
          value={value.year}
          onChange={(e) => onChange({ year: e.target.value })}
        />
      </div>

      <div>
        <label className={labelCls}>Idioma</label>
        <input
          className={inputCls}
          value={value.language}
          onChange={(e) => onChange({ language: e.target.value })}
        />
      </div>

      <div>
        <label className={labelCls}>Editorial</label>
        <input
          className={inputCls}
          value={value.publisher}
          onChange={(e) => onChange({ publisher: e.target.value })}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={labelCls}>URL de portada</label>
        <input
          className={inputCls}
          value={value.cover_url}
          onChange={(e) => onChange({ cover_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="sm:col-span-2">
        <label className={labelCls}>Sinopsis</label>
        <textarea
          className={`${inputCls} min-h-20`}
          value={value.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={labelCls}>Notas personales</label>
        <textarea
          className={`${inputCls} min-h-16`}
          value={value.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </div>
    </div>
  );
}
