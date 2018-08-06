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
  ariaLiveText={this.state.ariaLiveText}
  fetchOptions={this.fetchOptions}
  onShow={this.onShow}
  onHide={this.onHide}
  onChange={this.inputChange}
  onHighLight={this.onHighLight}
  onSelect={this.onSelect}
>
  <Input value={this.state.inputValue}/>
  <Options options={this.state.options}/>
</Typeahead>
```

License
------------------------------------------------------------------------------

This project is licensed under the [MIT](LICENSE).
