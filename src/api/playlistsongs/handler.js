const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._servicePlaylist = playlistsService;
    this._validator = validator;

    this.addPlaylistSongHandler = this.addPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async addPlaylistSongHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      this._validator.validatePlaylistSongPayload(request.payload);
      await this._servicePlaylist.verifyPlaylistAccess(playlistId, credentialId);

      const playlistsongsId = await this._service.addPlaylistSong(playlistId, songId);
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
        data: {
          playlistsongsId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistSongHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._servicePlaylist.verifyPlaylistAccess(playlistId, credentialId);

      const songs = await this._service.getPlaylistSong(playlistId);
      const response = h.response({
        status: 'success',
        data: {
          songs,
        },
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistSongHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._servicePlaylist.verifyPlaylistAccess(playlistId, credentialId);

      const playlistsongsId = await this._service.deletePlaylistSongById(playlistId, songId);
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
        data: {
          playlistsongsId,
        },
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistSongsHandler;
