// ─── File Entity Configs ──────────────────────────────────────────────────────
// One config per entity type. Each config drives URL construction and
// declares capability flags so the API client and hook know what is available.
//
// Three URL patterns exist across the backend routes:
//
//   PATTERN A  "entity-asset"        /{entitySegment}/{entityId}/{assetSegment}/...
//              Used by: client-id, provider-gallery, provider-id, task, booking
//
//   PATTERN B  "cloudinary-prefixed" /cloudinary/{entityId}/{assetSegment}/...  (Cloudinary)
//                                    /{entityId}/{assetSegment}/...              (MongoDB)
//              Used by: service cover, category cover
//
//   PATTERN C  "me-based"            /cloudinary/me  (own Cloudinary)
//                                    /me             (own MongoDB)
//                                    /cloudinary/{userId} / /{userId}  (other)
//              Used by: profile picture

import { FileEndpoints, FileEntityConfig, FileEntityConfigRegistry } from "@/types/files/config.types";
import { FileEntityType } from "@/types/files/files.types";


// ─── URL Pattern Discriminant ─────────────────────────────────────────────────

export type UrlPattern = "entity-asset" | "cloudinary-prefixed" | "me-based";

// ─── Extended Config (internal) ───────────────────────────────────────────────
// Adds the URL pattern tag and optional flags not present in the interface.

export interface FileEntityConfigFull extends FileEntityConfig {
  urlPattern: UrlPattern;

  // Whether the MongoDB-only delete uses /db (Pattern A) or /record (Pattern B)
  mongoDeleteSegment: "db" | "record";

