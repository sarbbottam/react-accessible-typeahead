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
  const onSelect = sinon.spy();

  beforeEach(() => {
    fetchOptions.resetHistory();

    onExpand.resetHistory();
    onCollapse.resetHistory();
    onSelectedindexUpdate.resetHistory();
    onSelect.resetHistory();
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
      }

      render() {
        return (
          <Typeahead
            ariaLiveText={this.state.ariaLiveText}
            options={this.state.options}

            fetchOptions={this.fetchOptions}

            onExpand={this.onExpand}
            onCollapse={this.onCollapse}
            onSelectedindexUpdate={this.onSelectedindexUpdate}
            onSelect={this.onSelect}
          >
            <Input/>
            <Options options={this.state.options}/>
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
    expect(onSelectedindexUpdate.withArgs(0).called).to.be.true;

    onSelectedindexUpdate.resetHistory();
    MountedInput.simulate('keyDown', {keyCode: 40}); // down arrow
    expect(onSelectedindexUpdate.withArgs(1).called).to.be.true;

    onSelectedindexUpdate.resetHistory();
    MountedInput.simulate('keyDown', {keyCode: 40}); // down arrow
    expect(onSelectedindexUpdate.withArgs(2).called).to.be.true;

    onSelectedindexUpdate.resetHistory();
    MountedInput.simulate('keyDown', {keyCode: 40}); // down arrow
    expect(onSelectedindexUpdate.withArgs(0).called).to.be.true;
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
    expect(onSelect.withArgs(0).called).to.be.true;
  });

  it('should call the onSelect method when mouse down is performed on any Typeahead/option', () => {
    MountedInput.simulate('focus');
    MountedInput.simulate('change');
    MountedTypeaheadContainer.find('li').first().simulate('mouseOver');
    MountedTypeaheadContainer.find('li').first().simulate('mouseDown');
    expect(onSelect.withArgs(0).called).to.be.true;
  });
});
