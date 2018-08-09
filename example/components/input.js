import React from 'react';
import PropTypes from 'prop-types';

const Input = props => {
  return (
    <div>
      <label htmlFor={props.id} className="Hidden">{props.placeholder}</label>
      <input
        type="text"
        {...props}
        className="Bd Bdc(#e5e5e5) O(n) Bdc(#198fff):f Bdrs(2px) C(#101010) H(44px) Lh(22px) Fz(18px) P(12px) Bxz(bb) W(100%)"
      />
    </div>
  );
};

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default Input;
