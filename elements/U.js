import styled from 'react-emotion';
import { space, width, fontSize, fontWeight, color } from 'styled-system';
import tag from 'clean-tag';

const U = styled(tag.u)(space, width, fontSize, fontWeight, color, {});

U.defaultProps = {};

export default U;
