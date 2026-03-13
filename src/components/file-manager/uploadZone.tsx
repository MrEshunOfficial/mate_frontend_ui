"use client";

import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  accept?: string;
  maxSizeMB?: number;
  uploading: boolean;
  progress: number;
  error: string | null;
  onFile: (file: File) => void;
  disabled?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadZone({
  accept = "image/*",
  maxSizeMB = 10,
  uploading,
  progress,
  error,
  onFile,
  disabled,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const validate = (file: File): string | null => {
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return `File exceeds ${maxSizeMB} MB limit (${formatBytes(file.size)})`;
    }
    return null;
  };

  const handle = useCallback(
    (file: File) => {
      const msg = validate(file);
      if (msg) {
        alert(msg);
        return;
      }
      onFile(file);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [onFile, maxSizeMB],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (uploading) return;
      const file = e.dataTransfer.files[0];
      if (file) handle(file);
    },
    [handle, uploading],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !uploading) handle(file);
    e.target.value = "";
  };

  const isDisabled = disabled || uploading;

  return (
    <div className="fm-upload-zone-wrapper">
      {/* Drop target */}
      <button
        type="button"
        className={[
          "fm-upload-zone",
          dragging ? "fm-upload-zone--dragging" : "",
          isDisabled ? "fm-upload-zone--disabled" : "",
          error ? "fm-upload-zone--error" : "",
        ].join(" ")}
        onClick={() => !isDisabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDisabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={isDisabled ? undefined : onDrop}
        disabled={isDisabled}
        aria-label="Upload file"
      >
        {uploading ? (
          <span className="fm-upload-icon fm-upload-icon--spin">⟳</span>
        ) : (
          <span className="fm-upload-icon">↑</span>
        )}

        <span className="fm-upload-label">
          {uploading
            ? `Uploading… ${progress}%`
            : dragging
              ? "Drop to upload"
              : "Click or drag a file"}
        </span>

        <span className="fm-upload-hint">
          {accept.replace("image/*", "Images")} · max {maxSizeMB} MB
        </span>
      </button>

      {/* Progress bar */}
      {uploading && (
        <div
          className="fm-progress-track"
          role="progressbar"
          aria-valuenow={progress}
        >
          <div className="fm-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Validation / API error */}
      {error && !uploading && <p className="fm-upload-error">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onInputChange}
        className="fm-visually-hidden"
        tabIndex={-1}
      />
    </div>
  );
}
