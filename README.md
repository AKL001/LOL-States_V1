# 🕹️ LOL-States_V1 🤖

LOL-States_V1 is a Discord bot that fetches data from the League of Legends [API](https://developer.riotgames.com/apis) to provide detailed information about a player's recent matches and current rank. It displays the last 6 games (configurable) with champion played, KDA, match duration, CS, result, and date. It also shows the player's current Solo/Duo rank, LP, and win rate.


## Features ✨

- 🏅 **Display the last 6 games played by a player**
  - 🛡️ Champion played
  - ⚔️ KDA (Kill/Death/Assist)
  - ⏲️ Match duration
  - 🧹 CS (Creep Score)
  - ✅❌ Match result (Win/Loss)
  - 📅 Date of the match
- 🎖️ **Show the player's current Solo/Duo rank and LP**
- 📊 **Show the player's win rate**

## Commands 🛠️

- `/mt <summoner_name> <summoner_tag>`: Displays the last 6 games played by the specified player, along with the *current Solo/Duo rank and LP*.
- `/h OR /help`: Shows the available commands and usage information.

## Getting Started 🚀

### Prerequisites 📋

- [Node.js](https://nodejs.org/) ![Node.js](https://img.icons8.com/color/48/000000/nodejs.png)
- [Discord.js](https://discord.js.org/) ![Discord.js](https://img.icons8.com/color/48/000000/discord-logo.png)
- [Riot Games API Key](https://developer.riotgames.com/) 🏆

### Installation 💻

1. Clone the repository:
    ```sh
    git clone https://github.com/AKL001/LOL-States_V1.git
    ```

2. Navigate to the project directory:
    ```sh
    cd LOL-States_V1
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

4. Create a `.env` file in the root directory and add your Discord bot token, Riot Games API key, client ID, and guild ID (see Required Information below 👇):
    ```sh
    DISCORD_BOT_TOKEN = your_discord_bot_token
    RIOT_API_KEY = your_riot_games_api_key
    CLIENT_ID = your_discord_bot_client_id
    GUILD_ID = your_discord_server_id
    ```

5. Run the bot:
    ```sh
    node index.js
    ```
## Folder Structure 📂

```plaintext
LOL-States_V1/
├── node_modules/
├── src/
│   └── index.js
├── .env
├── package.json
├── README.md
```
### How to Get the Required Information ℹ️

- **DISCORD_TOKEN**: Obtain this from the [Discord Developer Portal](https://discord.com/developers/applications). Create a new application, then go to the "Bot" section to create a bot and get the token.
- **RIOT_API_KEY**: Obtain this from the [Riot Games Developer Portal](https://developer.riotgames.com/). Sign up and create a new API key.
- **CLIENT_ID**: This is the Bot ID, which can be found in the "General Information" section of your application in the Discord Developer Portal.
- **GUILD_ID**: This is the ID of your Discord server. You can find this by right-clicking your server name in Discord and selecting "Copy ID" (you need to enable Developer Mode in Discord settings to see this option).

## Usage 🎮

Invite the bot to your Discord server using the bot invite link and use the commands mentioned above to fetch the player data.

## Contributing 🤝

Contributions are welcome! Please fork the repository and create a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

## License 📜

This project is licensed under the MIT License - see the [MIT LICENSE](LICENSE) file for details.

## Acknowledgements 🙌

- [Discord.js](https://discord.js.org/) ![Discord.js](https://img.icons8.com/color/48/000000/discord-logo.png)
- [Riot Games API](https://developer.riotgames.com/) 🏆
- [Node.js](https://nodejs.org/) ![Node.js](https://img.icons8.com/color/48/000000/nodejs.png)

## Contact 📧

For any inquiries, please contact me at [akarimlabib@gmail.com](akarimlabib@gmail.com).

---

*LOL-States_V1* is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
