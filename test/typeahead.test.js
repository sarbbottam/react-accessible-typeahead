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
      options: ['foo', 'bar', 'baz']
    });
  });

  const onExpand = sinon.spy();
  const onCollapse = sinon.spy();
  const onSelectedindexUpdate = sinon.spy();
  const onSelect = sinon.spy(() => 'Selected');

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

    onExpand.resetHistory();
    onCollapse.resetHistory();
    onSelectedindexUpdate.resetHistory();
    onSelect.resetHistory();

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
          options: [],
          ariaLiveText: ''
        };

        this.fetchOptions = fetchOptions.bind(this);

        this.onExpand = onExpand.bind(this);
        this.onCollapse = onCollapse.bind(this);
        this.onSelectedindexUpdate = onSelectedindexUpdate.bind(this);
        this.onSelect = onSelect.bind(this);
        this.onChange = onChange.bind(this);
      }

      render() {
        return (
          <Typeahead
            ariaLiveText={this.state.ariaLiveText}

            onExpand={this.onExpand}
            onCollapse={this.onCollapse}
            onSelectedindexUpdate={this.onSelectedindexUpdate}
            onSelect={this.onSelect}
          >
            <Input
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

    expect(onExpand.called).to.be.false;
    expect(onCollapse.called).to.be.false;
    expect(fetchOptions.called).to.be.false;
    expect(onSelectedindexUpdate.called).to.be.false;
    expect(onSelect.called).to.be.false;

    expect(onFocus.called).to.be.false;
    expect(onBlur.called).to.be.false;
    expect(onChange.called).to.be.false;
    expect(onKeyDown.called).to.be.false;
    expect(onMouseDown.called).to.be.false;
    expect(onMouseOver.called).to.be.false;
  });

  it('should call the onExpand method when Typeahead/input is focused', () => {
    MountedInput.simulate('focus');
    expect(onExpand.called).to.be.true;
  });

  it('should call the onCollapse method when Typeahead/input is blured', () => {
    MountedInput.simulate('blur');
    expect(onCollapse.called).to.be.true;
  });

  it('should call the onCollapse method when esc key is pressed on Typeahead/input', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');
    MountedInput.simulate('keyDown', {keyCode: 40}); // down arrow
    MountedInput.simulate('keyDown', {keyCode: 27}); // esc
    expect(onCollapse.called).to.be.true;
  });

  it('should call the fetchOptions method when Typeahead/input is changed', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');
    expect(fetchOptions.called).to.be.true;
  });

  it('should call the onSelectedindexUpdate method when down key is pressed on Typeahead/input', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');
    MountedInput.simulate('keyDown', {keyCode: 40}); // down arrow
    expect(onSelectedindexUpdate.withArgs(1).called).to.be.true;

    onSelectedindexUpdate.resetHistory();
    MountedInput.simulate('keyDown', {keyCode: 40}); // down arrow
    expect(onSelectedindexUpdate.withArgs(2).called).to.be.true;

    onSelectedindexUpdate.resetHistory();
    MountedInput.simulate('keyDown', {keyCode: 40}); // down arrow
    expect(onSelectedindexUpdate.withArgs(0).called).to.be.true;

    onSelectedindexUpdate.resetHistory();
    MountedInput.simulate('keyDown', {keyCode: 40}); // down arrow
    expect(onSelectedindexUpdate.withArgs(1).called).to.be.true;
  });

  it('should call the onSelectedindexUpdate method when up key is pressed on Typeahead/input', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');
    MountedInput.simulate('keyDown', {keyCode: 38}); // up arrow
    expect(onSelectedindexUpdate.withArgs(2).called).to.be.true;

    onSelectedindexUpdate.resetHistory();
    MountedInput.simulate('keyDown', {keyCode: 38}); // up arrow
    expect(onSelectedindexUpdate.withArgs(1).called).to.be.true;

    onSelectedindexUpdate.resetHistory();
    MountedInput.simulate('keyDown', {keyCode: 38}); // up arrow
    expect(onSelectedindexUpdate.withArgs(0).called).to.be.true;

    onSelectedindexUpdate.resetHistory();
    MountedInput.simulate('keyDown', {keyCode: 38}); // up arrow
    expect(onSelectedindexUpdate.withArgs(2).called).to.be.true;
  });

  it('must not call onSelectedindexUpdate, onCollapse, onSelect for key press other than up/down/enter/space on Typeahead/input', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('keyDown', {keyCode: 65});

    expect(onSelectedindexUpdate.called).to.be.false;
    expect(onCollapse.called).to.be.false;
    expect(onSelect.called).to.be.false;
  });

  it('should call the onSelect method when enter key is pressed on Typeahead/input after key up or key down', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');
    MountedInput.simulate('keyDown', {keyCode: 40}); // down arrow
    MountedInput.simulate('keyDown', {keyCode: 13}); // enter
    expect(onSelect.withArgs(1).called).to.be.true;
  });

  it('should call the onSelect method when mouse down is performed on any Typeahead/option', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');
    MountedTypeaheadContainer.find('li').first().simulate('mouseOver');
    MountedTypeaheadContainer.find('li').first().simulate('mouseDown');
    expect(onSelect.withArgs(0).called).to.be.true;
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
