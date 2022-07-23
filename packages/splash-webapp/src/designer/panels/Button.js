import React from 'react';
import styles from './styles';

const Button = ({onClick, ...props}) => {
  let _onClick = (e, ...args) => {
    e.preventDefault();
    onClick(...args);
  }
  return (
    // eslint-disable-next-line
    <a href="#" style={styles.button} onClick={_onClick}>
      {props.children}
    </a>
  );
}

export default Button;
