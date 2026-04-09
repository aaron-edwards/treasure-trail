import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { del, list, put } from "@vercel/blob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const huntPath = path.join(rootDir, "src/content/hunt.json");
const manifestPath = path.join(rootDir, "src/content/speech-manifest.json");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (!key || process.env[key]) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFile(path.join(rootDir, ".env"));
loadEnvFile(path.join(rootDir, ".env.local"));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_TTS_API_KEY ?? "";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN ?? "";
const GEMINI_MODEL =
  process.env.GEMINI_TTS_MODEL ?? "gemini-2.5-flash-preview-tts";
const GEMINI_VOICE = process.env.GEMINI_TTS_VOICE ?? "Puck";
const PROMPT_STYLE =
  process.env.GEMINI_TTS_STYLE ??
  "Read this like a whimsical children's story poem. Keep the tone warm, playful, magical, and gently expressive. Pause lightly between each line so the verse feels deliberate and easy to follow.";
const SAMPLE_RATE = 24000;
const CHANNEL_COUNT = 1;
const BITS_PER_SAMPLE = 16;

function log(message, details) {
  if (details) {
    console.info(`[speech:sync] ${message}`, details);
    return;
  }

  console.info(`[speech:sync] ${message}`);
}

function createTextHash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function normalizeEntry(entry) {
  if (
    !entry ||
    typeof entry.hash !== "string" ||
    typeof entry.url !== "string" ||
    !entry.hash ||
    !entry.url
  ) {
    return null;
  }

  return {
    hash: entry.hash,
    url: entry.url,
  };
}

function normalizeManifest(existingManifest, stepIds) {
  return {
    audioEncoding:
      typeof existingManifest?.audioEncoding === "string"
        ? existingManifest.audioEncoding
        : null,
    event: {
      done: normalizeEntry(existingManifest?.event?.done),
      intro: normalizeEntry(existingManifest?.event?.intro),
    },
    generatedAt:
      typeof existingManifest?.generatedAt === "string"
        ? existingManifest.generatedAt
        : null,
    provider:
      typeof existingManifest?.provider === "string"
        ? existingManifest.provider
        : null,
    steps: Object.fromEntries(
      stepIds.map((stepId) => [
        stepId,
        normalizeEntry(existingManifest?.steps?.[stepId]),
      ]),
    ),
  };
}

async function loadJson(filePath) {
  const content = await readFile(filePath, "utf8");
  return JSON.parse(content);
}

function getSpeechEntries(hunt) {
  return [
    {
      id: "intro",
      kind: "event",
      lines: hunt.event.introPoem,
      manifestKey: "intro",
      slug: "intro",
    },
    {
      id: "done",
      kind: "event",
      lines: hunt.event.celebrationPoem,
      manifestKey: "done",
      slug: "done",
    },
    ...hunt.steps.map((step) => ({
      id: step.id,
      kind: "step",
      lines: step.poem,
      manifestKey: step.id,
      slug: step.id,
    })),
  ].map((entry) => ({
    ...entry,
    prompt: [
      PROMPT_STYLE,
      "",
      "Speak the following poem exactly as written, preserving the line breaks:",
      ...entry.lines,
    ].join("\n"),
  }));
}

function buildEntryHash(prompt) {
  return createTextHash(
    JSON.stringify({
      model: GEMINI_MODEL,
      prompt,
      sampleRate: SAMPLE_RATE,
      voice: GEMINI_VOICE,
    }),
  );
}

function extractAudioBase64(responseJson) {
  const parts = responseJson?.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    const inlineData = part?.inlineData;
    if (
      inlineData?.data &&
      typeof inlineData.data === "string" &&
      inlineData.mimeType === "audio/L16;codec=pcm;rate=24000"
    ) {
      return inlineData.data;
    }
  }

  return null;
}

