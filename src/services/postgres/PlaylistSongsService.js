const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
 
class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong({ playlistId, songId }) {
    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist');
    }
    return result.rows[0].id;
  }

  async getPlaylistSong(playlistId) {
    const query = {
      text: 'SELECT a.id, a.title, a.performer FROM songs a JOIN playlistsongs b ON a.id = b.song_id JOIN playlists c ON c.id = b.playlist_id WHERE b.playlist_id = $1 OR c.id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan di dalam playlist');
    }
    return result.rows;
  }

  async deletePlaylistSongById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }
  }
}

module.exports = PlaylistSongsService;
