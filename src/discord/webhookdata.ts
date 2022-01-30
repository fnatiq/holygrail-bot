import { Client, MessageEmbed } from 'discord.js';
import {
  numMinutesCache,
  priceHLYperONE,
  priceHLYperUSD,
  priceONEperUSD,
} from '../replies/price.command';
import {
  DISCORD_REALTIME_CHANNEL_ID,
  DISCORD_REALTIME_CHANNEL_WEBHOOK_ID,
  DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN,
} from '../secrets';

const username = 'HolyGrail Data';
const avatarUrl =
  'https://sea2.discourse-cdn.com/business7/user_avatar/talk.harmony.one/holygrail/240/6010_2.png';

export const updateRealtimeChannelPriceData = async (discordClient: Client) => {
  try {
    const realtimeChannel = discordClient.channels.cache.get(
      DISCORD_REALTIME_CHANNEL_ID
    );
    if (realtimeChannel) {
      const webhook = await realtimeChannel.client.fetchWebhook(
        DISCORD_REALTIME_CHANNEL_WEBHOOK_ID,
        DISCORD_REALTIME_CHANNEL_WEBHOOK_TOKEN
      );

      try {
        let embedMessage = await getEmbedMessage();
        const priceMessage = await webhook.send({
          username: username,
          avatarURL: avatarUrl,
          embeds: embedMessage,
        });
        const priceMessageId = priceMessage.id;

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
      } catch (embedMessageErr) {
        console.log('fetching embed message error');
        console.log(embedMessageErr);
      }
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
          : `1 HLY = **${priceHLYperONE.toFixed(numDecimalPlaces)}** ONE
          1 ONE = **$${priceONEperUSD.toFixed(
            numDecimalPlaces
          )}** (WONE-1USDC pair)
          1 HLY = **$${priceHLYperUSD.toFixed(numDecimalPlaces)}**`
      )
      .setAuthor({
        name: 'Token Prices',
        iconURL:
          'https://sea2.discourse-cdn.com/business7/user_avatar/talk.harmony.one/holygrail/240/6010_2.png',
      })
      .setColor('#b99d5d'),
  ];
};
