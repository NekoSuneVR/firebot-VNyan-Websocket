import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

// Define the parameters for the script
interface Params {
  message: string;
  wsPort: number;
  rewardId: string;
}

// Define the Firebot custom script
const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "VNyan WebSocket Control",
      description: "Send commands to VNyan through WebSocket upon Twitch Channel Reward redemption",
      author: "NekoSuneVR",
      version: "1.0.0",
      firebotVersion: "5", // Specify Firebot version compatibility
    };
  },

  // Default parameters with message, custom port, and reward ID for Twitch channel rewards
  getDefaultParameters: () => {
    return {
      message: {
        type: "string",
        default: "",
        description: "VNyan Command",
        secondaryDescription: "The VNyan WebSocket command (e.g., MMD_Stay)",
      },
      wsPort: {
        type: "number",
        default: 8000,
        description: "WebSocket Port",
        secondaryDescription: "The port used to connect to VNyan WebSocket",
      },
      rewardId: {
        type: "string",
        default: "",
        description: "Twitch Channel Reward ID",
        secondaryDescription: "ID of the Twitch channel reward that triggers the action",
      },
    };
  },

  // Main function that runs when the script is triggered
  run: (runRequest) => {
    const { logger, twitch, websocket } = runRequest.modules;
    const { message, wsPort, rewardId } = runRequest.parameters;

    // Set up the WebSocket connection
    let socket: WebSocket | null = null;

    const connectWebSocket = () => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        socket = new WebSocket(`ws://localhost:${wsPort}/vnyan`);

        // On WebSocket connection
        socket.onopen = () => {
          logger.info(`Connected to VNyan on port ${wsPort}`);
          
          // Send the VNyan command as a structured JSON message
          const vnyanMessage = {
            command: message, // Use the parameter value (e.g., "MMD_Stay")
            data: {} // Any extra data required by VNyan (empty here)
          };

          // Send the command to VNyan
          socket.send(JSON.stringify(vnyanMessage));
          logger.info(`Sent message: ${JSON.stringify(vnyanMessage)}`);
        };

        // Log WebSocket disconnection
        socket.onclose = () => {
          logger.error(`Disconnected from VNyan on port ${wsPort}`);
        };

        // Log WebSocket errors
        socket.onerror = (error) => {
          logger.error(`Error in VNyan WebSocket: ${error}`);
        };
      }
    };

    // Listen for Twitch channel rewards being redeemed
    twitch.onChannelPointReward(redemption => {
      if (redemption.rewardId === rewardId) {
        logger.info(`Twitch reward ${rewardId} redeemed. Sending command to VNyan.`);
        connectWebSocket();  // Trigger the WebSocket connection when reward is redeemed
      }
    });

    // If there's no reward ID, connect immediately and send the message
    if (!rewardId) {
      connectWebSocket();
    }
  },
};

export default script;
