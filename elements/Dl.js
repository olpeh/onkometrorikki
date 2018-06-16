import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const Dl = styled(tag.dl)(
  space,
  display,
  width,
  fontSize,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
  {},
);

Dl.defaultProps = {};

export default Dl;
