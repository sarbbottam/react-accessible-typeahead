import React from 'react';
import PropTypes from 'prop-types';

class TypeAhead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldOptionsBeVisible: false,
      selectedindex: -1
    };

    this.showOptions = this.showOptions.bind(this);
    this.hideOptions = this.hideOptions.bind(this);

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);

    this.onSelect = this.onSelect.bind(this);
  }

  showOptions() {
    this.setState({
      shouldOptionsBeVisible: true
    });
  }

  hideOptions() {
    this.setState({
      selectedindex: -1,
      shouldOptionsBeVisible: false
    });
  }

  onFocus(e) {
    /* istanbul ignore else */
    if (this.props.children[0].props.onFocus) {
      this.props.children[0].props.onFocus(e);
    }
    this.showOptions();
  }

  onBlur(e) {
    /* istanbul ignore else */
    if (this.props.children[0].props.onBlur) {
      this.props.children[0].props.onBlur(e);
    }
    this.hideOptions();
  }

  onChange(e) {
    /* istanbul ignore else */
    if (this.props.children[0].props.onChange) {
      this.props.children[0].props.onChange(e);
    }
    this.showOptions();
  }

  onKeyDown(e) {
    /* istanbul ignore else */
    if (this.props.children[0].props.onKeyDown) {
      this.props.children[0].props.onKeyDown(e);
    }
    if (e.keyCode !== 13 && e.keyCode !== 27 && e.keyCode !== 38 && e.keyCode !== 40) {
      this.setState({
        selectedindex: -1
      });
      return;
    }

    e.preventDefault();

    if (e.keyCode === 27) {
      this.hideOptions();
      return;
    }

    if (e.keyCode === 13) {
      this.onSelect(null, this.state.selectedindex);
      return;
    }

    let selectedindex;

    if (e.keyCode === 38) {
      selectedindex = this.state.selectedindex - 1;
      if (selectedindex < 0) {
        selectedindex = this.props.numberOfOptions - 1;
      }
    }

    if (e.keyCode === 40) {
      selectedindex = this.state.selectedindex + 1;
      if (selectedindex > this.props.numberOfOptions - 1) {
        selectedindex = 0;
      }
    }

    this.setState({
      shouldOptionsBeVisible: true,
      selectedindex
    });
  }

  onMouseDown(e) {
    /* istanbul ignore else */
    if (this.props.children[1].props.onMouseDown) {
      this.props.children[1].props.onMouseDown(e);
    }
    e.preventDefault();
    this.onSelect(e);
  }

  onMouseOver(e) {
    /* istanbul ignore else */
    if (this.props.children[1].props.onMouseOver) {
      this.props.children[1].props.onMouseOver(e);
    }

    const selectedindex = [...e.target.parentNode.children].indexOf(e.target);
    this.setState({
      selectedindex
    });
  }

  onSelect(e, selectedindex) {
    this.props.onSelect(e, selectedindex);

    this.setState({
      selectedindex: -1,
      shouldOptionsBeVisible: false
    });
  }

  render() {
    const {numberOfOptions} = this.props;
    const inputId = `${this.props.namespace}-input`;
    const optionsId = `${this.props.namespace}-options`;

    const Input = React.cloneElement(this.props.children[0], {
      id: inputId,
      autoComplete: 'off',
      'aria-autocomplete': 'list',
      // Safari needs this
      'aria-controls': optionsId,
      'aria-activedescendant': `${this.props.namespace}-${this.state.selectedindex}`,

      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown

    });

    const Options = React.cloneElement(this.props.children[1], {
      id: optionsId,
      role: 'listbox',
      namespace: this.props.namespace,
      onMouseDown: this.onMouseDown,
      onMouseOver: this.onMouseOver,
      selectedindex: this.state.selectedindex,
      style: {display: numberOfOptions && this.state.shouldOptionsBeVisible ? 'block' : 'none'}
    });

    return (
      <div>
        <div className="Hidden" role="alert">
          {this.props.ariaLiveText}
        </div>
        {/* Safari needs all of these */}
        <div
          role="combobox"
          aria-owns={optionsId}
          aria-haspopup="listbox"
          aria-expanded={Boolean(numberOfOptions) && this.state.shouldOptionsBeVisible}
        >
          {Input}
        </div>
        {Options}
      </div>
    );
  }
}

TypeAhead.propTypes = {
  onSelect: PropTypes.func.isRequired,

  namespace: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  numberOfOptions: PropTypes.number.isRequired,
  ariaLiveText: PropTypes.string.isRequired
};

export default TypeAhead;
