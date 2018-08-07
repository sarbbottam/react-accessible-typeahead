import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import Typeahead from '../src/typeahead';

const Input = props => {
  return (
    <input
      type="text"
      {...props}
      placeholder="Type to fetch options, use up and down arrow to navigate the options, followed by enter to choose the option"
      className="Bd Bdc(#e5e5e5) O(n) Bdc(#198fff):f Bdrs(2px) C(#101010) H(44px) Lh(22px) Fz(18px) P(12px) Bxz(bb) W(100%)"
    />
  );
};

const Options = props => {
  return (
    <div {...props}>
      <ul className="M(0) P(0) Pos(r) Bd Bdc(#198fff) Mt(-2px) Bgc(#fff) Bdrsbstart(2px) Bdrsbend(2px)">
        {
          props.options.map((option, index) => {
            const optionClass = classNames('List(n) Bdbs(s) Bdbw(t) Bdbc(#e5e5e5) Bdbc(t):lot O(n) Bdc(#e5e5e5) C(#101010) H(44px) Lh(22px) Fz(18px) P(12px) Bxz(bb) W(100%)', {
              'Bgc(#198fff)': index === props.selectedindex,
              'C(#fff)': index === props.selectedindex
            });
            return <li key={`option-${index}`} data-index={index} className={optionClass}>{option}</li>; // eslint-disable-line react/no-array-index-key
          })
        }
      </ul>
    </div>
  );
};

Options.propTypes = {
  options: PropTypes.array.isRequired,
  selectedindex: PropTypes.number
};

Options.defaultProps = {
  selectedindex: -1
};

class TypeaheadContainer extends React.Component {
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
    this.onHighLight = this.onHighLight.bind(this);
    this.onCollapse = this.onCollapse.bind(this);
    this.onExpand = this.onExpand.bind(this);
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

  onHighLight(selectedindex) {
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

  render() {
    return (
      <div className="Pos(a) W(100%)">
        <Typeahead
          ariaLiveText={this.state.ariaLiveText}
          options={this.state.options}
          clearInputOnSelect={false}

          onExpand={this.onExpand}
          onCollapse={this.onCollapse}
          onHighLight={this.onHighLight}
          onSelect={this.onSelect}

          fetchOptions={this.fetchOptions}
        >
          <Input/>
          <Options options={this.state.options}/>
        </Typeahead>
      </div>
    );
  }
}

const HackAtomizer = () => { // eslint-disable-line no-unused-vars
  return (
    <body className="W(500px) M(a) Ff(ss) Fw(300) Fz(16px) Pos(r)"/>
  );
};

ReactDOM.render(
  <TypeaheadContainer/>,
  document.getElementById('root')
);
