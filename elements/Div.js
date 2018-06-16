import styled from 'react-emotion';

import {
  space,
  width,
  display,
  fontSize,
  textAlign,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const maxWidth = props => ({
  maxWidth: props.maxWidth ? props.maxWidth : '100%',
});

const Div = styled(tag.div)(
  space,
  width,
  display,
  fontSize,
  color,
  textAlign,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
  maxWidth,
  {
    boxSizing: 'border-box',
  },
);

Div.defaultProps = {
  w: 1,
};

export default Div;
