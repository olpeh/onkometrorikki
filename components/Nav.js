import React from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import {
  space,
  width,
  display,
  flex,
  alignItems,
  justifyContent,
  fontSize,
  fontWeight,
  textAlign,
  lineHeight,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
  hover,
  focus,
  active,
} from 'styled-system';
import Div from '../elements/Div';
import Nav from '../elements/Nav';

const NavLink = styled(Link)(
  space,
  width,
  display,
  fontSize,
  fontWeight,
  textAlign,
  lineHeight,
  color,
  borders,
  borderColor,
  borderWidth,
  borderRadius,
  hover,
  focus,
  active,
  {
    boxSizing: 'border-box',
  },
);

const SiteNav = ({ currentRoute, routes }) => (
  <Div pt={4} px={[4, 5, 6]}>
    <Nav mx={[-2, -2, -3]} display="flex" alignItems="center">
      Nav:
      {routes.map(route => (
        <NavLink
          mx={3}
          p={2}
          fontSize={2}
          color="blue.5"
          hover={{
            color: 'blue.7',
          }}
          borderRadius={1}
          bg={route === currentRoute ? 'gray.2' : 'transparent'}
          active={{ color: 'blue.5' }}
          to={route.path}
          css={{ textDecoration: 'none' }}
        >
          {route.name}
        </NavLink>
      ))}
    </Nav>
  </Div>
);

export default SiteNav;
