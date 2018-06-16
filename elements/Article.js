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

const Article = styled(tag.article)(
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

Article.defaultProps = {
  w: 1,
};

export default Article;
