import styled from 'react-emotion';
import {
  space,
  width,
  display,
  alignItems,
  justifyContent,
  fontSize,
  fontWeight,
  lineHeight,
  color,
  borders,
} from 'styled-system';
import tag from 'clean-tag';

const H5 = styled(tag.h5)(
  space,
  width,
  display,
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

H5.defaultProps = {};

export default H5;
