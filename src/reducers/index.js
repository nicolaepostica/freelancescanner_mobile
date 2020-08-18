import authentication from './authentication';
import global from './global';

const reducer = (state, action) => {
  return {
    authentication: authentication(state, action),
    global: global(state, action),
  };
};

export default reducer;
