import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  fontWeight,
  textAlign,
  color,
  borders,
  borderColor,
  borderWidth,
} from 'styled-system';
import tag from 'clean-tag';

const Th = styled(tag.th)(
  space,
  width,
  fontSize,
  fontWeight,
  textAlign,
  color,
  borders,
  borderColor,
  borderWidth,
  {},
);

Th.defaultProps = {
  fontWeight: 'bold',
};

export default Th;
