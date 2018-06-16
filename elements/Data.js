import styled from 'react-emotion';
import { space, width, fontSize, color } from 'styled-system';
import tag from 'clean-tag';

const Data = styled(tag.data)(space, width, fontSize, color, {});

Data.defaultProps = {};

export default Data;
