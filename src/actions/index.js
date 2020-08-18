const setToken = (token) => {
  return {
    type: 'SET_TOKEN',
    payload: token,
  };
};

const cleanToken = () => {
  return {
    type: 'CLEAN_TOKEN',
  };
};

const setFeeds = (feeds) => {
  return {
    type: 'SET_FEEDS',
    payload: feeds,
  };
};

const deleteFeeds = (feed) => {
  return {
    type: 'DELETE_FEEDS',
    payload: feed,
  };
};

const setFavorite = (favorites) => {
  return {
    type: 'SET_FAVORITE',
    payload: favorites,
  };
};

const deleteFavorite = (favorite) => {
  return {
    type: 'DELETE_FAVORITE',
    payload: favorite,
  };
};

export {setToken, cleanToken, setFeeds, deleteFeeds, setFavorite, deleteFavorite};
