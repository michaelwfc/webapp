// export is for ES modules. If you use it, the browser requires type="module" on the script tag
// ✅ CORRECT — plain function, globally accessible

// ─────────────────────────────────────────────────────────
// STEP 1: Get references to the DOM elements we need
// document.getElementById() searches the DOM tree for the
// element with that id and returns the object.
// We store them in variables so we don't search every time.
// ─────────────────────────────────────────────────────────

const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");

// ─────────────────────────────────────────────────────────
// HELPER: addMessage(text, role)
// ─────────────────────────────────────────────────────────
function addMessage(text, role) {
  // Creates a new <div> object (not yet visible — not in DOM) bubble and appends it to chat-history.
  const bubble = document.createElement("div");
  bubble.classList.add("message"); //adds CSS classes so the bubble gets styled

  if (role === "user") {
    bubble.classList.add("user-message");
  } else {
    bubble.classList.add("bot-message");
  }

  bubble.textContent = text; //sets the visible text inside the div
  chatHistory.appendChild(bubble); //inserts the div into the DOM → now it appears on screen

  // Auto-scroll to bottom,scrolls the chat area to the bottom so new messages are visible
  chatHistory.scrollTop = chatHistory.scrollHeight;

  return bubble; // return it so we can update it later (streaming)
}

// ─────────────────────────────────────────────────────────
// MAIN FUNCTION: sendMessage()
// Called by onclick="sendMessage()" on the button
// ─────────────────────────────────────────────────────────
async function sendMessage() {
  const message = userInput.value;

  if (!message.trim()) return; // guard: don't send empty messages

  // 3. Clear the input box: setting .value = "" empties it
  userInput.value = "";

  // add user message to chathistory
  // 4. Show the user's message as a bubble on the right
  addMessage(message, "user");

  // 5. Show a "typing..." indicator while waiting for the bot
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("typing");
  typingIndicator.textContent = "Bot is Typing...";
  chatHistory.appendChild(typingIndicator);

  // 6. Create an empty bot bubble that we will fill in as tokens stream
  const botBubble = document.createElement("div");
  botBubble.classList.add("message", "bot-message");
  chatHistory.appendChild(botBubble);
  botBubble.style.display = "none"; // hide until first token arrives

  // 7. Send the message to the FastAPI backend
  // ── The streaming fetch ──────────────────────────────
  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  // 8. Remove "typing..." now that response has started
  chatHistory.removeChild(typingIndicator);
  botBubble.style.display = ""; // show the bot bubble

  // 9. Read the streaming response chunk by chunk
  //    response.body is a ReadableStream
  //    .getReader() gives us a reader object
  //    reader.read() returns the next chunk as { done, value }
  //    value is a Uint8Array (raw bytes) → TextDecoder converts to string

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break; // stream finished
    // Decode bytes → string
    const chunk = decoder.decode(value);
    // Append chunk to bot bubble
    // += appends to existing text
    botBubble.textContent += chunk; // append each token as it arrives

    // Keep scrolling to bottom as text grows
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
}

// ─────────────────────────────────────────────────────────
// BONUS: Allow pressing Enter to send (not just the button)
//
// addEventListener("keydown", fn) fires fn every time a key
// is pressed while the input is focused.
// event.key === "Enter" checks if it was the Enter key.
// ─────────────────────────────────────────────────────────
userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
