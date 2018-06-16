import styled from 'react-emotion';
import { space, fontSize, fontWeight, color } from 'styled-system';
import tag from 'clean-tag';

const Strong = styled(tag.strong)(space, fontSize, fontWeight, color, {});

Strong.defaultProps = {
  fontWeight: 'bolder',
};

export default Strong;
