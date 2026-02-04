import { action } from "./_generated/server";
import { v } from "convex/values";

// Google Cloud TTS voice mapping
const voiceMap: Record<string, { name: string; ssmlGender: string }> = {
  rachel: { name: "en-US-Studio-O", ssmlGender: "FEMALE" },
  antonio: { name: "en-US-Studio-M", ssmlGender: "MALE" },
  bella: { name: "en-US-Studio-O", ssmlGender: "FEMALE" },
  ellis: { name: "en-US-Neural2-F", ssmlGender: "FEMALE" },
  josh: { name: "en-US-Studio-Q", ssmlGender: "MALE" },
  jean: { name: "en-US-Neural2-C", ssmlGender: "FEMALE" },
};

export const generateAudio = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
    }

    const selectedVoice = voiceMap[voice.toLowerCase()] || voiceMap.rachel;

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text: input },
          voice: {
            languageCode: "en-US",
            name: selectedVoice.name,
            ssmlGender: selectedVoice.ssmlGender,
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google TTS API error: ${error}`);
    }

    const data = await response.json();

    if (!data.audioContent) {
      throw new Error("No audio content in response");
    }

    // Convert base64 to ArrayBuffer
    const binaryString = atob(data.audioContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  },
});
