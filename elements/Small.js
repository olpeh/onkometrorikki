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

const Small = styled(tag.small)(
  space,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  color,
  {},
);

Small.defaultProps = {};

export default Small;
