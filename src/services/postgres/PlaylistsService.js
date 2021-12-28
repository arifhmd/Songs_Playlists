const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToPlaylist } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    await this._cacheService.delete(`playlists:${owner}`);
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    try {
      const result = await this._cacheService.get(`playlists:${owner}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT playlists.id, playlists.name, users.username
        FROM playlists
        LEFT JOIN users ON users.id = playlists.owner
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1
        GROUP BY playlists.id, users.username`,
        values: [owner],
      };
      const result = await this._pool.query(query);
      const mappedResult = result.rows.map(mapDBToPlaylist);

      await this._cacheService.set(`playlists:${owner}`, JSON.stringify(mappedResult));
      return mappedResult;
    }
  }

  async deletePlaylistByOwner(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id, owner',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan');
    }
    const { owner } = result.rows[0];
    await this._cacheService.delete(`playlists:${owner}`);
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, credentialId) {
    try {
      await this.verifyPlaylistOwner(playlistId, credentialId);
    } catch (error) {
      if (error instanceof InvariantError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, credentialId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
