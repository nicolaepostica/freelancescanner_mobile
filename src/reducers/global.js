const global = (state, action) => {
  if (state === undefined) {
    return {
      token: 'key',
    };
  }

  switch (action.type) {
    case 'SET_TOKEN':
      return {
        token: action.payload,
      };

    case 'CLEAN_TOKEN':
      return {
        token: '',
      };

    default:
      return state.global;
  }
};

export default global;
