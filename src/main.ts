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
      author: "Swolekat",
      version: "2.1.0",
      firebotVersion: "5",
    };
  },

  getDefaultParameters: () => {
    return {
      message: {
        type: "string",
        default: "MMD_Stay",
        title: "VNyan Command",
        description: "VNyan WebSocket command (e.g., MMD_Stay)",
        secondaryDescription: "The VNyan WebSocket command to be sent",
      },
      wsPort: {
        type: "number",
        default: 8000,
        title: "WebSocket Port",
        description: "The port used to connect to VNyan WebSocket",
        secondaryDescription: "The port VNyan WebSocket listens to",
      },
      rewardId: {
        type: "string",
        default: "",
        title: "Twitch Channel Reward ID",
        description: "Twitch Channel Reward ID to trigger the WebSocket action",
        secondaryDescription: "The reward ID for triggering the VNyan command",
      },
    };
  },

  run: ({ parameters, modules }) => {
    const { logger, twitchApi } = modules;
    const { message, wsPort, rewardId } = parameters;
    logger.info("VNyan WebSocket Control script started.");
    logger.info(`Twitch API is ${twitchApi ? 'available' : 'not available'}.`);
    logger.info(`WebSocket Port: ${wsPort}.`)
    let socket: WebSocket | null = null;

    const connectWebSocket = () => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        socket = new WebSocket(`ws://localhost:${wsPort}/vnyan`);

        socket.onopen = () => {
          logger.info(`Connected to VNyan on port ${wsPort}`);

          const vnyanMessage = {
            command: message,
            data: {},
          };

          socket.send(JSON.stringify(vnyanMessage));
          logger.info(`Sent message: ${JSON.stringify(vnyanMessage)}`);
        };

        socket.onclose = () => {
          logger.error(`Disconnected from VNyan on port ${wsPort}`);
        };

        socket.onerror = (error) => {
          logger.error(`Error in VNyan WebSocket: ${error}`);
        };
      }
    };
    

    if (twitchApi && typeof twitchApi.channelRewards.getManageableCustomChannelRewards === 'function') {
      twitchApi.channelRewards.getManageableCustomChannelRewards().then((rewards) => {
        logger.info(`${rewards}`);
        if (rewards) {
          rewards.forEach((reward) => {
            logger.info(`${reward}`);
            if (reward.id === rewardId) {
              logger.info(`Twitch reward ${rewardId} redeemed. Sending command to VNyan.`);
              connectWebSocket(); // Trigger the WebSocket connection when reward is redeemed
            }
          });
        }
      });
    }

    if (!rewardId) {
      connectWebSocket(); // If there's no reward ID, connect immediately and send the message
    }
  },
};

export default script;