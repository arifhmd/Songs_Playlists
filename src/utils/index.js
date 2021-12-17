const mapDBToModel = ({ 
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
  username,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
  username,
});

const mapDBToPlaylist = ({
  id,
  name,
  owner,
}) => ({
  id,
  name,
  username: owner,
});

module.exports = { mapDBToModel, mapDBToPlaylist };
