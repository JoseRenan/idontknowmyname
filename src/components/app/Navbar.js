import React, { Component } from 'react';
import { Route, withRouter, NavLink } from 'react-router-dom';

import SearchInput from '../search/SearchInput';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(query) {
        this.props.history.push(`/search/tracks/${query}`);
    }

    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark color-navbar">
                <div className="container">
                    <NavbarLink href="/" text="Musicritic" brand />
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="form-inline search">
                        <SearchInput handleSearch={this.handleSearch} />
                    </div>
                    <div className="navbar-collapse collapse justify-content-stretch" id="navbar">
                        <ul className="navbar-nav ml-auto">
                            <NavbarItem text="Home" href="/home" />
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

const NavbarItem = ({ text, href }) => (
    <li className="nav-item">
        <NavbarLink href={href} text={text} />
    </li>
);

const NavbarLink = ({ text, href, brand }) => (
    <NavLink className={brand ? 'navbar-brand brand' : 'nav-link'} to={href}>{text}</NavLink>
);

export default withRouter(Navbar);
