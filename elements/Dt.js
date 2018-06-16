import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  fontWeight,
  color,
} from 'styled-system';
import tag from 'clean-tag';

const Dt = styled(tag.dt)(
  space,
  display,
  width,
  fontSize,
  fontWeight,
  color,
  {},
);

Dt.defaultProps = {};

export default Dt;
