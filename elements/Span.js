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

const Span = styled(tag.span)(
  space,
  display,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  color,
  {},
);

Span.defaultProps = {};

export default Span;
