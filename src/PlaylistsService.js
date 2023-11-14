const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const queryPlaylist = {
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [playlistId],
    };

    const resultPlaylist = await this._pool.query(queryPlaylist);
    const playlist = resultPlaylist.rows[0];

    const querySong = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
          LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id
          WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const resultSong = await this._pool.query(querySong);

    return {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        songs: resultSong.rows,
      },
    };
  }
}

module.exports = PlaylistsService;
