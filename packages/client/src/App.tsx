import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ChatBot from "./components/chat/ChatBot";
import { Layout } from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<ChatBot />} /> */}
        <Route path="/" element={<Layout />}>
          <Route index element={<div className="conversation-area">Select a chat to begin.</div>} />
          <Route path="/chat/:chatThreadID" element={<ChatBot />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

// {
//     "chatThreadID":"955f6739-2da5-4f87-a297-e4320fed7744",
//     "prompt": "Hi"
// }
