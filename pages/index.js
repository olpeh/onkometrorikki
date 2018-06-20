import React from 'react';
import Div from '../elements/Div';
import H1 from '../elements/H1';
import H2 from '../elements/H2';
import P from '../elements/P';
import A from '../elements/A';
import Span from '../elements/Span';
import theme from '../theme';
import { css } from 'react-emotion';

export default class Index extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const status = this.fetchStatus().then(status => {
      console.log(status);
      this.setState({ loading: false, status: status });
    });
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
        <H1 fontSize={[3, 4, 6]} color="metro.0" lineHeight="title">
          Onko Länsimetro rikki?
        </H1>
        <Div>
          {this.state.loading ? (
            <P lineHeight="copy">Ladataan statusta...</P>
          ) : this.state.status ? (
            this.state.status.broken ? (
              <Div>
                <H2 fontSize={[3, 4, 6]} color="red.6" lineHeight="copy">
                  Kyllä!
                </H2>
                {this.state.status.reasons &&
                  this.state.status.reasons.map(reason => (
                    <Span>{reason}</Span>
                  ))}
              </Div>
            ) : (
              <H1 fontSize={[3, 4, 6]} color="green.8" lineHeight="copy">
                Ei!
              </H1>
            )
          ) : (
            <P lineHeight="copy">Jokin on pielessä :/</P>
          )}
        </Div>
      </Div>
    );
  }

  fetchStatus() {
    console.log('Trying to fetch status form the API');
    const url = 'https://onkolansimetrorikki.herokuapp.com/api/isitbroken';
    return fetch(url)
      .then(response => {
        return response.json();
      })
      .catch(error => console.error(error));
  }
}
