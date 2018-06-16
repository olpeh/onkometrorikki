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

const Textarea = styled(tag.textarea)(
  space,
  width,
  fontSize,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
  {},
);

Textarea.defaultProps = {};

export default Textarea;
