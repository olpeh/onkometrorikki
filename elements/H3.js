import styled from 'react-emotion';
import {
  space,
  display,
  width,
  alignItems,
  justifyContent,
  fontSize,
  fontWeight,
  lineHeight,
  color,
  borders,
} from 'styled-system';
import tag from 'clean-tag';

const H3 = styled(tag.h3)(
  space,
  display,
  width,
  alignItems,
  justifyContent,
  fontSize,
  fontWeight,
  lineHeight,
  color,
  borders,
  {
    boxSizing: 'border-box',
  },
);

H3.defaultProps = {};

export default H3;
