import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  fontWeight,
  textAlign,
  color,
  borders,
} from 'styled-system';
import tag from 'clean-tag';

const verticalAlign = props => ({
  verticalAlign: props.verticalAlign ? props.verticalAlign : 'middle',
});

const Td = styled(tag.td)(
  space,
  width,
  fontSize,
  fontWeight,
  textAlign,
  color,
  borders,
  verticalAlign,
  {},
);

Td.defaultProps = {};

export default Td;
