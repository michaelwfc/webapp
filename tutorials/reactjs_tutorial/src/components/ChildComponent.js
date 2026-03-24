// every JSX file needs this at the top
import React from "react";

// Child (function component)
function ChildComponent({ onSendMessage }) {
  // destructure the prop directly
  return (
    <div>
      <h3>Child</h3>
      {/* Step 3 — call it with data */}
      <button onClick={() => onSendMessage("Hello from child!")}>
        Send message to parent
      </button>
    </div>
  );
}

export default ChildComponent;
