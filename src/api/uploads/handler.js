const ClientError = require('../../exceptions/ClientError')

class UploadsHandler {
  constructor(service, validator, playlistsService) {
    this._service = service
    this._validator = validator
    this._playlistsService = playlistsService;

    this.postUploadsHandler = this.postUploadsHandler.bind(this);
  }

  async postUploadsHandler (request, h) {
    try {
      const { data } = request.payload

      this._validator.uploadValidate(data.hapi.headers)
      const filename = await this._service.writeFile(data, data.hapi)
      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`,
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
}

module.exports = UploadsHandler;
