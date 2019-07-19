import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import HomeComponent from '../components/home'
import AboutComponent from '../components/about'
import LoginComponent from '../components/login'
import ItemsComponent from '../components/items'

class Routes extends Component {
    render(){
        return(
            <Switch>
                <Route exact path="/" component={HomeComponent}/>
                <Route exact path="/about" component={AboutComponent}/>
                <Route exact path="/login" component={LoginComponent}/>
                <Route exact path="/items" component={ItemsComponent}/>
            </Switch>
        )
    }
}

export default Routes;