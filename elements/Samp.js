import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  color,
  borders,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const Samp = styled(tag.samp)(
  space,
  width,
  fontSize,
  color,
  borders,
  borderRadius,
  {
    boxSizing: 'border-box',
    fontFamily: 'monospace, monospace',
  },
);

Samp.defaultProps = {
  fontSize: 2,
};

export default Samp;
