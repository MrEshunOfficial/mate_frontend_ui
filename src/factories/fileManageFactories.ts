// ─── File Manager API Factory ─────────────────────────────────────────────────
// Convenience wrappers so callers never have to import configs directly.
// Each factory creates a pre-configured FileManagerAPI instance.
//
// Usage:
//   const api = createProfilePictureAPI();
//   const api = createServiceCoverAPI({ routePrefix: "/api/v2/files/service-cover" });
//   const api = createProviderAPI("provider_gallery");

import { profilePictureConfig, categoryCoverConfig, serviceCoverConfig, clientIdImageConfig, taskAttachmentConfig, bookingAttachmentConfig, getProviderConfig } from "@/config/file/file.entity.config";
import { FileManagerAPIOptions, FileManagerAPI } from "@/lib/api/file/files.api";
import { ImageLabel } from "@/types/files/files.types";

// ─── Individual Factories ─────────────────────────────────────────────────────

export const createProfilePictureAPI = (
  options?: FileManagerAPIOptions
): FileManagerAPI => new FileManagerAPI(profilePictureConfig, options);

export const createCategoryCoverAPI = (
  options?: FileManagerAPIOptions
): FileManagerAPI => new FileManagerAPI(categoryCoverConfig, options);

export const createServiceCoverAPI = (
  options?: FileManagerAPIOptions
): FileManagerAPI => new FileManagerAPI(serviceCoverConfig, options);

export const createClientIdImageAPI = (
  options?: FileManagerAPIOptions
): FileManagerAPI => new FileManagerAPI(clientIdImageConfig, options);

export const createTaskAttachmentAPI = (
  options?: FileManagerAPIOptions
): FileManagerAPI => new FileManagerAPI(taskAttachmentConfig, options);

export const createBookingAttachmentAPI = (
  options?: FileManagerAPIOptions
): FileManagerAPI => new FileManagerAPI(bookingAttachmentConfig, options);

/**
 * Provider has two file types — gallery (default) and id-image.
 * Pass the label explicitly to get the correct config.
 */
export const createProviderAPI = (
  label: "provider_gallery" | "provider_id_image" = "provider_gallery",
  options?: FileManagerAPIOptions
): FileManagerAPI => new FileManagerAPI(getProviderConfig(label), options);

// ─── Generic Factory ──────────────────────────────────────────────────────────
// Creates an API instance from a label string — useful when the entity type
// is not known until runtime (e.g. driven by a CMS or dynamic route config).

const LABEL_TO_FACTORY: Partial<Record<ImageLabel, (opts?: FileManagerAPIOptions) => FileManagerAPI>> = {
  profile_picture:   createProfilePictureAPI,
  category_cover:    createCategoryCoverAPI,
  service_cover:     createServiceCoverAPI,
  provider_gallery:  (opts) => createProviderAPI("provider_gallery", opts),
  provider_id_image: (opts) => createProviderAPI("provider_id_image", opts),
  client_id_image:   createClientIdImageAPI,
  task_image:        createTaskAttachmentAPI,
};

export const createFileAPIByLabel = (
  label: ImageLabel,
  options?: FileManagerAPIOptions
): FileManagerAPI => {
  const factory = LABEL_TO_FACTORY[label];
  if (!factory) {
    throw new Error(`[createFileAPIByLabel] No factory registered for label "${label}"`);
  }
  return factory(options);
};