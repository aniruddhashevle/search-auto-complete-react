import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      suggestionList: [],
      cursor: 0,
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
          <li
            key={index}
            className={'suggestion-list-item ' + (this.state.cursor === index ? 'active' : null)}
            onClick={this.listItemOnClick}
          >
            {listItem}
          </li>
        )
      }
    </ul>

  listItemOnClick = (e) => this.setState({
    searchValue: e.target.textContent || e.target.innerText,
    suggestionList: []
  })

  handleKeyDown = (e) => {
    // arrow up/down and Enter button handling
    const { cursor, suggestionList } = this.state
    if (suggestionList && suggestionList.length > 0) {
      if (e.key === 'ArrowUp') { // Up Arrow
        if (cursor > 0) {
          this.setState(prevState => ({
            cursor: prevState.cursor - 1
          }));
        } else { // to focus on last list item from first list item
          this.setState({ cursor: suggestionList.length - 1 });
        }
      } else if (e.key === 'ArrowDown') { // Down Arrow
        if (cursor < suggestionList.length - 1) {
          this.setState(prevState => ({
            cursor: prevState.cursor + 1
          }));
        } else { // to focus on fist list item from last list item
          this.setState({ cursor: 0 });
        }
      } else if (e.key === 'Enter' && (cursor > 0 || cursor < suggestionList.length - 1)) { // Enter to select respcitve list item
        this.setState({
          searchValue: suggestionList[cursor],
          suggestionList: []
        });
      }
    }
  }

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
              value={searchValue}
              onChange={this.onSearch}
              onKeyDown={this.handleKeyDown}
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
