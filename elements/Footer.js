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

const Footer = styled(tag.footer)(
  space,
  display,
  width,
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

Footer.defaultProps = {};

export default Footer;
