const { Pool } = require('pg');
 
class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const query = {
      text: `SELECT playlists.*,users.username FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;