  // Route prefix under which this router is mounted in the Express app.
  // Override via FileManagerAPI constructor options if your app mounts differently.
  defaultRoutePrefix: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// INDIVIDUAL ENTITY CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

export const profilePictureConfig: FileEntityConfigFull = {
  entityType:          FileEntityType.USER,
  label:               "profile_picture",
  uploadMode:          "linked",
  uploadFieldName:     "file",
  urlPattern:          "me-based",
  mongoDeleteSegment:  "record",   // DELETE /me
  defaultRoutePrefix:  "/api/profile-picture",

  uploadPath:          "/cloudinary/new",
  entitySegment:       "",          // no entity segment — uses /me
  assetSegment:        "",          // no asset segment — route IS the entity
  cloudinaryPrefix:    "/cloudinary",
  entityIdParam:       "userId",

  hasOptimizedRoute:   true,
  hasPublicAssetRoute: true,
  hasPublicRecordRoute: true,

  access: {
    getAsset:     "private",
    getOptimized: "private",
    getRecord:    "private",
  },

  defaultTransformParams: { width: 200, quality: "auto", format: "webp" },
};

export const categoryCoverConfig: FileEntityConfigFull = {
  entityType:          FileEntityType.CATEGORY,
  label:               "category_cover",
  uploadMode:          "orphan",
  uploadFieldName:     "file",
  urlPattern:          "cloudinary-prefixed",
  mongoDeleteSegment:  "record",
  defaultRoutePrefix:  "/api/category-cover",

  uploadPath:          "/cloudinary/new",
  entitySegment:       "",
  assetSegment:        "cover",
  cloudinaryPrefix:    "/cloudinary",
  entityIdParam:       "categoryId",

  hasOptimizedRoute:    true,
  hasPublicAssetRoute:  false,
  hasPublicRecordRoute: false,

  access: {
    getAsset:     "private",
    getOptimized: "private",
    getRecord:    "private",
  },

  defaultTransformParams: { width: 800, quality: "auto", format: "webp" },
};

export const serviceCoverConfig: FileEntityConfigFull = {
  entityType:          FileEntityType.SERVICE,
  label:               "service_cover",
  uploadMode:          "orphan",
  uploadFieldName:     "file",
  urlPattern:          "cloudinary-prefixed",
  mongoDeleteSegment:  "record",
  defaultRoutePrefix:  "/api/services-cover",

  uploadPath:          "/cloudinary/new",
  entitySegment:       "",
  assetSegment:        "cover",
  cloudinaryPrefix:    "/cloudinary",
  entityIdParam:       "serviceId",

  hasOptimizedRoute:    true,
  hasPublicAssetRoute:  true,
  hasPublicRecordRoute: true,

  access: {
    getAsset:     "public",
    getOptimized: "public",
    getRecord:    "public",
  },

  defaultTransformParams: { width: 1200, quality: "auto", format: "webp" },
};

export const providerGalleryConfig: FileEntityConfigFull = {
  entityType:          FileEntityType.PROVIDER_PROFILE,
  label:               "provider_gallery",
  uploadMode:          "linked",
  uploadFieldName:     "image",
  urlPattern:          "entity-asset",
  mongoDeleteSegment:  "db",
  defaultRoutePrefix:  "/api/provider-files",

  uploadPath:          "/cloudinary/provider-gallery",
  entitySegment:       "providers",
  assetSegment:        "gallery",
  cloudinaryPrefix:    "",
  entityIdParam:       "providerProfileId",

  hasOptimizedRoute:    true,
  hasPublicAssetRoute:  true,
  hasPublicRecordRoute: true,

  access: {
    getAsset:     "public",
    getOptimized: "public",
    getRecord:    "public",
  },

  defaultTransformParams: { width: 1000, quality: "auto", format: "webp" },
};

export const providerIdImageConfig: FileEntityConfigFull = {
  entityType:          FileEntityType.PROVIDER_PROFILE,
  label:               "provider_id_image",
  uploadMode:          "linked",
  uploadFieldName:     "image",
  urlPattern:          "entity-asset",
  mongoDeleteSegment:  "db",
  defaultRoutePrefix:  "/api/provider-files",

  uploadPath:          "/cloudinary/provider-id-image",
  entitySegment:       "providers",
  assetSegment:        "id-image",
  cloudinaryPrefix:    "",
  entityIdParam:       "providerProfileId",

  hasOptimizedRoute:    false,
  hasPublicAssetRoute:  false,
  hasPublicRecordRoute: false,

  access: {
    getAsset:     "private",
    getOptimized: "private",
    getRecord:    "private",
  },
};

export const clientIdImageConfig: FileEntityConfigFull = {
  entityType:          FileEntityType.CLIENT_PROFILE,
  label:               "client_id_image",
  uploadMode:          "linked",
  uploadFieldName:     "image",
  urlPattern:          "entity-asset",
  mongoDeleteSegment:  "db",
  defaultRoutePrefix:  "/api/client-files",

  uploadPath:          "/cloudinary/client-id-image",
  entitySegment:       "clients",
  assetSegment:        "id-image",
  cloudinaryPrefix:    "",
  entityIdParam:       "clientProfileId",

  hasOptimizedRoute:    false,
  hasPublicAssetRoute:  false,
  hasPublicRecordRoute: false,

  access: {
    getAsset:     "private",
    getOptimized: "private",
    getRecord:    "private",
  },
};

export const taskAttachmentConfig: FileEntityConfigFull = {
  entityType:          FileEntityType.TASK,
  label:               "task_image",
  uploadMode:          "linked",
  uploadFieldName:     "file",
  urlPattern:          "entity-asset",
  mongoDeleteSegment:  "db",
  defaultRoutePrefix:  "/api/task-files",

  uploadPath:          "/cloudinary/task-attachment",
  entitySegment:       "tasks",
  assetSegment:        "attachments",
  cloudinaryPrefix:    "",
  entityIdParam:       "taskId",

  hasOptimizedRoute:    false,
  hasPublicAssetRoute:  false,
  hasPublicRecordRoute: false,

  access: {
    getAsset:     "private",
    getOptimized: "private",
    getRecord:    "private",
  },
};

export const bookingAttachmentConfig: FileEntityConfigFull = {
  entityType:          FileEntityType.BOOKING,
  label:               "task_image",     // reuses task_image label — no dedicated booking label
  uploadMode:          "linked",
  uploadFieldName:     "file",
  urlPattern:          "entity-asset",
  mongoDeleteSegment:  "db",
  defaultRoutePrefix:  "/api/booking-files",

  uploadPath:          "/cloudinary/booking-attachment",
  entitySegment:       "bookings",
  assetSegment:        "attachments",
  cloudinaryPrefix:    "",
  entityIdParam:       "bookingId",

  hasOptimizedRoute:    false,
  hasPublicAssetRoute:  false,
  hasPublicRecordRoute: false,

  access: {
    getAsset:     "private",
    getOptimized: "private",
    getRecord:    "private",
  },
};

// ─── Config Registry ──────────────────────────────────────────────────────────
// Keyed first by entityType, then (where an entity has >1 file type, e.g.
// provider) by label. For single-file entities the label key is omitted and
// the consumer can access via entityType alone.

export const FILE_ENTITY_CONFIGS: FileEntityConfigRegistry = {
  [FileEntityType.USER]:             profilePictureConfig,
  [FileEntityType.CATEGORY]:         categoryCoverConfig,
  [FileEntityType.SERVICE]:          serviceCoverConfig,
  [FileEntityType.CLIENT_PROFILE]:   clientIdImageConfig,
  [FileEntityType.TASK]:             taskAttachmentConfig,
  [FileEntityType.BOOKING]:          bookingAttachmentConfig,

  // Provider has two file types — callers must use getProviderConfig(label)
  [FileEntityType.PROVIDER_PROFILE]: providerGalleryConfig, // gallery is default
};

// Provider exposes two configs — use this helper instead of the registry directly.
export function getProviderConfig(
  label: "provider_gallery" | "provider_id_image"
): FileEntityConfigFull {
  return label === "provider_gallery" ? providerGalleryConfig : providerIdImageConfig;
}

// ─── Endpoint Resolver ────────────────────────────────────────────────────────
// Builds the full FileEndpoints map for a given config + entityId.
// entityId may be undefined for orphan-mode pre-upload operations — callers
// that need entityId-scoped endpoints must supply it.

export function buildEndpoints(
  config: FileEntityConfigFull,
  entityId?: string,
  routePrefix?: string
): FileEndpoints {
  const prefix = routePrefix ?? config.defaultRoutePrefix;
  const id     = entityId ?? "";

  switch (config.urlPattern) {

    // ── Pattern A: /{entitySegment}/{id}/{assetSegment}/... ───────────────────
    case "entity-asset": {
      const base = `${prefix}/${config.entitySegment}/${id}/${config.assetSegment}`;
      return {
        upload:            `${prefix}${config.uploadPath}`,
        getAsset:          base,
        getPublicAsset:    config.hasPublicAssetRoute  ? `${base}/public`       : undefined,
        getOptimizedAsset: config.hasOptimizedRoute    ? `${base}/optimized`    : undefined,
        deleteAsset:       base,

        getRecord:         `${base}/record`,
        getPublicRecord:   config.hasPublicRecordRoute ? `${base}/record/public` : undefined,
        getHistory:        `${base}/history`,
        updateMetadata:    `${base}/metadata`,
        archive:           `${base}/archive`,
        restore:           (fileId) => `${base}/restore/${fileId}`,
        deleteRecord:      `${base}/${config.mongoDeleteSegment}`,
        getStats:          `${base}/stats`,
        cleanup:           `${base}/cleanup`,
      };
    }

    // ── Pattern B: /cloudinary/{id}/{asset}/...  +  /{id}/{asset}/... ─────────
    case "cloudinary-prefixed": {
      const clBase = `${prefix}/cloudinary/${id}/${config.assetSegment}`;
      const mgBase = `${prefix}/${id}/${config.assetSegment}`;
      return {
        upload:            `${prefix}${config.uploadPath}`,
        getAsset:          clBase,
        getPublicAsset:    config.hasPublicAssetRoute  ? `${clBase}/public`        : undefined,
        getOptimizedAsset: config.hasOptimizedRoute    ? `${clBase}/optimized`     : undefined,
        deleteAsset:       clBase,

        getRecord:         `${mgBase}/record`,
        getPublicRecord:   config.hasPublicRecordRoute ? `${mgBase}/record/public` : undefined,
        getHistory:        `${mgBase}/history`,
        updateMetadata:    `${mgBase}/metadata`,
        archive:           `${mgBase}/archive`,
        restore:           (fileId) => `${mgBase}/restore/${fileId}`,
        deleteRecord:      `${mgBase}/${config.mongoDeleteSegment}`,
        getStats:          `${mgBase}/stats`,
        cleanup:           `${mgBase}/cleanup`,
      };
    }

    // ── Pattern C: /cloudinary/me  +  /me  (self-referential) ─────────────────
    case "me-based": {
      const clBase = `${prefix}/cloudinary`;
      return {
        upload:            `${prefix}${config.uploadPath}`,
        getAsset:          `${clBase}/me`,
        getPublicAsset:    id ? `${clBase}/${id}`      : undefined,
        getOptimizedAsset: `${clBase}/optimized`,
        deleteAsset:       `${clBase}/me`,

        getRecord:         `${prefix}/me`,
        getPublicRecord:   id ? `${prefix}/${id}`       : undefined,
        getHistory:        `${prefix}/history`,
        updateMetadata:    `${prefix}/metadata`,
        archive:           `${prefix}/archive`,
        restore:           (fileId) => `${prefix}/restore/${fileId}`,
        deleteRecord:      `${prefix}/me`,
        getStats:          `${prefix}/stats`,
        cleanup:           `${prefix}/cleanup`,
      };
    }
  }
}