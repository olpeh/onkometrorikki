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

const Sup = styled(tag.sup)(space, fontSize, fontWeight, lineHeight, color, {});

Sup.defaultProps = {};

export default Sup;
