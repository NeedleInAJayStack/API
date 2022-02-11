export default function backendUrl() {
  if (process.env.NODE_ENV == 'production') {
    return ""; // Fetch defaults to using the window's current address (window.host), so just short-circuit.
  }
  else {
    return "http://localhost:8079";
  }
}