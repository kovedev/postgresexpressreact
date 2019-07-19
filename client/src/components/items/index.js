import React, { Component } from 'react';
import AppNavbar from '../navbar';
import Button from '../custom/button';
import { connect } from 'react-redux';
import {createSelector} from "reselect";
import { getItems, deleteItem, addItem } from '../../actions/itemActions';

import './style.scss';

class ItemsComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.dispatch(getItems());
    }

    addItem = () => {
        const name = prompt("Enter item name");
        const item = {
            name: name
        }
        this.props.dispatch(addItem(item));
    }

    removeItem = (id) => {
        this.props.dispatch(deleteItem(id));
    }

    render(){
        const { items } = this.props.items
        return(
            <div>
                <AppNavbar/>
                <div>
                    <div>
                        <Button className={"violet"} onClick={this.addItem}>Add Item</Button>
                    </div>
                        {items.map(item=>
                        <div className={"itemrow"} key={item.id}><div>{item.name}</div><Button className={"warning"} onClick={()=>this.removeItem(item.id)}>X</Button></div>)}
                </div>
            </div>
        )
    }
}

const itemSelector = createSelector(
    state => state.items,
    items => items,
    index => index
)

const mapStateToProps = createSelector(
    itemSelector,
    (items) => ({
        items
    })
);

export default connect(mapStateToProps)(ItemsComponent);