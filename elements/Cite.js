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

const Cite = styled(tag.cite)(
  space,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  color,
  {},
);

Cite.defaultProps = {};

export default Cite;
