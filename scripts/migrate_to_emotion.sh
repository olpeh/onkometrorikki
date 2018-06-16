#!/bin/bash

# First, replace imports
sed -i -- "s/import glamorous from 'glamorous'/import styled from 'react-emotion'/g" ./elements/*

# Then, replace invocations of 'glamorous' with 'styled'
sed -i -- "s/glamorous\./styled\./g" ./elements/*

# Make sure to set your .babelrc to use babel-emotion!
