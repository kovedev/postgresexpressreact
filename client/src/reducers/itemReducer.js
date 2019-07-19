import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from '../actions/types';

const initialState = {
    items: [],
    index: 3,
    loading: false,
}

export default function itemReducer(state = initialState, action){
    switch(action.type){
        case GET_ITEMS:
            return {
                ...state,
                items: action.payload,
                loading: false
            }
        case ADD_ITEM:
            return {
                ...state,
                items: [action.payload, ...state.items],
                index: state.index+1
            }
        case DELETE_ITEM:
            return {
                ...state,
                items : state.items.filter(item => item.id !== action.payload)
            }
        case ITEMS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}