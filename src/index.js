///stable version with TimeStamp
require("dotenv").config();
const {
  Client,
  Intents,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
} = require("discord.js");
const axios = require("axios");

const axiosInstance = axios.create({
  headers: { "X-Riot-Token": process.env.RIOT_API_KEY },
});

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

const commands = [
  {
    name: "mt",
    description: "Get match history for a summoner",
    type: 1,
    options: [
      {
        name: "summoner_name",
        description: "The summoner's name",
        type: 3, // STRING
        required: true,
      },
      {
        name: "summoner_tag",
        description: "The summoner's tag (maximum 5 characters)",
        type: 3, // STRING
        required: true,
        validate: (value) => value.trim().length <= 5,
      },
    ],
  },
  {
    name: "h",
    description: "Get help on how to use the bot",
    type: 1,
  },
  {
    name: "help",
    description: "Get help on how to use the bot",
    type: 1,
  },
];

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (
    !process.env.RIOT_API_KEY ||
    !process.env.DISCORD_BOT_TOKEN ||
    !process.env.CLIENT_ID ||
    !process.env.GUILD_ID
  ) {
    console.error(
      "One or more required environment variables are not defined."
    );
    process.exit(1); // Terminate the application
  }

  if (interaction.commandName === "mt") {
    const summonerName = interaction.options.getString("summoner_name");
    const summonerTag = interaction.options.getString("summoner_tag");

    if (summonerName.trim() && summonerTag.trim()) {
      console.log("Summoner Name:", summonerName);
      console.log("Summoner Tag:", summonerTag);

      const summonerPUIID = await getSummonerPUIID(summonerName, summonerTag);
      const summonerId = await getSummonerId(summonerPUIID);
      const matchIds = await getMatchIds(summonerPUIID);

      const rankedInfo = await getRankedInfo(summonerId);

      const embed = new MessageEmbed()
        .setTitle(`Match History for ${summonerName}`)
        .setColor("RANDOM")
        .setAuthor({
          name: client.user.username,
          iconURL:
            "https://media.discordapp.net/attachments/1199318735849279639/1200422612346618006/1fdf2b6eefddee6ccdc9369d38496f96.webp?ex=65c61fad&is=65b3aaad&hm=57d818a7bad1b4df38cd874f89691c0a62cda99b23a41840dedc909a357e9a35&=&format=webp",
          url: "https://github.com/AKL001",
        })
        .setFooter({
          text: "Made By AKL001",
          iconURL:
            "https://media.discordapp.net/attachments/1199318735849279639/1200425150772940840/133284045.png?ex=65c6220a&is=65b3ad0a&hm=c5beca84ed66046683f21e8fcb0356e6426b0f9322060ba2fd3493bd8db4a398&=&format=webp&quality=lossless",
        });

      if (rankedInfo.length > 0) {
        const soloQueueInfo = rankedInfo.find(
          (entry) => entry.queueType === "RANKED_SOLO_5x5"
        );
        if (soloQueueInfo) {
          const { tier, rank, leaguePoints: lp, wins, losses } = soloQueueInfo;
          const winRate = Math.min(
            100,
            Math.round((wins / (wins + losses)) * 100)
          );

          embed.addFields(
            {
              name: "***Ranked Solo***",
              value: `⚔️${tier} ${rank} ${lp} LP⚔️`,
              inline: false,
            },
            {
              name: "***Win Rate***",
              value: `${winRate}% (${wins}W - ${losses}L)📈`,
              inline: false,
            }
          );
        }
      } else {
        embed.addFields({
          name: "Ranked Solo",
          value: "No ranked information available",
          inline: false,
        });
      }

      const matchDetails = await Promise.all(
        matchIds.map(async (matchId) => getMatchDetails(matchId, summonerPUIID))
      );

      const matchFields = matchDetails.map((details, count) => {
        const {
          matchType,
          championName,
          championgamelvl,
          totalCS,
          kills,
          deaths,
          assists,
          winOrLose,
          duration,
          matchDate,
        } = details;

        return {
          name: `Match ${count + 1}: ${matchType}`,
          value: `\`\`\`Champion: ${championName}\nKDA: ${kills}/${deaths}/${assists}\nDuration: ${Math.floor(
            duration / 60
          )}m ${
            duration % 60
          }s\nChampion Level: ${championgamelvl}\nCS: ${totalCS}\nResult: ${
            winOrLose ? "Victory" : "Defeat"
          }\nDate: ${matchDate}\`\`\``,
          inline: true,
        };
      });

      embed.addFields(matchFields);

      const linkButton = new MessageButton()
        .setLabel("Visit OP.GG") // Change the label to whatever you want
        .setStyle("LINK") // Use 'LINK' for a button that opens a link
        .setURL(
          `https://www.op.gg/summoners/euw/${encodeURIComponent(
            summonerName
          )}-${summonerTag}`
        );

      const row = new MessageActionRow().addComponents(linkButton);

      // Use interaction.reply to create the initial reply
      const initialMessage = await interaction.reply({
        content: `Summoner information for <@${interaction.user.id}>`,
        embeds: [embed],
        components: [row],
      });
    } else {
      interaction.reply(
        "Incorrect command format. Try using: `/mt <summonerName> <summonerTag>` "
      );
      interaction.reply("Summoner tag must be a maximum of 6 characters.");
    }
  } else if (
    interaction.commandName === "help" ||
    interaction.commandName === "h"
  ) {
    const usageInfo =
      "To use LOL-States, follow the format:\n`/mt <summonerName> <summonerTag>`";
    const moreHelpInfo = "For additional assistance, type:\n`/help` or `/h`";
    interaction.reply(
      `🤖 **Command Usage:**\n${usageInfo}\n\nℹ️ **Need More Help:**\n${moreHelpInfo}`
    );
  }
});

