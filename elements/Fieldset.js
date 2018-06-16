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

const Fieldset = styled(tag.fieldset)(
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

Fieldset.defaultProps = {};

export default Fieldset;
