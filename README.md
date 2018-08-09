<img src="logo/logo.png" alt="" width="240px">

react-accessible-typeahead
==============================================================================

Composable, accessible, keyboard and screen reader friendly, see it in action at https://sarbbottam.github.io/react-accessible-typeahead/


Installation
------------------------------------------------------------------------------

```
npm i react-accessible-typeahead --save
```

Usage
------------------------------------------------------------------------------
Import the `react-accessible-typeahead/build/main.css` to App so:

```css
@import /path/to/node_modules/react-accessible-typeahead/build/main.css;
```

Use the `react-accessible-typeahead` component in the App like so:
```js
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
      <Typeahead
        // namespace will be used as an id prefix
        namespace="wikipedia-typeahead"
        // number of available options
        numberOfOptions={this.state.numberOfOptions}
        // use onSelect hook to perform any action corresponding to the event
        onSelect={this.onSelect}
      >
        <Input
          // should be used as label
          placeholder="Search"
          // use onChange to fetch data, update this.state.options and numberOfOptions
          // this method will be called from TypeAhead's onChange method
          // TypeAhead's onChange method will be passed to this Input as props
          onChange={this.onChange}

          value={this.state.inputValue}

          // pass any other props if needed
          {...props}
        />
        <Options
          /* optional */

          // pass any props if needed
          // probably pass this.state.options which could be used by Options component
          options={this.state.options}
          {...props}
        />
      </Typeahead>
    );
  }
}
```

Refer [example directory](example) for a concrete example.

The example components are also part of the distribution, please access them like so:

```js
import Input from '/path/to/node_modules/react-accessible-typeahead/build/example/component/input.js';
import Options from '/path/to/node_modules/react-accessible-typeahead/build/example/component/options.js';
import TypeaheadWikipedia from '/path/to/node_modules/react-accessible-typeahead/build/example/component/typeahead-wikipedia.js';
```

Please ensure to `import` the `/path/to/node_modules/react-accessible-typeahead/build/example/main.css`, like so:

```css
@import /path/to/node_modules/react-accessible-typeahead/build/example/main.css;
```

Contributing
------------------------------------------------------------------------------
Please refer [CONTRIBUTING.md](contributing.md) for instructions to [get started](CONTRIBUTING.md#Get_Started).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT](LICENSE).
