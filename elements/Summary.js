import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  fontWeight,
  textAlign,
  color,
} from 'styled-system';
import tag from 'clean-tag';

const Summary = styled(tag.summary)(
  space,
  display,
  width,
  fontSize,
  fontWeight,
  textAlign,
  color,
  {},
);

Summary.defaultProps = {};

export default Summary;
