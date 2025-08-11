// utils/cheatDetector.js

// This function logs cheating events
function flagCheating(userId, reason) {
  const timestamp = new Date().toISOString();
  console.log(`🚨 [Cheating Detected] User: ${userId} | Reason: ${reason} | Time: ${timestamp}`);
  
  // In a real app, you'd store this in DB or send a notification
  // Example:
  // saveCheatEventToDB({ userId, reason, timestamp });
}

// Example utility to validate paste attempts (can be extended)
function isPasteDetected(event) {
  return event?.type === 'paste';
}

module.exports = {
  flagCheating,
  isPasteDetected,
};
