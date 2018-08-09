import React from 'react';
import ReactDOM from 'react-dom';
import TypeaheadWikipedia from './components/typeahead-wikipedia';

const HackAtomizer = () => { // eslint-disable-line no-unused-vars
  return (
    <body className="W(90%) W(720px)--lg  M(a) Ff(ss) Fw(300) Fz(16px) Pos(r)"/>
  );
};

const Usage = () => {
  return (
    <div>
      <h2 className="Mt(24px) Fw(300) Fw(700)--lg">Usage:</h2>
      <pre className="Ov(s) Mah(300px) Mah(500px)--lg">
        <code className="language-js">
          {`
import React from 'react';
import Typeahead from 'react-accessible-typeahead';
import Input from './input';
import Options from './options';

class MyTypeahead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      options: [],
      numberOfOptions: 0
    };

    this.fetchOptions = fetchOptions.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  fetchOptions(query) {
    this.setState({
      // some function to fetch option that can be accessed here
      // options: functionToFetchOption(query)
    });
  }

  onSelect(selectedindex) {
    this.setState(prevState => ({
      inputValue: e ? e.target.innerHTML : prevState.options[selectedindex]
    }));
  }

  onChange(e) {
    this.setState({
      inputValue: e.target.value
    });

    this.fetchOptions(e.target.value || '');
  }

  render() {
    return (
      <div className="Pos(a) W(100%)">
        <Typeahead
          namespace="my-typeahead"
          numberOfOptions={this.state.numberOfOptions}

          onSelect={this.onSelect}
        >
          <Input
            placeholder="Search"
            value={this.state.inputValue}
            onChange={this.onChange}

          />
          <Options options={this.state.options}/>
        </Typeahead>
      </div>
    );
  }
}

ReactDOM.render(
  <MyTypeAhead/>,
  document.getElementById('root')
);
        `}
        </code>
      </pre>
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <h1 className="Fw(300) Fw(700)--lg Fz(1.75em) Fz(2em)--lg ">
        <a href="https://github.com/sarbbottam/react-accessible-typeahead/" className="Td(n) C(#198fff) D(f) Fld(c) Fld(r)--lg  Jc(sb) Ai(fs) Ai(c)--lg">
          <img src="logo.png" alt="" className="Mt(8px) Mstart(-8px) H(80px)"/>
          <span>react-accessible-typeahead</span>
        </a>
      </h1>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="Bxz(bb) Pos(f) B(0) Py(16px) Bg(#fff) W(100%) Fw(500) C(#888)">
      <span>Built with ♡ by </span>
      <a className="C(#198fff) Td(n)" href="https://twitter.com/sarbbottam">@sarbbottam</a>
    </footer>
  );
};

const Shell = () => {
  return (
    <div className="">
      <Header/>
      <TypeaheadWikipedia/>
      <Usage/>
      <Footer/>
    </div>
  );
};

ReactDOM.render(
  <Shell/>,
  document.getElementById('root')
);
