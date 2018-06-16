import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  fontWeight,
  color,
  borderColor,
  borderWidth,
} from 'styled-system';
import tag from 'clean-tag';

const Dd = styled(tag.dd)(
  space,
  display,
  width,
  fontSize,
  fontWeight,
  color,
  borderColor,
  borderWidth,
  {},
);

Dd.defaultProps = {};

export default Dd;
