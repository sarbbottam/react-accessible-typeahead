import React from 'react';
import PropTypes from 'prop-types';

let numberOfOptions = 0;

class TypeAhead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldOptionsBeVisible: false,
      selectedindex: -1,
      inputValue: ''
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onHighLight = this.onHighLight.bind(this);

    this.showOptions = this.showOptions.bind(this);
    this.hideOptions = this.hideOptions.bind(this);
  }

  showOptions() {
    this.setState({
      shouldOptionsBeVisible: true
    });
    this.props.onShow();
  }

  hideOptions() {
    this.setState({
      selectedindex: -1,
      shouldOptionsBeVisible: false
    });
    this.props.onHide();
  }

  onHighLight(selectedindex) {
    this.props.onHighLight(selectedindex);
  }

  onSelect() {
    this.props.onSelect(this.state.selectedindex);
    this.setState(prevState => ({
      selectedindex: -1,
      shouldOptionsBeVisible: false,
      inputValue: this.props.clearInputOnSelect === true ? '' : this.props.options[prevState.selectedindex]
    }));
  }

  onFocus() {
    this.showOptions();
  }

  onBlur() {
    this.hideOptions();
  }

  onChange(e) {
    // this.props.onChange(e);
    this.setState({inputValue: e.target.value});
    this.props.fetchOptions(e.target.value || '');
    this.showOptions();
  }

  onKeyDown(e) {
    if (e.keyCode !== 13 && e.keyCode !== 27 && e.keyCode !== 38 && e.keyCode !== 40) {
      return;
    }

    e.preventDefault();

    if (e.keyCode === 27) {
      this.hideOptions();
      return;
    }

    if (e.keyCode === 13) {
      this.onSelect();
      return;
    }

    let selectedindex;

    if (e.keyCode === 38) {
      selectedindex = this.state.selectedindex - 1;
      if (selectedindex < 0) {
        selectedindex = numberOfOptions - 1;
      }
    }

    if (e.keyCode === 40) {
      selectedindex = this.state.selectedindex + 1;
      if (selectedindex > numberOfOptions - 1) {
        selectedindex = 0;
      }
    }

    this.setState({
      shouldOptionsBeVisible: true,
      selectedindex
    });
    this.onHighLight(selectedindex);
  }

  onMouseDown(e) {
    e.preventDefault();
    this.onSelect();
  }

  onMouseOver(e) {
    const selectedindex = Number(e.target.getAttribute('data-index'));
    this.setState({
      selectedindex
    });
    this.onHighLight(selectedindex);
  }

  render() {
    numberOfOptions = this.props.options.length || 0;

    const Input = React.cloneElement(this.props.children[0], {
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      value: this.state.inputValue
    });

    const Options = React.cloneElement(this.props.children[1], {
      className: this.state.shouldOptionsBeVisible && numberOfOptions ? 'D(b)' : 'D(n)',
      selectedindex: this.state.selectedindex,
      onMouseDown: this.onMouseDown,
      onMouseOver: this.onMouseOver,
      options: this.props.options
    });

    return (
      <div>
        <span className="Hidden" aria-live="assertive">{this.props.ariaLiveText}</span>
        {Input}
        {Options}
      </div>
    );
  }
}

TypeAhead.propTypes = {
  onHighLight: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onShow: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  fetchOptions: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  ariaLiveText: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  clearInputOnSelect: PropTypes.bool
};

TypeAhead.defaultProps = {
  clearInputOnSelect: false
};
export default TypeAhead;
