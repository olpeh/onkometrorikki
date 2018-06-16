import styled from 'react-emotion';
import { space, fontSize, fontWeight, lineHeight, color } from 'styled-system';
import tag from 'clean-tag';

const Sub = styled(tag.sub)(space, fontSize, fontWeight, lineHeight, color, {});

Sub.defaultProps = {};

export default Sub;
