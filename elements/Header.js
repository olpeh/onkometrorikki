import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  fontWeight,
  textAlign,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const Header = styled(tag.header)(
  space,
  display,
  width,
  fontSize,
  color,
  borders,
  borderRadius,
  {
    boxSizing: 'border-box',
  },
);

Header.defaultProps = {};

export default Header;