function pcmToWav(pcmBuffer) {
  const blockAlign = (CHANNEL_COUNT * BITS_PER_SAMPLE) / 8;
  const byteRate = SAMPLE_RATE * blockAlign;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(CHANNEL_COUNT, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(BITS_PER_SAMPLE, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([header, pcmBuffer]);
}

async function synthesizeWithGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
            role: "user",
          },
        ],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: GEMINI_VOICE,
              },
            },
          },
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini TTS request failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  const audioBase64 = extractAudioBase64(data);

  if (!audioBase64) {
    throw new Error("Gemini TTS response did not include audio inlineData.");
  }

  return pcmToWav(Buffer.from(audioBase64, "base64"));
}

function getReferencedUrls(manifest) {
  const urls = new Set();

  for (const entry of [
    manifest.event.intro,
    manifest.event.done,
    ...Object.values(manifest.steps),
  ]) {
    if (entry?.url) {
      urls.add(entry.url);
    }
  }

  return urls;
}

async function cleanupUnusedSpeechBlobs(manifest) {
  const referencedUrls = getReferencedUrls(manifest);
  const { blobs } = await list({
    prefix: "speech/",
    token: BLOB_TOKEN,
  });

  const staleUrls = blobs
    .map((blob) => blob.url)
    .filter((url) => !referencedUrls.has(url));

  if (staleUrls.length === 0) {
    log("no stale speech blobs to delete");
    return;
  }

  log("deleting stale speech blobs", {
    count: staleUrls.length,
  });

  await del(staleUrls, {
    token: BLOB_TOKEN,
  });
}

async function main() {
  await mkdir(path.dirname(manifestPath), { recursive: true });

  const hunt = await loadJson(huntPath);
  const entries = getSpeechEntries(hunt);
  let existingManifest = null;

  try {
    existingManifest = await loadJson(manifestPath);
  } catch {
    existingManifest = null;
  }

  const normalizedManifest = normalizeManifest(
    existingManifest,
    hunt.steps.map((step) => step.id),
  );

  if (!BLOB_TOKEN || !GEMINI_API_KEY) {
    log("skipping speech sync because required env vars are missing", {
      missingBlobToken: !BLOB_TOKEN,
      missingGeminiApiKey: !GEMINI_API_KEY,
    });

    await writeFile(
      manifestPath,
      `${JSON.stringify(normalizedManifest, null, 2)}\n`,
      "utf8",
    );
    return;
  }

  const nextManifest = {
    audioEncoding: "WAV",
    event: {
      done: null,
      intro: null,
    },
    generatedAt: new Date().toISOString(),
    provider: "gemini",
    steps: {},
  };

  for (const entry of entries) {
    const hash = buildEntryHash(entry.prompt);
    const currentEntry =
      entry.kind === "event"
        ? normalizedManifest.event[entry.manifestKey]
        : normalizedManifest.steps[entry.manifestKey];

    if (currentEntry?.hash === hash && currentEntry.url) {
      log("reusing cached speech asset", {
        id: entry.id,
        url: currentEntry.url,
      });

      if (entry.kind === "event") {
        nextManifest.event[entry.manifestKey] = currentEntry;
      } else {
        nextManifest.steps[entry.manifestKey] = currentEntry;
      }

      continue;
    }

    log("generating speech asset", { id: entry.id });

    const audioBuffer = await synthesizeWithGemini(entry.prompt);
    const blobPath = `speech/${entry.slug}-${hash}.wav`;
    const blob = await put(blobPath, audioBuffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: "audio/wav",
      token: BLOB_TOKEN,
    });

    const manifestEntry = {
      hash,
      url: blob.url,
    };

    if (entry.kind === "event") {
      nextManifest.event[entry.manifestKey] = manifestEntry;
    } else {
      nextManifest.steps[entry.manifestKey] = manifestEntry;
    }
  }

  await writeFile(
    manifestPath,
    `${JSON.stringify(nextManifest, null, 2)}\n`,
    "utf8",
  );

  await cleanupUnusedSpeechBlobs(nextManifest);
}

main().catch((error) => {
  console.error("[speech:sync] failed", error);
  process.exitCode = 1;
});
