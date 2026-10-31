"use server";

import { createHash, randomUUID } from "node:crypto";

/**
 * Mocked UAE PASS integration — production contract, demo transport.
 *
 * The Emirates ID is hashed on the server with a private pepper and is never
 * written to a database, a log, or a response body. Only the hash is returned,
 * and the client stores exactly what the schema stores:
 * hash + status + timestamp (+ record id).
 */

export interface VerificationDraft {
  recordId: string;
  idHash: string;
  status: "pending";
  requestedAt: string;
}

export interface VerificationResult {
  recordId: string;
  status: "verified";
  verifiedAt: string;
  idHash: string;
}

const DIGITS = /\D/g;

export async function requestVerification(
  rawEmiratesId: string,
): Promise<{ error: "invalid_id" | "missing_pepper" } | { draft: VerificationDraft }> {
  const digits = rawEmiratesId.replace(DIGITS, "");
  if (digits.length !== 15) return { error: "invalid_id" };

  const pepper = process.env.UAE_PASS_HASH_PEPPER;
  if (!pepper || pepper.length < 16) return { error: "missing_pepper" };

  const idHash = createHash("sha256").update(`${digits}:${pepper}`, "utf8").digest("hex");

  // The plaintext `digits` go out of scope here and are never persisted.
  return {
    draft: {
      recordId: randomUUID(),
      idHash,
      status: "pending",
      requestedAt: new Date().toISOString(),
    },
  };
}

export async function confirmVerification(
  recordId: string,
  otp: string,
): Promise<{ error: "invalid_code" | "invalid_record" } | { result: VerificationResult }> {
  if (!/^\d{6}$/.test(otp.trim())) return { error: "invalid_code" };
  if (!recordId) return { error: "invalid_record" };

  // A real integration calls the UAE PASS verification endpoint with the OTP
  // and receives a signed residency assertion; we accept any 6 digits here.
  return {
    result: {
      recordId,
      status: "verified",
      verifiedAt: new Date().toISOString(),
      idHash: "",
    },
  };
}
