import * as React from 'react';
import { Component } from 'react-simplified';
import Notify from './Notify';
import Picture from '../classes/Picture';

class ImageModal extends Component<{ img: Picture }> {
  render() {
    console.log("IMAGEMODAL!");
    if (this.props.img) {
      return (
        <div className="modal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <img src={this.props.img.src} alt={this.props.img.alt} />
              </div>
              <div className="modal-footer">
                <p>{this.props.img.alt}</p>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                  Lukk
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default ImageModal;
