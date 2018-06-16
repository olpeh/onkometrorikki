import styled from 'react-emotion';
import {
  space,
  display,
  width,
  fontSize,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const Main = styled(tag.main)(
  space,
  display,
  width,
  fontSize,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
  {
    boxSizing: 'border-box',
  },
);

Main.defaultProps = {
  w: 1,
};

export default Main;
