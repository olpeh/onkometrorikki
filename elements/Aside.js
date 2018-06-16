import styled from 'react-emotion';
import {
  space,
  width,
  display,
  fontSize,
  color,
  borders,
  borderWidth,
  borderColor,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const Aside = styled(tag.aside)(
  space,
  width,
  display,
  fontSize,
  color,
  borders,
  borderWidth,
  borderColor,
  borderRadius,
  {
    boxSizing: 'border-box',
  },
);

Aside.defaultProps = {};

export default Aside;
