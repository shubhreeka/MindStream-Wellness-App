// MindStream wellness chat: a rule-based companion that runs entirely in the browser.
// It recognises a few common topics (stress, anxiety, low mood, sleep...) and replies with
// simple, evidence-informed self-care suggestions. It is NOT a therapist or a crisis service.
document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    const HELPLINE = "If you are in danger or thinking about harming yourself, please reach out now: " +
        "<strong>Tele-MANAS 14416</strong> (free, 24x7, India) or emergency services <strong>112</strong>. " +
        "You don't have to go through this alone.";

    // Checked in order; the first matching topic answers.
    const TOPICS = [
        { name: "crisis", words: ["suicide", "kill myself", "end my life", "self harm", "self-harm", "hurt myself", "want to die", "no reason to live"],
          replies: [HELPLINE] },
        { name: "greeting", words: ["hello", "hi", "hey", "good morning", "good evening"],
          replies: ["Hi! I'm the MindStream wellness companion. How are you feeling today?",
                    "Hello! Tell me a little about how your day is going."] },
        { name: "anxious", words: ["anxious", "anxiety", "panic", "nervous", "worried", "worry", "overthink"],
          replies: ["That sounds uncomfortable. Try box breathing: breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 4 times.",
                    "Let's ground you with 5-4-3-2-1: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell and 1 you taste."] },
        { name: "stressed", words: ["stress", "stressed", "pressure", "overwhelmed", "exam", "deadline", "workload"],
          replies: ["When everything feels like a lot, pick just one small task and do only that for 25 minutes, then take a 5-minute break.",
                    "Stress often eases when it's written down. List what's on your mind, then circle the one thing you can act on today."] },
        { name: "sad", words: ["sad", "down", "lonely", "alone", "depressed", "cry", "upset", "hopeless"],
          replies: ["I'm sorry you're feeling this way. Talking to someone you trust, even briefly, can really help. Is there someone you could message today?",
                    "Be gentle with yourself today. A short walk outside or some sunlight can lift your mood a little. Would you like a meditation suggestion?"] },
        { name: "tired", words: ["tired", "sleep", "insomnia", "exhausted", "can't sleep", "cant sleep", "fatigue"],
          replies: ["For better sleep, try keeping screens away for 30 minutes before bed and going to bed at the same time each night.",
                    "If your mind races at night, try a body scan: relax each part of your body slowly from your toes to your head."] },
        { name: "angry", words: ["angry", "anger", "frustrated", "annoyed", "irritated"],
          replies: ["Anger is a normal feeling. Before reacting, try taking 10 slow breaths or stepping away for a few minutes."] },
        { name: "happy", words: ["happy", "great", "good", "excited", "awesome", "fine"],
          replies: ["That's wonderful to hear! Noting down one thing you're grateful for helps good days stick.",
                    "Love that! Keep the momentum going and maybe share that energy with a friend today."] },
        { name: "meditate", words: ["meditate", "meditation", "breathe", "breathing", "calm", "relax"],
          replies: ["Visit the <a href=\"recipe.html\">Meditate With Us</a> page for guided sessions. Even 5 minutes of slow breathing helps."] },
        { name: "thanks", words: ["thank", "thanks", "thx"],
          replies: ["You're welcome! I'm here whenever you want to talk."] },
    ];
    const FALLBACK = ["I hear you. Could you tell me a bit more about how you're feeling: stressed, anxious, low, tired, or something else?",
                      "Thanks for sharing. Would a breathing exercise, a sleep tip or a meditation suggestion help right now?"];

    function pick(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function hasWord(text, word) {
        // whole-word match for single words ("hi" should not match "this"); substring for phrases
        if (word.includes(" ")) return text.includes(word);
        return new RegExp(`\\b${word}\\b`).test(text);
    }

    function reply(message) {
        const text = message.toLowerCase();
        const topic = TOPICS.find(t => t.words.some(w => hasWord(text, w)));
        return topic ? pick(topic.replies) : pick(FALLBACK);
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    function appendMessage(sender, html) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add(sender === "You" ? "user-msg" : "bot-msg");
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${html}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;
        appendMessage("You", escapeHtml(message));
        userInput.value = "";
        setTimeout(() => appendMessage("MindStream", reply(message)), 400);
    }

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    appendMessage("MindStream", "Hi! I'm a simple wellness companion. Tell me how you're feeling and I'll suggest something that might help. " +
        "<em>(I'm not a substitute for professional support.)</em>");
});
