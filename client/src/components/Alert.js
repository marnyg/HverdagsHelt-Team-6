//@flow

import * as React from 'react';
import { Component } from 'react-simplified';

//Ulike farger for feilmeldinger:
/*
-danger
-warning
-info
-success
*/

class Alert extends Component<{type: string, text: any}>{

  shouldComponentUpdate(nextProps: any) {
        const differentType = this.props.type !== nextProps.type;
        const differentText = this.props.text !== nextProps.text;
        return differentType || differentText;
    }
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
