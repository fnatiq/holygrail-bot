import { Client, MessageEmbed } from 'discord.js';
import {
  numMinutesCache,
  priceHLYperONE,
  priceHLYperUSD,
  priceONEperUSD,
} from '../replies/price.command.js';
import 'dotenv/config'

let DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
let DISCORD_REALTIME_CHANNEL_ID = process.env.DISCORD_REALTIME_CHANNEL_ID;
let DISCORD_REALTIME_CHANNEL_WEBHOOK_ID = process.env.DISCORD_REALTIME_CHANNEL_WEBHOOK_ID;
let DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN = process.env.DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN;
let DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID = process.env.DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID;

const username = 'HolyGrail Data';
const avatarUrl = 'https://holygrail.one/holygrail.png';

export const updateRealtimeChannelPriceData = async (discordClient: Client) => {
  try {
    const realtimeChannel = discordClient.channels.cache.get(
      DISCORD_REALTIME_CHANNEL_ID!
    );
    if (realtimeChannel) {
      const webhook = await realtimeChannel.client.fetchWebhook(
        DISCORD_REALTIME_CHANNEL_WEBHOOK_ID!,
        DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN
      );

      // try {
      //   let embedMessage = await getEmbedMessage();
      //   const priceMessage = await webhook.send({
      //     username: username,
      //     avatarURL: avatarUrl,
      //     embeds: embedMessage,
      //   });
      //   const priceMessageId = priceMessage.id;

      const priceMessageId = DISCORD_REALTIME_CHANNEL_WEBHOOK_MESSAGE_ID!;

      (async () => {
        while (true) {
          try {
            let embedMessage = await getEmbedMessage();
            webhook.editMessage(priceMessageId, {
              embeds: embedMessage,
            });

            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * 60 * numMinutesCache)
            );
          } catch (err) {
            console.log('webhook edit message error');
            console.log(err);
          }
        }
      })();
      // } catch (embedMessageErr) {
      //   console.log('fetching embed message error');
      //   console.log(embedMessageErr);
      // }
    }
  } catch (err) {
    console.log('webhook error');
    console.log(err);
  }
};

const numDecimalPlaces = 7;
const getEmbedMessage = async (): Promise<MessageEmbed[]> => {
  return [
    new MessageEmbed()
      .setDescription(
        priceHLYperONE === 0 || priceONEperUSD === 0 || priceHLYperUSD === 0
          ? 'Fetching prices...'
          : `1 HLY = **${priceHLYperONE.toFixed(
              numDecimalPlaces
            )}** ONE (**$${priceHLYperUSD.toFixed(numDecimalPlaces)}**)
1 ONE = **$${priceONEperUSD.toFixed(numDecimalPlaces)}** (WONE-1USDC pair)

Updated every **1** minute`
      )
      .setAuthor({
        name: 'Token Prices',
        iconURL: 'https://holygrail.one/holygrail.png',
      })
      .setColor('#b99d5d'),
  ];
};
