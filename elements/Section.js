import styled from 'react-emotion';
import {
  space,
  width,
  display,
  fontSize,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
} from 'styled-system';
import tag from 'clean-tag';

const Section = styled(tag.section)(
  space,
  width,
  display,
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

Section.defaultProps = {
  w: 1,
};

export default Section;
