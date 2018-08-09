/* eslint no-unused-expressions: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import sinon from 'sinon';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {expect} from 'chai';
import Typeahead from '../src/typeahead';

// Avoid Warning: render(): Rendering components directly into document.body is discouraged.
before(() => {
  const div = document.createElement('div');
  window.rootNode = div;
  document.body.appendChild(div);
});

Enzyme.configure({adapter: new Adapter()});

const Input = props => {
  return (
    <input type="text" {...props}/>
  );
};

const Options = props => {
  return (
    <div {...props}>
      <ul>
        {
          props.options.map((option, index) => {
            return <li key={`option-${index}`} data-index={index}>{option}</li>; // eslint-disable-line react/no-array-index-key
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

describe('<Typeahead />', () => {
  let MountedTypeaheadContainer;
  let MountedInput;

  const fetchOptions = sinon.spy(function () {
    this.setState({
      options: ['foo', 'bar', 'baz'],
      numberOfOptions: 3
    });
  });

  const onExpand = sinon.spy();
  const onCollapse = sinon.spy();
  const onSelectedIndexUpdate = sinon.spy();
  const onSelect = sinon.spy();
  const getSelectedIndex = sinon.spy(() => 0);
  const getSelectedValue = sinon.spy(() => 'Selected');

  const onFocus = sinon.spy();
  const onBlur = sinon.spy();
  const onChange = sinon.spy(function () {
    this.fetchOptions();
  });
  const onKeyDown = sinon.spy();
  const onMouseDown = sinon.spy();
  const onMouseOver = sinon.spy();

  beforeEach(() => {
    fetchOptions.resetHistory();

    onSelectedIndexUpdate.resetHistory();
    onSelect.resetHistory();
    getSelectedIndex.resetHistory();
    getSelectedIndex.resetHistory();
    getSelectedValue.resetHistory();

    onFocus.resetHistory();
    onBlur.resetHistory();
    onChange.resetHistory();
    onKeyDown.resetHistory();
    onMouseDown.resetHistory();
    onMouseOver.resetHistory();
    class TypeaheadContainer extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          inputValue: '',
          options: [],
          numberOfOptions: 0
        };

        this.fetchOptions = fetchOptions.bind(this);

        this.onExpand = onExpand.bind(this);
        this.onCollapse = onCollapse.bind(this);
        this.onSelectedIndexUpdate = onSelectedIndexUpdate.bind(this);
        this.onSelect = onSelect.bind(this);
        this.getSelectedIndex = getSelectedIndex.bind(this);
        this.getSelectedValue = getSelectedValue.bind(this);
        this.onChange = onChange.bind(this);
      }

      render() {
        return (
          <Typeahead
            namespace="test-typeahead"
            numberOfOptions={this.state.numberOfOptions}

            onSelect={this.onSelect}

          >
            <Input
              placeholder="Test search"
              value={this.state.inputValue}
              onChange={this.onChange}

              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={onKeyDown}
            />
            <Options
              options={this.state.options}
              onMouseDown={onMouseDown}
              onMouseOver={onMouseOver}
            />
          </Typeahead>
        );
      }
    }

    MountedTypeaheadContainer = mount(
      <TypeaheadContainer/>,
      {attachTo: window.rootNode}
    );

    MountedInput = MountedTypeaheadContainer.find('input');

    expect(fetchOptions.called).to.be.false;
    expect(onSelectedIndexUpdate.called).to.be.false;
    expect(onSelect.called).to.be.false;

    expect(onFocus.called).to.be.false;
    expect(onBlur.called).to.be.false;
    expect(onChange.called).to.be.false;
    expect(onKeyDown.called).to.be.false;
    expect(onMouseDown.called).to.be.false;
    expect(onMouseOver.called).to.be.false;
  });

  it('should call the fetchOptions method when Typeahead/input is changed', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');
    expect(fetchOptions.called).to.be.true;
  });

  it('should call the onSelect method when enter key is pressed on Typeahead/input after key up or key down', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');
    MountedInput.simulate('keyDown', {keyCode: 40}); // down arrow
    MountedInput.simulate('keyDown', {keyCode: 13}); // enter
    expect(onSelect.called).to.be.true;
  });

  it('should call the onSelect method when mouse down is performed on any Typeahead/option', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');
    MountedTypeaheadContainer.find('li').first().simulate('mouseOver');
    MountedTypeaheadContainer.find('li').first().simulate('mouseDown');
    expect(onSelect.called).to.be.true;
  });

  it('should call the passed onFocus, onBlur, onChange, and onKeyDown when such event occurs on Typeahead/input', () => {
    MountedInput.simulate('focus');
    expect(onFocus.called).to.be.true;

    MountedInput.simulate('change');
    expect(onChange.called).to.be.true;

    MountedInput.simulate('keyDown', {keyCode: 40});
    expect(onKeyDown.called).to.be.true;

    MountedInput.simulate('blur');
    expect(onBlur.called).to.be.true;
  });

  it('should call the passed onMouseDown and onMouseOver when such event occurs on Typeahead/option', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');

    MountedTypeaheadContainer.find('li').first().simulate('mouseOver');
    expect(onMouseOver.called).to.be.true;

    MountedTypeaheadContainer.find('li').first().simulate('mouseDown');
    expect(onMouseDown.called).to.be.true;
  });
});
