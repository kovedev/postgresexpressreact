import React, { Component } from 'react';

class AppNavbar extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            isOpen: false
        }
    }

    toggle = () => {
        this.state({
            isOpen: !this.state.isOpen
        })
    }

    render(){

        return(
            <div>
                <div>Home</div>
                <div>About</div>
                <div>Login</div>
            </div>
        )
    }
}

export default AppNavbar;