react-accessible-typeahead
==============================================================================

Composable, accessible, keyboard and screen reader friendly


Installation
------------------------------------------------------------------------------

```
npm i react-accessible-typeahead --save
```

Usage
------------------------------------------------------------------------------

```js
import Typeahead from 'react-accessible-typeahead';

<Typeahead
  // text that will be used to update the aria live region
  // probably use the onExpand, onCollapse, onSelectedindexUpdate, onSelect hook to update it with appropriate text
  // so that a screen reader user will be aware of the changes
  ariaLiveText={this.state.ariaLiveText}

  // optional, default value is false, pass it if you need to clear out the textbox on selection.
  clearInputOnSelect={true}

  // use the onExpand, onCollapse, onSelectedindexUpdate, onSelect hook to perform any action corresponding to the events
  onExpand={this.onExpand}
  onCollapse={this.onCollapse}
  onSelectedindexUpdate={this.onSelectedindexUpdate}
  onSelect={this.onSelect}
>
  <Input
    // use onChange to fetch data and update this.state.options
    onChange={this.onChange}

    // pass any other props if needed
    {...props}
  />
  <Options
    // options will be used by the TypeAhead to identify the text for the currently selected option
    options={this.state.options}

    // pass any other props if needed
    {...props}
  />
</Typeahead>
```

License
------------------------------------------------------------------------------

This project is licensed under the [MIT](LICENSE).
