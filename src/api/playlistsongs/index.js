const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async(server, { service, servicePlaylist, validator }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(service, servicePlaylist, validator);
    server.route(routes(playlistSongsHandler));
  },
};
