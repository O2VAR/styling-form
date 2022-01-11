
import {Album, Artist, Track} from '@app/model';
import {CoreUtils} from '@app/core/core.utils';

export class LibraryUtils {

  static fixTags(track: Track): Track {
    if (track.title === undefined || track.title === '') {
      const components = track.url.split('/');
      track.title = components[components.length - 1];
      // track.warn = true;
    }
    if (track.albumArtist === undefined || track.albumArtist === '') {
      track.albumArtist = track.artist || 'Unknown Album Artist';
      // track.warn = true;
    }
    if (track.artist === undefined || track.artist === '') {
      track.artist = 'Unknown Artist';
      // track.warn = true;
    }
    if (track.album === undefined || track.album === '') {
      track.album = 'Unknown Album';
      // track.warn = true;
    }
    if (track.coverUrl) {
      track.coverUrl = CoreUtils.resolveUrl(encodeURI(track.coverUrl));
    }
    return track;
  }

  static extractArtists(tracks: Track[]): Artist[] {
    const artists: Artist[] = [];
    tracks.forEach(track => {
      const artist = track.albumArtist;
      const artistIndex = artists.findIndex(a => a.name === artist);
      if (artistIndex === -1) {
        const newArtist: Artist = {name: artist, songs: 1};
        // if (track.warn) { newArtist.warn = true; }
        if (track.coverUrl) { newArtist.avatarUrl = track.coverUrl; }