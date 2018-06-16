import styled from 'react-emotion';
import { space, width, fontSize, color } from 'styled-system';
import theme from '../theme';
import tag from 'clean-tag';

const Var = styled(tag.var)(space, width, fontSize, color, {
  fontFamily: theme.fontFamily.mono,
});

Var.defaultProps = {};

export default Var;
