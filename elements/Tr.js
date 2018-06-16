import styled from 'react-emotion';
import { space, width, fontSize, color } from 'styled-system';
import tag from 'clean-tag';

const Tr = styled(tag.tr)(space, width, fontSize, color, {});

Tr.defaultProps = {};

export default Tr;
