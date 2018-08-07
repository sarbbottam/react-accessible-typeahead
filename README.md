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

  onExpand={this.onExpand}
  onCollapse={this.onCollapse}
  onSelectedindexUpdate={this.onSelectedindexUpdate}
  onSelect={this.onSelect}
>
  <Input
    onChange={this.onChange}
    {...props}
  />
  <Options
    options={this.state.options}
    {...props}
  />
</Typeahead>
```

License
------------------------------------------------------------------------------

This project is licensed under the [MIT](LICENSE).
