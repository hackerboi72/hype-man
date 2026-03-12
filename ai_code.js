// THIS IS JUST FOR TESTING PURPOSES, NOT FOR PRODUCTION USE
// DO NOT EXPOSE YOUR API KEY IN PRODUCTION CODE

/* OLD VIBELINES RESTORED */

const vibeLines = {
  focus: [
    "Deep work now, big results later.",
    "One task. Full focus. Finish strong.",
    "Consistency beats intensity every time.",
    "Your attention is your superpower.",
    "Small focused steps build empires."
  ],
  confidence: [
    "You are capable, prepared, and improving daily.",
    "You belong in every room your goals lead to.",
    "Trust your work. Trust your growth.",
    "Your effort is proof of your future.",
    "Walk in like you already earned it."
  ],
  energy: [
    "Bring energy first, and momentum follows.",
    "You're built for this rep — go again.",
    "Let's move. Let's execute. Let's win.",
    "High standards, high output, high confidence.",
    "Today is a great day to go all in."
  ],
  calm: [
    "Calm mind, clear plan, powerful execution.",
    "Breathe. Slow is smooth, smooth is fast.",
    "You don't need panic to make progress.",
    "You are safe, steady, and in control.",
    "Peace creates precision."
  ]
};

const famousQuotes = [
  { text: "The supreme art of war is to subdue the enemy without fighting.", author: "Sun Tzu" },
  { text: "If an injury has to be done to a man it should be so severe that his vengeance need not be feared.", author: "Niccolò Machiavelli" },
  { text: "Everything in war is simple, but the simplest thing is difficult.", author: "Carl von Clausewitz" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" }
];

const lifeAdvice = {
  power: [
    "Never outshine the master. Make superiors feel secure while you build leverage.",
    "Conceal your intentions until your position is strong.",
    "Guard your reputation as if it were capital.",
    "Plan all the way to the end before the first move."
  ],
  seduction: [
    "Create mystery and curiosity; people value what they must pursue.",
    "Master your own emotions before trying to move someone else's.",
    "Presence and listening are often more persuasive than force.",
    "The strongest attraction is confidence without neediness."
  ],
  subtle: [
    "Choose your struggles carefully; not every problem deserves your energy.",
    "Responsibility is freedom: own your choices and their outcomes.",
    "Discomfort is often the price of growth, not a sign to quit.",
    "Values decide direction; feelings follow action."
  ]
};

const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
};

let currentVibe = "focus";
let currentAdviceSource = "power";

const hypeText = document.getElementById("hypeText");
const voiceState = document.getElementById("voiceState");
const vibeButtons = document.querySelectorAll(".chip[data-vibe]");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteBtn = document.getElementById("quoteBtn");
const adviceText = document.getElementById("adviceText");
const adviceBtn = document.getElementById("adviceBtn");
const adviceChips = document.querySelectorAll(".advice-chip");

const hypeBtn = document.getElementById("hypeBtn");
const speakBtn = document.getElementById("speakBtn");
const stopBtn = document.getElementById("stopBtn");
const goalForm = document.getElementById("goalForm");
const goalInput = document.getElementById("goalInput");
const savedGoal = document.getElementById("savedGoal");
const sessionCount = document.getElementById("sessionCount");
const streakCount = document.getElementById("streakCount");
const exerciseForm = document.getElementById("exerciseForm");
const exerciseInput = document.getElementById("exerciseInput");
const exerciseList = document.getElementById("exerciseList");
const workForm = document.getElementById("workForm");
const workInput = document.getElementById("workInput");
const workList = document.getElementById("workList");
const rewardText = document.getElementById("rewardText");

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomLine(vibe) {
  const base = vibeLines[vibe] || vibeLines.focus;
  const custom = storage.get("hype-custom-lines", []);
  return randomItem([...base, ...custom]);
}

function setRandomQuote() {
  const q = randomItem(famousQuotes);
  quoteText.textContent = `"${q.text}"`;
  quoteAuthor.textContent = `— ${q.author}`;
}

function setRandomAdvice() {
  const sourceLines = lifeAdvice[currentAdviceSource] || lifeAdvice.power;
  adviceText.textContent = randomItem(sourceLines);
}

/* ELEVENLABS VOICE (same as old code) */

