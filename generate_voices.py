from elevenlabs.client import ElevenLabs
import os

# YOUR API KEY
client = ElevenLabs(api_key="sk_fb7980550da2f948542c467fb22ed670600652c7bed95c97")

voice_id = "JBFqnCBsd6RMkjVDRZzb"  # strong male narration voice
model_id="eleven_multilingual_v2"

vibe_lines = {
    "focus": [
        "Deep work now, big results later.",
        "One task. Full focus. Finish strong.",
        "Consistency beats intensity every time.",
        "Your attention is your superpower.",
        "Small focused steps build empires."
    ],
    "confidence": [
        "You are capable, prepared, and improving daily.",
        "You belong in every room your goals lead to.",
        "Trust your work. Trust your growth.",
        "Your effort is proof of your future.",
        "Walk in like you already earned it."
    ],
    "energy": [
        "Bring energy first, and momentum follows.",
        "You're built for this rep — go again.",
        "Let's move. Let's execute. Let's win.",
        "High standards, high output, high confidence.",
        "Today is a great day to go all in."
    ],
    "calm": [
        "Calm mind, clear plan, powerful execution.",
        "Breathe. Slow is smooth, smooth is fast.",
        "You don't need panic to make progress.",
        "You are safe, steady, and in control.",
        "Peace creates precision."
    ]
}

# create main folder
os.makedirs("voices", exist_ok=True)

for category, lines in vibe_lines.items():
    
    folder = f"voices/{category}"
    os.makedirs(folder, exist_ok=True)

    for i, line in enumerate(lines):

        print(f"Generating: {category} -> {line}")

        audio = client.text_to_speech.convert(
            text=line,
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128"
        )

        file_path = f"{folder}/{category}_{i+1}.mp3"

        with open(file_path, "wb") as f:
            for chunk in audio:
                f.write(chunk)

print("✅ All voice lines generated.")