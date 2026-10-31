/**
 * Mocked UAE PASS integration — production contract, static transport.
 *
 * GitHub Pages is a static host, so there is no server to hash on. The Emirates
 * ID is hashed in the browser with Web Crypto (SHA-256) and only the hash is
 * stored: hash + status + timestamp (+ record id). The plaintext never leaves
 * the function that computes it.
 *
 * Because the hash is computed client-side, the pepper is part of the shipped
 * bundle and is therefore not a secret — treat it as a demo salt. A deployment
 * with a server should hash server-side and keep the pepper private (that was
 * the previous `"use server"` implementation).
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

// Set NEXT_PUBLIC_UAE_PASS_HASH_PEPPER at build time to override the demo salt.
const PEPPER = process.env.NEXT_PUBLIC_UAE_PASS_HASH_PEPPER ?? "sanad-demo-pepper-change-me";

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function requestVerification(
  rawEmiratesId: string,
): Promise<{ error: "invalid_id" | "missing_pepper" } | { draft: VerificationDraft }> {
  const digits = rawEmiratesId.replace(DIGITS, "");
  if (digits.length !== 15) return { error: "invalid_id" };

  if (!PEPPER || PEPPER.length < 16) return { error: "missing_pepper" };

  const idHash = await sha256Hex(`${digits}:${PEPPER}`);

  // The plaintext `digits` go out of scope here and are never persisted.
  return {
    draft: {
      recordId: crypto.randomUUID(),
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
