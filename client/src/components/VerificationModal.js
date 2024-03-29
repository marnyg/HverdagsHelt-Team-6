//@flow
import * as React from 'react';
import { Component } from 'react-simplified';

/**
 * General purpose pop-up modal.
 */
class VerificationModal extends Component {
  modal_content: { title: string, body: React.Node, footer: React.Node } = {};

  /**
   * Generates HTML code
   * @returns {*} HTML Element with sub-elements.
   */
  render() {
    return (
      <div
        className="modal fade"
        id="verify-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="verify-modal-label"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="verify-modal-label">
                {this.modal_content.title}
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            {this.modal_content.body ? <div className="modal-body">{this.modal_content.body}</div> : null}
            {this.modal_content.footer ? <div className="modal-footer">{this.modal_content.footer}</div> : null}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Set modal content.
   * @param title Title string of modal
   * @param body React.node body/main content of modal.
   * @param footer React.node footer/sub-content of modal.
   */
  static setcontent(title: string, body: React.Node, footer: React.Node) {
    setTimeout(() => {
      for (let instance of VerificationModal.instances()) {
        instance.modal_content = {
          title: title,
          body: body,
          footer: footer
        };
      }
    }, 10);
  }
}
export default VerificationModal;
