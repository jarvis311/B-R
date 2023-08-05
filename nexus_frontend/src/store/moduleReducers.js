// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
    moduleList: [], // for active default menu
    loading: true, // for active default menu
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const moduleReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REQUEST:
            return {
                ...state,
                loading: true,
                moduleList: []
            };
        case  actionTypes.SUCCESS:
            return {
                ...state,
                loading: false,
                moduleList: action.payload
            };
        case actionTypes.FAIL:
            return {
                ...state,
                loading: false,
                moduleList:[]
            };
       
        default:
            return state;
    }
};

export default moduleReducer;
