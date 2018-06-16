import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  color,
} from 'styled-system';
import tag from 'clean-tag';

const Time = styled(tag.time)(
  space,
  display,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  color,
  {},
);

Time.defaultProps = {};

export default Time;
