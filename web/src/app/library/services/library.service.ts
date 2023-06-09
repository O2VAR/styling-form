
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

import {Album, Artist, Playlist, Track} from '@app/model';
import {CoreUtils} from '@app/core/core.utils';
import {AudioService} from '@app/core/services/audio.service';
import {LoaderService} from '@app/core/services/loader.service';

import {AddToPlaylist, DeletePlaylist, LoadPlaylist, LoadPlaylists, RemoveFromPlaylist, SavePlaylist} from '../actions/playlists.actions';
import {DeselectAllArtists, DeselectArtist, SelectArtist, SelectArtists, SelectArtistsByIds} from '../actions/artists.actions';
import {DeselectAlbum, DeselectAllAlbums, SelectAlbum, SelectAlbums, SelectAlbumsByIds} from '../actions/albums.actions';
import {
  AddToCurrentPlaylist,
  PlayTrackNext,
  SetCurrentPlaylist,
  SetCurrentTrack,
  SetNextTrack,
  SetPreviousTrack,
  SetRepeat,
  SetShuffle
} from '../actions/player.actions';
import {AddToFavorites, RemoveFromFavorites} from '../actions/favorites.actions';
import {AddToRecent} from '../actions/recent.actions';
import {LoadTracks, ScanTracks} from '../actions/tracks.actions';

import * as fromLibrary from '../library.reducers';
import {LibraryUtils} from '../library.utils';

@Injectable()
export class LibraryService {

  constructor(
    private store: Store<fromLibrary.State>,
    private loader: LoaderService,
    private audioService: AudioService,
    private snack: MatSnackBar
  ) {
    // Load Tracks
    loader.initializing$.subscribe(initializing => {
        if (!initializing) {
          setTimeout(() => store.dispatch(new LoadTracks()), 50);
        }
      }
    );

    this.store.select(fromLibrary.getTracksError)
      .pipe(filter(error => !!error))
      .subscribe(error =>
        this.snack.open('Error retrieving tracks! ' + error, 'Retry').afterDismissed().subscribe(
          () => store.dispatch(new LoadTracks())
        )
      );

    this.audioService.getEnded().subscribe(() => this.playNextTrack());

    setTimeout(() => this.initialize());
  }

  initialize() {
    CoreUtils.restoreAndSave(
      'selectedArtistsIds',
      e => this.store.dispatch(new SelectArtistsByIds(e)),
      this.store.select(fromLibrary.getSelectedArtistsIds)
    );
    CoreUtils.restoreAndSave(
      'selectedAlbumsIds',
      e => this.store.dispatch(new SelectAlbumsByIds(e)),
      this.store.select(fromLibrary.getSelectedAlbumsIds)
    );
    CoreUtils.restoreAndSave(
      'playlist',
      e => this.store.dispatch(new SetCurrentPlaylist(e)),
      this.getPlaylist()
    );
    CoreUtils.restoreAndSave(
      'favorites',
      e => this.store.dispatch(new AddToFavorites(e)),
      this.getFavorites()
    );
    CoreUtils.restoreAndSave(
      'recent',
      e => this.store.dispatch(new AddToRecent(e)),
      this.getRecentTracks()
    );
    CoreUtils.restoreAndSave(
      'playlists',
      e => this.store.dispatch(new LoadPlaylists(e)),
      this.getPlaylists()
    );
    CoreUtils.restoreAndSave(
      'current',
      e => this.store.dispatch(new SetCurrentTrack(e)),
      this.getCurrentTrack().pipe(filter(t => !!t))
    );
    CoreUtils.restoreAndSave(
      'shuffle',
      e => this.store.dispatch(new SetShuffle(e)),
      this.getShuffle()
    );
    CoreUtils.restoreAndSave(
      'repeat',
      e => this.store.dispatch(new SetRepeat(e)),
      this.getRepeat()
    );
  }

  getAllArtists(): Observable<Artist[]> {
    return this.store.select(fromLibrary.getAllArtists);
  }

  getSelectedArtists() {
    return this.store.select(fromLibrary.getSelectedArtists);
  }

  getAllAlbums() {
    return this.store.select(fromLibrary.getAllAlbums);
  }

  getDisplayedAlbums() {
    return this.store.select(fromLibrary.getDisplayedAlbums);
  }

  getSelectedAlbums() {
    return this.store.select(fromLibrary.getSelectedAlbums);
  }

  getAllTracks(): Observable<Track[]> {
    return this.store.select(fromLibrary.getAllTracks);
  }

  getDisplayedTracks(): Observable<Track[]> {
    return this.store.select(fromLibrary.getDisplayedTracks);
  }

  getCurrentTrack(): Observable<Track> {
    return this.store.select(fromLibrary.getCurrentTrack).pipe(
      distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
    );
  }

  getShuffle() {
    return this.store.select(fromLibrary.getShuffle);
  }

  getRepeat() {
    return this.store.select(fromLibrary.getRepeat);
  }

  getAudioMuted() {
    return this.audioService.getMuted();
  }

  getAudioVolume() {
    return this.audioService.getVolume();
  }

  getAudioPlaying() {
    return this.audioService.getPlaying();
  }

  getAudioLoading() {
    return this.audioService.getLoading();
  }

  getAudioDuration() {
    return this.audioService.getDuration();
  }

  getAudioCurrentTime() {
    return this.audioService.getCurrentTime();
  }

  getPlaylist(): Observable<Track[]> {
    return this.store.select(fromLibrary.getCurrentPlaylist);
  }

