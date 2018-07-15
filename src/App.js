import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      suggestionList: []
    };
    this.wrapperRef = '';
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutsideList);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutsideList);
  }

  removeSuggestionList = () => {
    this.setState({ suggestionList: [] });
  }

  handleClickOutsideList = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.removeSuggestionList();
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
    } else this.removeSuggestionList();
  }

  suggestionListNode = (suggestionList) =>
    <ul className="suggestion-list" ref={ref => this.wrapperRef = ref}>
      {
        suggestionList.map((listItem, index) =>
          <li key={index} className="suggestion-list-item" onClick={this.listItemOnClick}>{listItem}</li>
        )
      }
    </ul>

  listItemOnClick = (e) => this.setState({
    searchValue: e.target.textContent || e.target.innerText,
    suggestionList: []
  })

  render() {
    const {
      suggestionList,
      searchValue
    } = this.state;
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
              value={searchValue}
            />
            {
              suggestionList && suggestionList.length > 0 && this.suggestionListNode(suggestionList)
            }
          </div>
        </main>
      </div>
    );
  }
}

export default App;
