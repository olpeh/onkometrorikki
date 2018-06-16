import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const Kbd = styled(tag.code)(
  space,
  width,
  fontSize,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
  {
    boxSizing: 'border-box',
    fontFamily: 'monospace, monospace',
  },
);

Kbd.defaultProps = {
  fontSize: 2,
};

export default Kbd;
