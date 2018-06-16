import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  color,
} from 'styled-system';
import tag from 'clean-tag';

const Q = styled(tag.q)(
  space,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  color,
  {},
);

Q.defaultProps = {};

export default Q;
