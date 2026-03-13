"use client";

import { IFileRecord } from "@/types/files/files.types";
import { useState } from "react";

interface FilePreviewProps {
  file: IFileRecord;
  onArchive?: () => void;
  onDeleteAsset?: () => void;
  onDeleteRecord?: () => void;
  archiving?: boolean;
  deleting?: boolean;
  readOnly?: boolean;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1_048_576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1_048_576).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FilePreview({
  file,
  onArchive,
  onDeleteAsset,
  onDeleteRecord,
  archiving,
  deleting,
  readOnly,
}: FilePreviewProps) {
  const [confirmDelete, setConfirmDelete] = useState<"asset" | "record" | null>(
    null,
  );
  const isImage = file.mimeType?.startsWith("image/");

  const handleConfirm = () => {
    if (confirmDelete === "asset") onDeleteAsset?.();
    if (confirmDelete === "record") onDeleteRecord?.();
    setConfirmDelete(null);
  };

  return (
    <div className="fm-preview">
      {/* Thumbnail or file icon */}
      <div className="fm-preview__thumb">
        {isImage && file.thumbnailUrl ? (
          <img
            src={file.thumbnailUrl}
            alt={file.fileName}
            className="fm-preview__img"
          />
        ) : (
          <span className="fm-preview__icon" aria-hidden>
            {isImage ? "🖼" : "📄"}
          </span>
        )}
        <span className={`fm-status-dot fm-status-dot--${file.status}`} />
      </div>

      {/* Metadata */}
      <div className="fm-preview__meta">
        <p className="fm-preview__name" title={file.fileName}>
          {file.fileName}
        </p>

        <dl className="fm-meta-grid">
          {file.mimeType && (
            <>
              <dt>Type</dt>
              <dd>{file.mimeType}</dd>
            </>
          )}
          {file.fileSize != null && (
            <>
              <dt>Size</dt>
              <dd>{formatBytes(file.fileSize)}</dd>
            </>
          )}
          {file.extension && (
            <>
              <dt>Ext</dt>
              <dd>.{file.extension}</dd>
            </>
          )}
          <>
            <dt>Status</dt>
            <dd className={`fm-meta-status fm-meta-status--${file.status}`}>
              {file.status}
            </dd>
          </>
          <>
            <dt>Uploaded</dt>
            <dd>{formatDate(file.uploadedAt)}</dd>
          </>
          {file.lastAccessedAt && (
            <>
              <dt>Accessed</dt>
              <dd>{formatDate(file.lastAccessedAt)}</dd>
            </>
          )}
          {file.label && (
            <>
              <dt>Label</dt>
              <dd>{file.label.replace(/_/g, " ")}</dd>
            </>
          )}
          {file.tags && file.tags.length > 0 && (
            <>
              <dt>Tags</dt>
              <dd>{file.tags.join(", ")}</dd>
            </>
          )}
          {file.description && (
            <>
              <dt>Note</dt>
              <dd>{file.description}</dd>
            </>
          )}
        </dl>

        {/* View full resolution link */}
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="fm-link"
        >
          View full ↗
        </a>
      </div>

      {/* Actions */}
      {!readOnly && (
        <div className="fm-preview__actions">
          {onArchive && (
            <button
              className="fm-btn fm-btn--ghost"
              onClick={onArchive}
              disabled={archiving || deleting}
              title="Archive (keeps Cloudinary asset)"
            >
              {archiving ? "…" : "Archive"}
            </button>
          )}

          {onDeleteRecord && (
            <button
              className="fm-btn fm-btn--ghost fm-btn--danger"
              onClick={() => setConfirmDelete("record")}
              disabled={archiving || deleting}
              title="Delete MongoDB record only"
            >
              Delete record
            </button>
          )}

          {onDeleteAsset && (
            <button
              className="fm-btn fm-btn--solid fm-btn--danger"
              onClick={() => setConfirmDelete("asset")}
              disabled={archiving || deleting}
              title="Full delete: removes Cloudinary asset + record"
            >
              {deleting ? "Deleting…" : "Delete all"}
            </button>
          )}
        </div>
      )}

      {/* Confirm dialog */}
      {confirmDelete && (
        <div className="fm-confirm" role="alertdialog">
          <p className="fm-confirm__msg">
            {confirmDelete === "asset"
              ? "This removes the Cloudinary asset AND the database record. Cannot be undone."
              : "This removes the database record only. The Cloudinary asset is kept."}
          </p>
          <div className="fm-confirm__btns">
            <button
              className="fm-btn fm-btn--ghost"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </button>
            <button
              className="fm-btn fm-btn--solid fm-btn--danger"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
