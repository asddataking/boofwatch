"use client";

import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { isConvexConfigured } from "@/lib/convex/config";

export function useReportImageUpload() {
  const getUploadUrl = useAction(api.r2.getUploadUrl);

  return async (
    file: File,
    folder: "reports" | "meetupReports"
  ): Promise<string | null> => {
    if (!isConvexConfigured()) return null;

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const contentType = file.type || "image/jpeg";

    try {
      const { uploadUrl, publicUrl } = await getUploadUrl({
        folder,
        contentType,
        extension: ext,
      });

      const res = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": contentType },
      });

      if (!res.ok) {
        console.error("R2 upload failed", res.status);
        return null;
      }

      return publicUrl;
    } catch (e) {
      console.error("R2 upload error", e);
      return null;
    }
  };
}
