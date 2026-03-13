// ─── Entity-Specific Hook Wrappers ────────────────────────────────────────────
// Pre-configured wrappers around useFileManager.
// Components can import the specific hook they need instead of passing
// entityType manually, reducing boilerplate and preventing typos.
//
// Usage:
//   const fm = useProfilePicture({ entityId: userId, autoFetch: true });
//   const fm = useServiceCover({ entityId: serviceId });
//   const fm = useProviderGallery({ entityId: providerProfileId });
//   const fm = useProviderIdImage({ entityId: providerProfileId });
//   const fm = useClientIdImage({ entityId: clientProfileId });
//   const fm = useTaskAttachment({ entityId: taskId });
//   const fm = useBookingAttachment({ entityId: bookingId });

import { FileEntityType } from "@/types/files/files.types";
import { UseFileManagerReturn } from "@/types/files/manager.types";
import { UseFileManagerOptions, useFileManager } from "../useFileManager";


// ─── Shared Option Types ──────────────────────────────────────────────────────
// entityType is omitted from all wrappers — it is injected by the wrapper.

// type OmitEntityType = Omit<UseFileManagerOptions, "entityType">;
type OmitEntityTypeAndLabel = Omit<UseFileManagerOptions, "entityType" | "providerLabel">;

// ─── Profile Picture ──────────────────────────────────────────────────────────

export function useProfilePicture(
  opts: OmitEntityTypeAndLabel = {}
): UseFileManagerReturn {
  return useFileManager({ ...opts, entityType: FileEntityType.USER });
}

// ─── Category Cover ───────────────────────────────────────────────────────────

export function useCategoryCover(
  opts: OmitEntityTypeAndLabel = {}
): UseFileManagerReturn {
  return useFileManager({ ...opts, entityType: FileEntityType.CATEGORY });
}

// ─── Service Cover ────────────────────────────────────────────────────────────

export function useServiceCover(
  opts: OmitEntityTypeAndLabel = {}
): UseFileManagerReturn {
  return useFileManager({ ...opts, entityType: FileEntityType.SERVICE });
}

// ─── Provider Gallery ─────────────────────────────────────────────────────────

export function useProviderGallery(
  opts: OmitEntityTypeAndLabel = {}
): UseFileManagerReturn {
  return useFileManager({
    ...opts,
    entityType:    FileEntityType.PROVIDER_PROFILE,
    providerLabel: "provider_gallery",
  });
}

// ─── Provider ID Image ────────────────────────────────────────────────────────

export function useProviderIdImage(
  opts: OmitEntityTypeAndLabel = {}
): UseFileManagerReturn {
  return useFileManager({
    ...opts,
    entityType:    FileEntityType.PROVIDER_PROFILE,
    providerLabel: "provider_id_image",
  });
}

// ─── Client ID Image ──────────────────────────────────────────────────────────

export function useClientIdImage(
  opts: OmitEntityTypeAndLabel = {}
): UseFileManagerReturn {
  return useFileManager({ ...opts, entityType: FileEntityType.CLIENT_PROFILE });
}

// ─── Task Attachment ──────────────────────────────────────────────────────────

export function useTaskAttachment(
  opts: OmitEntityTypeAndLabel = {}
): UseFileManagerReturn {
  return useFileManager({ ...opts, entityType: FileEntityType.TASK });
}

// ─── Booking Attachment ───────────────────────────────────────────────────────

export function useBookingAttachment(
  opts: OmitEntityTypeAndLabel = {}
): UseFileManagerReturn {
  return useFileManager({ ...opts, entityType: FileEntityType.BOOKING });
}