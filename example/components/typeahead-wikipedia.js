import React from 'react';
import debounce from 'lodash.debounce';
import Typeahead from '../../src/typeahead';
import Input from './input';
import Options from './options';

class TypeaheadWikipedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
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

      this.setState({
        options: titles,
        ariaLiveText: `${titles.length} results being displayed.`
      });
    }.bind(this);

    this.fetchOptions = debounce(this.fetchOptions.bind(this), 300);
    this.onSelect = this.onSelect.bind(this);
    this.onSelectedindexUpdate = this.onSelectedindexUpdate.bind(this);
    this.onCollapse = this.onCollapse.bind(this);
    this.onExpand = this.onExpand.bind(this);

    this.onChange = this.onChange.bind(this);
  }

  addScript(src) {
    const s = document.createElement('script');
    s.setAttribute('src', src);
    document.body.appendChild(s);
  }

  fetchOptions(query) {
    this.setState({
      ariaLiveText: `Searching ...`
    });
    this.addScript(`https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&gpssearch=${query}&gpslimit=10&callback=parseResponse`);
  }

  onSelectedindexUpdate(selectedindex) {
    this.setState(prevState => ({
      ariaLiveText: `${prevState.options[selectedindex]}, option ${selectedindex + 1} of ${prevState.options.length}`
    }));
  }

  onCollapse() {
    this.setState({
      ariaLiveText: `Options dropdown is closed.`
    });
  }

  onExpand() {
    this.setState(prevState => {
      if (prevState.options.length > 0) {
        return {ariaLiveText: `${prevState.options.length} results being displayed.`};
      }
    });
  }

  onSelect(selectedindex) {
    this.setState(prevState => ({
      ariaLiveText: `
        ${prevState.options[selectedindex]}, option ${selectedindex + 1} of ${prevState.options.length} selected.
        Options dropdown is closed.
      `
    }));
  }

  onChange(e) {
    this.fetchOptions(e.target.value || '');
  }

  render() {
    return (
      <div className="Pos(a) W(100%)">
        <Typeahead
          ariaLiveText={this.state.ariaLiveText}
          clearInputOnSelect={false}

          onExpand={this.onExpand}
          onCollapse={this.onCollapse}
          onSelectedindexUpdate={this.onSelectedindexUpdate}
          onSelect={this.onSelect}
        >
          <Input
            onChange={this.onChange}
            placeholder="Type to fetch options, use up and down arrow to navigate the options, followed by enter to choose the option"
          />
          <Options options={this.state.options}/>
        </Typeahead>
      </div>
    );
  }
}

export default TypeaheadWikipedia;