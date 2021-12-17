const routes = (handler) => [{
  method: 'POST',
  path: '/playlists/{playlistId}/songs',
  handler: handler.addPlaylistSongHandler,
  options: {
    auth: 'songsapp_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists/{playlistId}/songs',
  handler: handler.getPlaylistSongHandler,
  options: {
    auth: 'songsapp_jwt',
  },
},
{
  method: 'DELETE',
  path: '/playlists/{playlistId}/songs',
  handler: handler.deletePlaylistSongHandler,
  options: {
    auth: 'songsapp_jwt',
  },
},
];

module.exports = routes;
