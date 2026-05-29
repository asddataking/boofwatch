"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { requireIdentity } from "./lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 credentials missing. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in Convex dashboard."
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export const getUploadUrl = action({
  args: {
    folder: v.union(v.literal("reports"), v.literal("meetupReports")),
    contentType: v.string(),
    extension: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const bucket = process.env.R2_BUCKET_NAME;
    const publicBase = process.env.R2_PUBLIC_URL;

    if (!bucket || !publicBase) {
      throw new Error(
        "R2_BUCKET_NAME and R2_PUBLIC_URL must be set in Convex dashboard."
      );
    }

    const ext = args.extension.replace(/^\./, "") || "jpg";
    const key = `${args.folder}/${identity.subject}/${Date.now()}.${ext}`;

    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: args.contentType,
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });
    const publicUrl = `${publicBase.replace(/\/$/, "")}/${key}`;

    return { uploadUrl, publicUrl, key };
  },
});
