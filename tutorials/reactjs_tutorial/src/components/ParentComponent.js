// Parent (function component)
import React, { useState } from "react";
import ChildComponent from "./ChildComponent";

export default function ParentComponent() {
  const [receivedMessage, setReceivedMessage] = useState("Nothing yet...");

  // Step 1 — define the callback
  const handleMessageFromChild = (infoFromChild) => {
    setReceivedMessage(infoFromChild);
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}
    >
      <h2>Parent</h2>
      {/* Step 2 — pass it down */}
      <ChildComponent onSendMessage={handleMessageFromChild} />
      <p>
        Message from child: <strong>{receivedMessage}</strong>
      </p>
    </div>
  );
}
