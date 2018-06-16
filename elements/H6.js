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

const H6 = styled(tag.h6)(
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

H6.defaultProps = {};

export default H6;
