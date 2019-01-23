// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import Alert from '../src/components/Alert.js';
import { shallow, mount } from 'enzyme';

describe('Alert tests', () => {
  it('Sjekk om Alert opprettes', () => {
    const wrapper = shallow(<Alert />);
    expect(wrapper.exists()).toBe(true);
  });

  it('Legg inn Alert verdier', () => {
    const wrapper = shallow(<Alert type='danger' text='Her er det en feil'/>);
    expect(wrapper.contains(
      <div className={"alert alert-danger alert-dismissible fade show"} role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        Her er det en feil
      </div>
    )).toBe(true);
  });
});
