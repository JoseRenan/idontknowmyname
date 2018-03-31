import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import SearchResult from './SearchResult';
import SpotifyWebApi from '../../spotify';

class SearchResultsPage extends Component {
    constructor(props) {
        super(props);
        this.state = { results: {} };
        this.spotifyWebApi = new SpotifyWebApi();
    }

    componentDidMount() {
        this.updateResults(this.props.match.params.query);
    }
    
    componentWillReceiveProps(nextProps) {
        const oldQuery = this.props.match.params.query;
        const newQuery = nextProps.match.params.query;
        if (oldQuery !== newQuery) {
            this.updateResults(newQuery);
        }
    }

    updateResults(query) {
        this.spotifyWebApi.search(query).then(results => {
            this.setState(prevState => ({
                results: results
            }));
        });
    }

    render() {
        return (
            <div className="container">
                <SearchResultsNav query={this.props.match.params.query} />
                <div className="container">
                    {this.state.results.albums? <SearchResult results={this.state.results} /> : null}
                </div>
            </div>
        );
    }
}

const SearchResultsNav = ({query}) => (
    <ul className="nav justify-content-center">
        <li className="nav-item">
            <NavLink className="nav-link" to={`/search/tracks/${query}`}>Tracks</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to={`/search/albums/${query}`}>Albums</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to={`/search/artists/${query}`}>Artists</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to={`/search/playlists/${query}`}>Playlists</NavLink>
        </li>
    </ul>
);

export default SearchResultsPage;