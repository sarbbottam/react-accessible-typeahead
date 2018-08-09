import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Options = props => {
  return (
    <div {...props}>
      <ul className="M(0) P(0) Pos(a) Bd Bdc(#198fff) Mt(-2px) Bgc(#fff) Bdrsbstart(2px) Bdrsbend(2px) W(100%) Bxz(bb)">
        {
          props.options.map((option, index) => {
            const optionClass = classNames('List(n) Bdbs(s) Bdbw(t) Bdbc(#e5e5e5) Bdbc(t):lot O(n) Bdc(#e5e5e5) C(#101010) H(44px) Lh(22px) Fz(18px) P(12px) Bxz(bb) W(100%)', {
              'Bgc(#198fff)': index === props.selectedindex,
              'C(#fff)': index === props.selectedindex
            });
            return <li key={`option-${index}`} data-index={index} className={optionClass}>{option}</li>; // eslint-disable-line react/no-array-index-key
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

export default Options;
