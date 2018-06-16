import styled from 'react-emotion';
import {
  space,
  display,
  width,
  alignItems,
  justifyContent,
  wrap,
  fontSize,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const Nav = styled(tag.nav)(
  space,
  display,
  width,
  alignItems,
  justifyContent,
  wrap,
  fontSize,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
  {
    boxSizing: 'border-box',
  },
);

Nav.defaultProps = {};

export default Nav;
