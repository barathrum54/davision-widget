import { css } from 'styled-components';

export const globalStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  *:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
  }

  input {
    font: inherit;
    color: inherit;
    border: none;
    background: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`; 