"use client";

import { GetFileHistoryResponse } from "@/types/files/file.api.types";
import { IFileRecord } from "@/types/files/files.types";
import { useEffect, useState } from "react";

interface FileHistoryProps {
  historyState: {
    data: GetFileHistoryResponse | null;
    loading: boolean;
    error: string | null;
    fetch: (params?: { limit?: number; skip?: number }) => Promise<void>;
  };
  restoreState: {
    loading: boolean;
    error: string | null;
    execute: (fileId: string) => Promise<unknown>;
  };
  cleanupState: {
    loading: boolean;
    error: string | null;
    execute: (daysOld?: number) => Promise<unknown>;
  };
  onRestore?: (fileId: string) => void;
  readOnly?: boolean;
}

const PAGE_SIZE = 5;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatBytes(n: number): string {
  if (n < 1_048_576) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1_048_576).toFixed(1)} MB`;
}

export function FileHistory({
  historyState,
  restoreState,
  cleanupState,
  onRestore,
  readOnly,
}: FileHistoryProps) {
  const [skip, setSkip] = useState(0);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  useEffect(() => {
    historyState.fetch({ limit: PAGE_SIZE, skip });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  const handleRestore = async (fileId: string) => {
    setRestoringId(fileId);
    await restoreState.execute(fileId);
    setRestoringId(null);
    onRestore?.(fileId);
    historyState.fetch({ limit: PAGE_SIZE, skip });
  };

  const { data, loading, error } = historyState;
  const files: IFileRecord[] = data?.files ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(skip / PAGE_SIZE) + 1;

  return (
    <div className="fm-history">
      <div className="fm-history__header">
        <span className="fm-section-title">History</span>
        {data && (
          <span className="fm-history__counts">
            <span className="fm-pill fm-pill--active">
              {data.active} active
            </span>
            <span className="fm-pill fm-pill--archived">
              {data.archived} archived
            </span>
          </span>
        )}
        {!readOnly && (
          <button
            className="fm-btn fm-btn--ghost fm-btn--xs"
            onClick={() => cleanupState.execute(30)}
            disabled={cleanupState.loading}
            title="Hard-delete archived records older than 30 days"
          >
            {cleanupState.loading ? "Cleaning…" : "Cleanup old"}
          </button>
        )}
      </div>

      {loading && <div className="fm-loading-row">Loading…</div>}
      {error && <div className="fm-error-row">{error}</div>}

      {!loading && files.length === 0 && (
        <div className="fm-empty-row">No history yet.</div>
      )}

      {files.length > 0 && (
        <ul className="fm-history__list">
          {files.map((file) => (
            <li
              key={file._id}
              className={`fm-history__item fm-history__item--${file.status}`}
            >
              {/* Thumbnail */}
              <div className="fm-history__thumb">
                {file.thumbnailUrl ? (
                  <img
                    src={file.thumbnailUrl}
                    alt=""
                    className="fm-history__img"
                  />
                ) : (
                  <span className="fm-history__icon">📄</span>
                )}
              </div>

              {/* Info */}
              <div className="fm-history__info">
                <p className="fm-history__name">{file.fileName}</p>
                <p className="fm-history__sub">
                  {formatDate(file.uploadedAt)}
                  {file.fileSize != null && ` · ${formatBytes(file.fileSize)}`}
                  {file.deletedAt &&
                    ` · archived ${formatDate(file.deletedAt)}`}
                </p>
              </div>

              {/* Badge */}
              <span
                className={`fm-status-badge fm-status-badge--${file.status}`}
              >
                {file.status}
              </span>

              {/* Restore */}
              {!readOnly && file.status === "archived" && (
                <button
                  className="fm-btn fm-btn--ghost fm-btn--xs"
                  onClick={() => handleRestore(file._id)}
                  disabled={restoreState.loading && restoringId === file._id}
                >
                  {restoreState.loading && restoringId === file._id
                    ? "…"
                    : "Restore"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="fm-pagination">
          <button
            className="fm-btn fm-btn--ghost fm-btn--xs"
            onClick={() => setSkip(Math.max(0, skip - PAGE_SIZE))}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span className="fm-pagination__label">
            {currentPage} / {totalPages}
          </span>
          <button
            className="fm-btn fm-btn--ghost fm-btn--xs"
            onClick={() => setSkip(skip + PAGE_SIZE)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}

      {(restoreState.error || cleanupState.error) && (
        <p className="fm-error-row">
          {restoreState.error ?? cleanupState.error}
        </p>
      )}
    </div>
  );
}
