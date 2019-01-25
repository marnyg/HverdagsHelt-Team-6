//@flow

import * as React from 'react';
import { Component } from 'react-simplified';

/**
 * This component is used to show alert messages that appears on the webpage.
 * type:    specifies the type of error that is appearing (warning, danger, info, success
 *          these also representing the colour of the alert message.
 * text:    displaying a given error message.
 */

class Alert extends Component<{type: string, text: any}>{

    /**
     * @param nextProps:    this method is used to update props in the alert component. This makes it
     *                      re-render with new props.
     * @returns {boolean}   returns true / false depending if its updated or not.
     */

  shouldComponentUpdate(nextProps: any) {
        const differentType = this.props.type !== nextProps.type;
        const differentText = this.props.text !== nextProps.text;
        return differentType || differentText;
  }

    /**
     * The render method is rendering the alert-message onto the webpage.
     */


    render() {
    if(!this.props){
      return null;
    }
    return (
      <>
        <div className={"alert alert-" + this.props.type + " alert-dismissible fade show"} role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                  onClick={(event) => (this.props.onClose ? this.props.onClose():null)}>
            <span aria-hidden="true">&times;</span>
          </button>
          {this.props.text}
        </div>
      </>
    );
  }
}
export default Alert;