async function getSummonerPUIID(summonerName, summonerTag) {
  const summonerPUIIDfetch = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    summonerName
  )}/${summonerTag}`;
  const ConvertSumGamenameToPUIID = await axiosInstance.get(summonerPUIIDfetch);
  return ConvertSumGamenameToPUIID.data.puuid;
}

async function getSummonerId(summonerPUIID) {
  const summonerIdfetch = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${summonerPUIID}`;
  const ConvertPUIIDToSumId = await axiosInstance.get(summonerIdfetch);
  return ConvertPUIIDToSumId.data.id;
}

async function getMatchIds(summonerPUIID) {
  const MatchRegion = "europe";
  const matchHistoryUrl = `https://${MatchRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerPUIID}/ids?start=0&count=6`;
  const matchHistoryResponse = await axiosInstance.get(matchHistoryUrl);
  return matchHistoryResponse.data;
}

async function getRankedInfo(summonerId) {
  const rankedInfoUrl = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
  const rankedInfoResponse = await axiosInstance.get(rankedInfoUrl);
  return rankedInfoResponse.data;
}

async function getMatchDetails(matchId, summonerPUIID) {
  const MatchRegion = "europe";
  const matchDetailsUrl = `https://${MatchRegion}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
  const matchDetailsResponse = await axiosInstance.get(matchDetailsUrl);
  const matchDetails = matchDetailsResponse.data;
  const matchType = matchDetails.info.gameMode;
  const participantData = matchDetails.info.participants.find(
    (participant) => participant.puuid === summonerPUIID
  );

  const gameCreationTimestamp = matchDetails.info.gameCreation;

  if (!gameCreationTimestamp) {
    console.error("Invalid game creation timestamp:", gameCreationTimestamp);
    throw new Error("Invalid game creation timestamp");
  }

  const matchDate = new Date(gameCreationTimestamp);
  matchDate.setTime(
    matchDate.getTime() + matchDate.getTimezoneOffset() * 60 * 1000
  );

  if (isNaN(matchDate.getTime())) {
    console.error("Invalid date:", matchDate);
    throw new Error("Invalid date");
  }

  const options = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/London",
  };
  // ading gameEndTimestamp the

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    matchDate
  );

  return {
    matchType,
    championName: participantData.championName,
    championgamelvl: participantData.champLevel,
    totalCS:
      participantData.totalMinionsKilled + participantData.neutralMinionsKilled,
    kills: participantData.kills,
    deaths: participantData.deaths,
    assists: participantData.assists,
    winOrLose:
      matchDetails.info.teams.find(
        (team) => team.teamId === participantData.teamId
      )?.win || false,
    duration: matchDetails.info.gameDuration,
    matchDate: formattedDate, // Updated format with AM/PM
  };
}

client.login(process.env.DISCORD_BOT_TOKEN);

