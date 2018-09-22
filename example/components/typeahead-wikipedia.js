import React from 'react';
import debounce from 'lodash.debounce';
import Typeahead from '../../src/typeahead';
import Input from './input';
import Options from './options';

class TypeaheadWikipedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      options: [],
      numberOfOptions: 0,
      ariaLiveText: ''
    };

    window.parseResponse = function (response) {
      const titles = [];
      if (response && response.query && response.query.pages) {
        const {query: {pages}} = response;
        for (const key in pages) {
          if ({}.hasOwnProperty.call(pages, key)) {
            titles.push(pages[key].title);
          }
        }
      }

      const ariaLiveText = titles.length ?
        `${titles.length} suggestions available. Use up and down keys to navigate followed by enter to select` :
        'No suggestions available.';

      this.setState({
        options: titles,
        numberOfOptions: titles.length,
        ariaLiveText
      });
    }.bind(this);

    this.fetchOptions = debounce(this.fetchOptions.bind(this), 300);
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  addScript(src) {
    const s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);
  }

  fetchOptions(query) {
    this.addScript(`https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=${query}&gpslimit=10&callback=parseResponse`);
  }

  onSelect(e, selectedindex) {
    const inputValue = e ? e.target.innerHTML : this.state.options[selectedindex];
    this.setState(() => ({
      inputValue,
      ariaLiveText: ''
    }));
  }

  onChange(e) {
    this.setState({
      ariaLiveText: '',
      inputValue: e.target.value
    });

    this.fetchOptions(e.target.value || '');
  }

  render() {
    return (
      <div className="Pos(r) W(100%)">
        <Typeahead
          namespace="wikipedia-typeahead"
          numberOfOptions={this.state.numberOfOptions}
          ariaLiveText={this.state.ariaLiveText}
          onSelect={this.onSelect}
        >
          <Input
            placeholder="Wikipedia search"
            value={this.state.inputValue}
            onChange={this.onChange}
          />
          <Options options={this.state.options}/>
        </Typeahead>
      </div>
    );
  }
}

export default TypeaheadWikipedia;
