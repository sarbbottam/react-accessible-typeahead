import React from 'react';
import PropTypes from 'prop-types';

let numberOfOptions = 0;

class TypeAhead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOptionsVisible: false,
      selectedindex: -1
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
      isOptionsVisible: true
    });
    this.props.onShow();
  }

  hideOptions() {
    this.setState({
      selectedindex: -1,
      isOptionsVisible: false
    });
    this.props.onHide();
  }

  onHighLight(selectedindex) {
    this.props.onHighLight(selectedindex);
  }

  onSelect() {
    this.props.onSelect(this.state.selectedindex);
    this.hideOptions();
  }

  onFocus() {
    this.showOptions();
  }

  onBlur() {
    this.hideOptions();
  }

  onChange(e) {
    this.props.onChange(e);
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
    numberOfOptions = this.props.children[1].props.options.length || 0;

    const Input = React.cloneElement(this.props.children[0], {
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown
    });

    const Options = React.cloneElement(this.props.children[1], {
      className: this.state.isOptionsVisible && numberOfOptions ? 'D(b)' : 'D(n)',
      selectedindex: this.state.selectedindex,
      onMouseDown: this.onMouseDown,
      onMouseOver: this.onMouseOver
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
  onChange: PropTypes.func.isRequired,
  fetchOptions: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  ariaLiveText: PropTypes.string.isRequired
};

export default TypeAhead;
