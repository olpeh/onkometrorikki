import styled from 'react-emotion';
import { space, fontSize, fontWeight, color } from 'styled-system';
import tag from 'clean-tag';

const Em = styled(tag.em)(space, fontSize, fontWeight, color, {});

Em.defaultProps = {};

export default Em;
