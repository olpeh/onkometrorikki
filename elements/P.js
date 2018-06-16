import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  color,
} from 'styled-system';
import tag from 'clean-tag';

const P = styled(tag.p)(
  space,
  display,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  color,
  {
    boxSizing: 'border-box',
    maxWidth: '34em',
  },
);

P.defaultProps = {};

export default P;
