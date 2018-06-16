import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  fontWeight,
  textAlign,
  color,
} from 'styled-system';
import tag from 'clean-tag';

const Details = styled(tag.details)(
  space,
  display,
  width,
  fontSize,
  fontWeight,
  textAlign,
  color,
  {},
);

Details.defaultProps = {
  display: 'block',
};

export default Details;
