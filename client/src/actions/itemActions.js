import axios from 'axios';
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from '../actions/types';

export const getItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios.get('/api/items/')
        .then(response=>dispatch({
            type: GET_ITEMS,
            payload: response.data.items
        }))
}
export const addItem = (item) => {
    return {
        type: ADD_ITEM,
        payload: item
    }
}
export const deleteItem = (id) => {
    return {
        type: DELETE_ITEM,
        payload: id
    }
}

export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    }
}