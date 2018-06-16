import styled from 'react-emotion';
import { space, fontSize, fontWeight, lineHeight, color } from 'styled-system';
import tag from 'clean-tag';

const Abbr = styled(tag.abbr)(space, fontSize, fontWeight, color, {
  '[title]': {
    borderBottom: 'none',
    textDecoration: 'underline dotted',
  },
});

Abbr.defaultProps = {};

export default Abbr;
