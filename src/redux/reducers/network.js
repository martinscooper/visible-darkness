import { SET_NB_LAYERS } from '../ActionTypes';

const initialState = {
  nbLayers: 1,
};

export const Network = (state = initialState, action) => {
  switch (action.type) {
    case SET_NB_LAYERS:
      return { ...state, nbLayers: state.nbLayers + 1 };
    default:
      return state;
  }
};
