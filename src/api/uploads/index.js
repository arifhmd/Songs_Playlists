const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { service, validator, playlistService }) => {
    const uploadsHandler = new UploadsHandler(service, validator, playlistService);
    server.route(routes(uploadsHandler));
  },
};
