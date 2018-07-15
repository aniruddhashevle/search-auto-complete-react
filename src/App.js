import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    }
  }

  onSearch = async (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Search AutoCompletion</h1>
        </header>
        <label>
          Search Your Queries: 
          <input
            type="search"
            name="search-query"
            onChange={this.onSearch}
            value={this.state.searchValue}
          />
        </label>
      </div>
    );
  }
}

export default App;