async function speakText(text) {

  const apiKey = "YOUR_API_KEY_HERE";
  const voiceId = "JBFqnCBsd6RMkjVDRZzb";
  const modelId = "eleven_multilingual_v2";

  try {

    voiceState.textContent = "Generating voice...";

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text.replaceAll('"', ""),
        model_id: modelId,
        voice_settings: {
          stability: 0.35,
          similarity_boost: 0.8
        }
      })
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    audio.onplay = () => voiceState.textContent = "Speaking...";
    audio.onended = () => voiceState.textContent = "Voice ready";

    audio.play();

  } catch (e) {
    console.error(e);
    voiceState.textContent = "Voice failed";
  }
}

function updateGoalView() {
  const goal = storage.get("hype-goal", "");
  savedGoal.textContent = goal ? `Today's mission: ${goal}` : "No mission saved yet.";
}

function updateStatsOnLoad() {
  sessionCount.textContent = String(storage.get("hype-sessions", 0));

  const today = new Date().toDateString();
  const lastVisit = storage.get("hype-last-visit", "");
  let streak = storage.get("hype-streak", 0);

  if (!lastVisit) streak = 1;
  else {
    const dayGap = Math.round((new Date(today) - new Date(lastVisit)) / 86400000);
    if (dayGap === 1) streak += 1;
    if (dayGap > 1) streak = 1;
  }

  storage.set("hype-last-visit", today);
  storage.set("hype-streak", streak);

  streakCount.textContent = String(streak);
}

function incrementSessions() {
  const count = storage.get("hype-sessions", 0) + 1;
  storage.set("hype-sessions", count);
  sessionCount.textContent = String(count);
}

function renderList(node, items, emptyLabel) {
  node.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = emptyLabel;
    li.className = "muted";
    node.append(li);
    return;
  }

  items.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.text} • ${entry.time}`;
    node.append(li);
  });
}

function addEntry(key, text) {
  const existing = storage.get(key, []);
  existing.unshift({
    text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  });

  storage.set(key, existing.slice(0, 20));
}

function updateReward() {
  const total =
    storage.get("hype-exercises", []).length +
    storage.get("hype-work", []).length;

  if (total === 0)
    rewardText.textContent = "Log your wins to unlock your praise.";
  else if (total < 4)
    rewardText.textContent = `Solid start. ${total} wins logged. Stay deliberate.`;
  else if (total < 8)
    rewardText.textContent = `Strong execution: ${total} wins. You're building command over your day.`;
  else
    rewardText.textContent = `Elite discipline unlocked: ${total} wins. Keep the standard high.`;
}

function refreshTrackers() {
  renderList(exerciseList, storage.get("hype-exercises", []), "No exercise logged yet.");
  renderList(workList, storage.get("hype-work", []), "No work wins logged yet.");
  updateReward();
}

hypeBtn.addEventListener("click", () => {
  hypeText.textContent = `"${getRandomLine(currentVibe)}"`;
  incrementSessions();
});

speakBtn.addEventListener("click", () => speakText(hypeText.textContent));

stopBtn.addEventListener("click", () => {
  voiceState.textContent = "Stopped";
});

vibeButtons.forEach((button) => {
  button.addEventListener("click", () => {

    vibeButtons.forEach((b) => b.classList.remove("chip--active"));
    button.classList.add("chip--active");

    currentVibe = button.dataset.vibe;

    hypeText.textContent = `"${getRandomLine(currentVibe)}"`;
    voiceState.textContent = `${currentVibe[0].toUpperCase()} ready`;

  });
});

quoteBtn.addEventListener("click", setRandomQuote);
adviceBtn.addEventListener("click", setRandomAdvice);

adviceChips.forEach((chip) => {
  chip.addEventListener("click", () => {

    adviceChips.forEach((c) => c.classList.remove("chip--active"));
    chip.classList.add("chip--active");

    currentAdviceSource = chip.dataset.source;
    setRandomAdvice();

  });
});

goalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const goal = goalInput.value.trim();
  if (!goal) return;

  storage.set("hype-goal", goal);
  updateGoalView();
  goalForm.reset();
});

exerciseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = exerciseInput.value.trim();
  if (!text) return;

  addEntry("hype-exercises", text);
  exerciseForm.reset();
  refreshTrackers();
});

workForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = workInput.value.trim();
  if (!text) return;

  addEntry("hype-work", text);
  workForm.reset();
  refreshTrackers();
});

function init() {

  updateGoalView();
  updateStatsOnLoad();
  refreshTrackers();

  setRandomQuote();
  setRandomAdvice();

  hypeText.textContent = `"${getRandomLine(currentVibe)}"`;

  voiceState.textContent = "Voice ready";
}

init();