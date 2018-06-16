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

const Label = styled(tag.label)(
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

Label.defaultProps = {};

export default Label;
