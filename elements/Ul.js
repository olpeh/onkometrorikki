import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  lineHeight,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const Ul = styled(tag.ul)(
  space,
  display,
  width,
  fontSize,
  lineHeight,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
  {
    boxSizing: 'border-box',
  },
);

Ul.defaultProps = {
  ml: 0,
  pt: 0,
};

export default Ul;
