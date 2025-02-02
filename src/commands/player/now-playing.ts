import type { Command } from 'src/types';

import { SlashCommandBuilder } from '@discordjs/builders';
import sessions from './sessions';
import { getTrackDurationString, getVideoDetailsWithFallback, replyWithSessionButtons } from './utils';

export const runNowPlaying: Parameters<typeof replyWithSessionButtons>[0]['run'] = async session => {
  const currentTrack = session.getCurrentTrack();
  if (!currentTrack) {
    return {
      description: 'Nothing is playing.',
      hideButtons: true,
    };
  }
  const videoDetails = await getVideoDetailsWithFallback(currentTrack);
  const duration = await getTrackDurationString(session);
  return {
    title: '🔊 Now Playing',
    description: videoDetails.title,
    link: currentTrack.link,
    footerText: duration || undefined,
  };
};

const NowPlayingCommand: Command = {
  guildOnly: true,
  slashCommandData: new SlashCommandBuilder()
    .setName('now-playing')
    .setDescription('Display the title of the track that is currently playing.'),

  runCommand: async interaction => {
    await interaction.deferReply({ ephemeral: true });
    return replyWithSessionButtons({
      interaction,
      session: sessions.get(interaction.guild!),
      run: runNowPlaying,
    });
  },
};

export default NowPlayingCommand;
