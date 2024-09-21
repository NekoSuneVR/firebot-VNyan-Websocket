import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import * as WebSocket from "ws";

// Define the parameters for the script
interface Params {
  message: string;
  wsPort: number;
}

// Define the Firebot custom script
const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "VNyan WebSocket Control",
      description:
        "Send commands to VNyan through WebSocket upon Twitch Channel Reward redemption",
      author: "NekoSuneVR",
      version: "1.0.0",
      firebotVersion: "5"
    };
  },

  getDefaultParameters: () => {
    return {
      message: {
        type: "string",
        default: "",
        title: "VNyan Command",
        description: "VNyan WebSocket command (e.g., MMD_Stay)",
        secondaryDescription: "The VNyan WebSocket command to be sent"
      },
      wsPort: {
        type: "number",
        default: 8000,
        title: "WebSocket Port",
        description: "The port used to connect to VNyan WebSocket",
        secondaryDescription: "The port VNyan WebSocket listens to"
      }
    };
  },

  run: ({ parameters, modules }) => {
    const { logger } = modules;
    const { message, wsPort } = parameters;
    logger.info("VNyan WebSocket Control script started.");

    let socket: WebSocket | null = null;

    const connectWebSocket = () => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        logger.debug("Attempting to connect to VNyan WebSocket...");

        socket = new WebSocket(`ws://localhost:${wsPort}/vnyan`);

        socket.on('open', () => {
          logger.info(`Connected to VNyan on port ${wsPort}`);
          socket.send(message);
          socket.close()
        });

        socket.on('close', () => {
          logger.error(`Disconnected from VNyan on port ${wsPort}`);
        });

        socket.on('error', (error) => {
          logger.error(`Error in VNyan WebSocket: ${JSON.stringify(error, null, 2)}`);
        });
      } else {
        logger.debug("WebSocket is already open. No new connection needed.");
      }
    };

    connectWebSocket();
  }
};

export default script;