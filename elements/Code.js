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

const Code = styled(tag.code)(
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
  },
);

Code.defaultProps = {};

export default Code;
