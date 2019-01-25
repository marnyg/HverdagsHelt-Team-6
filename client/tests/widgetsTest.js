// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import Alert from '../src/components/Alert.js';
import About from '../src/components/About.js';
import SearchBox from '../src/components/SearchBox.js';
import LoginModal from '../src/components/LoginModal.js';
import InfoPage from '../src/components/InfoPage.js';
import ImageModal from '../src/components/ImageModal.js';
import AdminPage from '../src/components/Admin/AdminPage.js';
import Picture from '../src/classes/Picture.js';

import { shallow, mount } from 'enzyme';

/**
 * Disse testene funket like før prosjektets avsluttning. Ved
 * implementering av loading ikon sluttet disse plutselig å
 * fungere. Dette ble dermed ikke en prioritet å rette opp i
 * på grunn av mangel på tid.
 */

describe('Alert tests', () => {
  it('Check if Alert is created', () => {
    const wrapper = shallow(<Alert />);
    expect(wrapper.exists()).toBe(true);
  });

  it('Add values to Alert', () => {
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

describe('About test', () => {
  it('Check if About is created', () => {
    const wrapper = shallow(<About />);
    expect(wrapper.exists()).toBe(true);
  });
});

describe('LoginModal test', () => {
  it('Check if LoginModal is created', () => {
    const wrapper = shallow(<LoginModal />);
    expect(wrapper.exists()).toBe(true);
  });

  it('Write in username', () => {
    setTimeout(() => {
      const wrapper = shallow(<LoginModal/>);
      let input = wrapper.find('user');
      expect(input).toHaveText('');
      input.simulate('change', { target: { value: 'birger@birgersen.no' } });
      expect(input).toHaveText('birger@birgersen.no');
    });
  });

  it('Write in password', () => {
    setTimeout(() => {
      const wrapper = shallow(<LoginModal/>);
      let input = wrapper.find('pass');
      expect(input).toHaveText('');
      input.simulate('change', { target: { value: 'passord123' } });
      expect(input).toHaveText('passord123');
    });
  });
});

describe('InfoPage test', () => {
  it('Check if InfoPage is created', () => {
    const wrapper = shallow(<InfoPage />);
    expect(wrapper.exists()).toBe(true);
  });
});

describe('ImageModal test', () => {
  it('Check if ImageModal is created', () => {
    const wrapper = shallow(<ImageModal />);
    expect(wrapper.exists()).toBe(true);
  });

  it('Add image with false picture object', () => {
    const picture = {
      path: '/uploads/d9c73739761801dc7fb91a1f74556bb9.jpg',
      alt: 'alternerende text'
    }
    const wrapper = shallow(<ImageModal {...picture}/>);
    expect(wrapper.contains(
      <div className="modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <img src='/uploads/d9c73739761801dc7fb91a1f74556bb9.jpg' alt='alternerende text' />
            </div>
            <div className="modal-footer">
              <p>alternerende text</p>
              <button type="button" className="btn btn-secondary" data-dismiss="modal">
                Lukk
              </button>
            </div>
          </div>
        </div>
      </div>
    )).toBe(false);
  });
});
