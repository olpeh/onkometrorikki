import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  color,
} from 'styled-system';
import tag from 'clean-tag';

const B = styled(tag.b)(
  space,
  width,
  fontSize,
  fontWeight,
  lineHeight,
  color,
  {},
);

B.defaultProps = {
  fontWeight: 'bolder',
};

export default B;
