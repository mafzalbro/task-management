const WebSocket = require("ws");
const url = "ws://localhost:4000/graphql/ws";
const ws = new WebSocket(url);
ws.on("open", () => {
  console.log("open");
  ws.send(JSON.stringify({ type: "connection_init", payload: {} }));
});
ws.on("message", (msg) => {
  console.log("message", msg.toString());
  ws.close();
});
ws.on("error", (err) => {
  console.error("error", err.message);
});
ws.on("close", (code, reason) => {
  console.log("close", code, reason.toString());
});
