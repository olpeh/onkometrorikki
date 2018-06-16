import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  lineHeight,
  color,
  borders,
  borderColor,
  borderWidth,
} from 'styled-system';
import tag from 'clean-tag';

const Li = styled(tag.li)(
  space,
  width,
  fontSize,
  lineHeight,
  color,
  borders,
  borderColor,
  borderWidth,
  {
    boxSizing: 'border-box',
  },
);

Li.defaultProps = {
  pl: 0,
};

export default Li;
