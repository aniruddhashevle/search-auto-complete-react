import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      suggestionList: []
    }
  }

  onSearch = async (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
    if (value) {
      try {
        let corsAnywhere = 'https://cors-anywhere.herokuapp.com/', //to allow CORS for anywhere with any origin
          response = await axios(`${corsAnywhere}https://suggestqueries.google.com/complete/search?client=firefox&hl=e&q=${value}`);
        if (response && response.status === 200 && response.data && response.data.length > 0) {
          this.setState({ suggestionList: response.data[1] })
        }
      } catch (error) {
        //error handling
      }
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Search AutoCompletion</h1>
        </header>
        <main>
          <div className="search-wrapper">
            <label className="search-label" htmlFor="search-query">Search Your Queries:</label>
            <input
              type="search"
              name="search-query"
              id="search-query"
              className="search-input"
              onChange={this.onSearch}
              value={this.state.searchValue}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default App;
