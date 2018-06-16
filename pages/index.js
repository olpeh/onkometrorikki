import React from 'react';
import Div from '../elements/Div';
import H1 from '../elements/H1';
import P from '../elements/P';
import A from '../elements/A';
import theme from '../theme';
import { css } from 'react-emotion';

const linkStyle = css`
  text-decoration-color: ${theme.colors.blue[2]};
`;

const Index = props => (
  <Div fontSize={[2, 3]} color="black.1" bg="bg" py={[5, 6, 7]} px={[4, 5, 6]}>
    <H1 fontSize={[3, 4, 6]} color="fuschia.7" lineHeight="title">
      Proto
    </H1>
    <P lineHeight="copy">
      Setup for prototyping static sites with x0, emotion, styled-system and
      react.
    </P>
    <P lineHeight="copy">Read the docs for more information:</P>
    <A
      fontSize={[2, 3]}
      color="blue.5"
      hover={{
        color: 'blue.7',
        textDecorationColor: theme.colors.blue[7],
      }}
      active={{ color: 'blue.5' }}
      css={linkStyle}
      href="https://github.com/fpapado/proto"
    >
      https://github.com/fpapado/proto
    </A>
  </Div>
);

export default Index;
