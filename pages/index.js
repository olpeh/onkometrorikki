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

export default class Index extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const status = this.fetchStatus().then(status => {
      console.log(status);
      this.setState({ loading: false, status: status });
    });
    console.log(this.state);
  }

  render() {
    return (
      <Div
        fontSize={[2, 3]}
        color="black.1"
        bg="bg"
        py={[5, 6, 7]}
        px={[4, 5, 6]}
      >
        <H1 fontSize={[3, 4, 6]} color="fuschia.7" lineHeight="title">
          Onko Länsimetro rikki?
        </H1>
        <P lineHeight="copy">
          {this.state.loading
            ? 'Ladataan statusta...'
            : this.state.status
              ? this.state.status.broken
                ? 'Kyllä!'
                : 'Ei!'
              : 'Jokin on pielessä :/'}
        </P>
      </Div>
    );
  }

  fetchStatus() {
    console.log('Trying to fetch status form the API');
    const url = 'https://onkolansimetrorikki.herokuapp.com/api/isitbroken';
    return fetch(url)
      .then(response => {
        const responseCopy = response.clone();
        console.log(responseCopy.json());
        return response.json();
      })
      .catch(error => console.error(error));
  }
}
