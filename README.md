# Firebot VNyan Websocket Script

This code its fork of [SAMMI EXTENSION](https://ko-fi.com/s/c7898da4a9) but its Remake to make it support Firebot

Code Credits still goes towards `Swolekat` for Main Code in SAMMI

For me i Remake code make it Support Firebot Twitch BOT thats goes credits to `NekoSuneVR`

# How to install

1. Download Latest Script in [RELEASES](https://github.com/NekoSuneVR/firebot-VNyan-Websocket/releases)
2. Drag this Script in `%AppData%\Firebot\v5\profiles\Main Profile\scripts`
3. Make sure this settings turned on show gif below

![Firebot_v5_hQ6U5xyqaQ](https://github.com/user-attachments/assets/facffc55-7ab6-41d3-bc20-1b9b37c3dbf9)


then good go, can make commands/channel Points like this



Have fun :)


### Setup
1. Create a new repo based off this template (Click "Use this Template" above) or simply fork it
2. `npm install`

### Building
Dev:
1. `npm run build:dev`
- Automatically copies the compiled .js to Firebot's scripts folder.

Release:
1. `npm run build`
- Copy .js from `/dist`

### Note
- Keep the script definition object (that contains the `run`, `getScriptManifest`, and `getDefaultParameters` funcs) in the `main.ts` file as it's important those function names don't get minimized.
- Edit the `"scriptOutputName"` property in `package.json` to change the filename of the outputted script.
