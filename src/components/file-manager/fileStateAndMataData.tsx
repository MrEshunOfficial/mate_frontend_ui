"use client";

import { useEffect, useState } from "react";
import {
  FileMetadataUpdateBody,
  FileStatsResponse,
  UpdateFileMetadataResponse,
} from "@/types/files/file.api.types";

// ─── FileStats ────────────────────────────────────────────────────────────────

interface FileStatsProps {
  statsState: {
    data: FileStatsResponse | null;
    loading: boolean;
    error: string | null;
    fetch: () => Promise<void>;
  };
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1_048_576) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1_073_741_824) return `${(n / 1_048_576).toFixed(1)} MB`;
  return `${(n / 1_073_741_824).toFixed(2)} GB`;
}

export function FileStats({ statsState }: FileStatsProps) {
  useEffect(() => {
    statsState.fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, loading, error } = statsState;

  return (
    <div className="fm-stats">
      <span className="fm-section-title">Storage</span>

      {loading && <div className="fm-loading-row">Loading…</div>}
      {error && <div className="fm-error-row">{error}</div>}

      {data && (
        <div className="fm-stats__grid">
          <div className="fm-stat-card">
            <span className="fm-stat-card__value">{data.totalFiles}</span>
            <span className="fm-stat-card__label">Total</span>
          </div>
          <div className="fm-stat-card fm-stat-card--active">
            <span className="fm-stat-card__value">{data.activeFiles}</span>
            <span className="fm-stat-card__label">Active</span>
          </div>
          <div className="fm-stat-card fm-stat-card--archived">
            <span className="fm-stat-card__value">{data.archivedFiles}</span>
            <span className="fm-stat-card__label">Archived</span>
          </div>
          <div className="fm-stat-card">
            <span className="fm-stat-card__value">
              {formatBytes(data.totalStorageBytes)}
            </span>
            <span className="fm-stat-card__label">Total size</span>
          </div>
          <div className="fm-stat-card">
            <span className="fm-stat-card__value">
              {formatBytes(data.averageFileSizeBytes)}
            </span>
            <span className="fm-stat-card__label">Avg size</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MetadataEditor ───────────────────────────────────────────────────────────

interface MetadataEditorProps {
  initialDescription?: string;
  initialTags?: string[];
  metadataState: {
    loading: boolean;
    error: string | null;
    data: UpdateFileMetadataResponse | null;
    update: (
      body: FileMetadataUpdateBody,
    ) => Promise<UpdateFileMetadataResponse | null>;
  };
}

export function MetadataEditor({
  initialDescription = "",
  initialTags = [],
  metadataState,
}: MetadataEditorProps) {
  const [description, setDescription] = useState(initialDescription);
  const [tagInput, setTagInput] = useState(initialTags.join(", "));
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const result = await metadataState.update({ description, tags });
    if (result) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="fm-metadata">
      <span className="fm-section-title">Metadata</span>

      <label className="fm-field">
        <span className="fm-field__label">Description</span>
        <textarea
          className="fm-textarea"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description…"
          disabled={metadataState.loading}
        />
      </label>

      <label className="fm-field">
        <span className="fm-field__label">Tags</span>
        <input
          type="text"
          className="fm-input"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="tag1, tag2, tag3"
          disabled={metadataState.loading}
        />
        <span className="fm-field__hint">Comma-separated</span>
      </label>

      {metadataState.error && (
        <p className="fm-error-row">{metadataState.error}</p>
      )}

      <button
        className={`fm-btn fm-btn--solid ${saved ? "fm-btn--saved" : ""}`}
        onClick={handleSave}
        disabled={metadataState.loading}
      >
        {metadataState.loading ? "Saving…" : saved ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}