  selectArtist(artist: Artist) {
    this.store.dispatch(new SelectArtist(artist));
  }

  selectArtists(artists: Artist[]) {
    this.store.dispatch(new SelectArtists(artists));
  }

  deselectArtist(artist: Artist) {
    this.store.dispatch(new DeselectArtist(artist));
  }

  deselectAllArtists() {
    this.store.dispatch(new DeselectAllArtists());
  }

  isSelectedArtist(artist: Artist): Observable<boolean> {
    return this.store.select(fromLibrary.isSelectedArtist(artist));
  }

  selectAlbum(album: Album) {
    this.store.dispatch(new SelectAlbum(album));
  }

  selectAlbums(albums: Album[]) {
    this.store.dispatch(new SelectAlbums(albums));
  }

  deselectAlbum(album: Album) {
    this.store.dispatch(new DeselectAlbum(album));
  }

  deselectAllAlbums() {
    this.store.dispatch(new DeselectAllAlbums());
  }

  isSelectedAlbum(album: Album): Observable<boolean> {
    return this.store.select(fromLibrary.isSelectedAlbum(album));
  }

  setTrack(track: Track) {
    this.store.dispatch(new SetCurrentTrack(track));
  }

  playTrack(track: Track) {
    this.setTrack(track);
  }

  play() {
    this.audioService.play();
  }

  pause() {
    this.audioService.pause();
  }

  seekTo(time: number) {
    this.audioService.seekTo(time);
  }

  playTrackNext(track: Track): void {
    this.store.dispatch(new PlayTrackNext(track));
  }

  setPlaylist(playlist: Track[]) {
    this.store.dispatch(new SetCurrentPlaylist(playlist));
  }

  addToCurrentPlaylist(tracks: Track[]) {
    this.store.dispatch(new AddToCurrentPlaylist(tracks));
  }

  clearPlaylist() {
    this.store.dispatch(new SetCurrentPlaylist([]));
  }

  playPreviousTrack() {
    this.store.dispatch(new SetPreviousTrack());
  }

  playNextTrack() {
    this.store.dispatch(new SetNextTrack());
  }

  setShuffle(value: boolean) {
    this.store.dispatch(new SetShuffle(value));
  }

  setRepeat(value: boolean) {
    this.store.dispatch(new SetRepeat(value));
  }

  setMuted(value: boolean) {
    this.audioService.setMuted(value);
  }

  setVolume(value: number) {
    this.audioService.setVolume(value);
  }

  selectInLibrary(playlist: Track[]) {
    const artistsIds = LibraryUtils.uniq(playlist.map(track => track.albumArtist));
    const albumsIds = LibraryUtils.uniq(playlist.map(track => track.albumArtist + '-' + track.album));
    this.store.dispatch(new SelectArtistsByIds(artistsIds));
    this.store.dispatch(new SelectAlbumsByIds(albumsIds));
  }

  addToFavorites(track: Track) {
    this.store.dispatch(new AddToFavorites([track]));
  }

  removeFromFavorites(track: Track) {
    this.store.dispatch(new RemoveFromFavorites(track));
  }

  isFavorite(track: Track): Observable<boolean> {
    return this.store.select(fromLibrary.isFavorite, track);
  }

  getFavorites(): Observable<Track[]> {
    return this.store.select(fromLibrary.getFavorites);
  }

  getDisplayedFavorites(): Observable<Track[]> {
    return this.store.select(fromLibrary.getDisplayedFavorites);
  }

  getFavoriteArtists(): Observable<Artist[]> {
    return this.store.select(fromLibrary.getFavoritesArtists);
  }

  getFavoriteAlbums(): Observable<Album[]> {
    return this.store.select(fromLibrary.getDisplayedFavoriteAlbums);
  }

  getRecentTracks(): Observable<Track[]> {
    return this.store.select(fromLibrary.getRecentTracks);
  }

  getDisplayedRecentTracks(): Observable<Track[]> {
    return this.store.select(fromLibrary.getDisplayedRecentTracks);
  }

  getRecentArtists(): Observable<Artist[]> {
    return this.store.select(fromLibrary.getRecentArtists);
  }

  getRecentAlbums(): Observable<Album[]> {
    return this.store.select(fromLibrary.getDisplayedRecentAlbums);
  }

  loadPlaylist(playlist: Playlist) {
    this.store.dispatch(new LoadPlaylist(playlist));
  }

  savePlaylist(name: string, tracks: Track[]) {
    this.store.dispatch(new SavePlaylist(name, tracks));
    this.snack.open('Playlist saved!', 'OK', {duration: 2000});
  }

  deletePlaylist(name: string) {
    this.store.dispatch(new DeletePlaylist(name));
  }

  addToPlaylist(tracks: Track[], playlist: string) {
    this.store.dispatch(new AddToPlaylist(tracks, playlist));
  }

  removeFromPlaylist(track: Track, playlist: string) {
    this.store.dispatch(new RemoveFromPlaylist(track, playlist));
  }

  getPlaylists(): Observable<Playlist[]> {
    return this.store.select(fromLibrary.getPlaylists);
  }

  getTracksByArtist(artist: Artist): Observable<Track[]> {
    return this.store.select(fromLibrary.getTracksByArtist, artist);
  }

  getTracksByAlbumId(albumId: String): Observable<Track[]> {
    return this.store.select(fromLibrary.getTracksByAlbumId, albumId);
  }

  scanTracks() {
    this.store.dispatch(new ScanTracks());
  }

}