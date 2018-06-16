import styled from 'react-emotion';
import { space, fontSize, fontWeight, color } from 'styled-system';
import tag from 'clean-tag';

const I = styled(tag.i)(space, fontSize, fontWeight, color, {});

I.defaultProps = {};

export default I;
