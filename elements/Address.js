import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  color,
  borders,
  borderWidth,
  borderColor,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const Address = styled(tag.address)(
  space,
  display,
  width,
  fontSize,
  color,
  borders,
  borderWidth,
  borderColor,
  borderRadius,
  {},
);

Address.defaultProps = {};

export default Address;
