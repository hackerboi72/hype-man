from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os

load_dotenv()

elevenlabs = ElevenLabs(
  api_key=("sk_fb7980550da2f948542c467fb22ed670600652c7bed95c97"),
)

audio = elevenlabs.text_to_speech.convert(
    text="Who dares, wins.",
    voice_id="JBFqnCBsd6RMkjVDRZzb",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)

play(audio)

