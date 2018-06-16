import styled from 'react-emotion';
import { space, width, fontSize, color } from 'styled-system';
import tag from 'clean-tag';

const S = styled(tag.s)(space, width, fontSize, color, {});

S.defaultProps = {};

export default S;
