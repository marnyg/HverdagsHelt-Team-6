// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';

/**
 * Renders alert messages using Bootstrap classes.
 * Original author: Ole Christian Eidheim.
 */
class Notify extends Component {
  alerts: { text: React.Node, type: string }[] = [];

  render() {
    return (
      <>
        {this.alerts.map((alert, i) => (
            <div key={i} className={"alert alert-" + alert.type + " alert-dismissible fade show"} role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                {alert.text}
            </div>
        ))}
      </>
    );
  }
  
  /**
   * Removes all notifications from this components array of notifications.
   */
  static flush(){
      setTimeout(() => {
          for (let instance of Notify.instances()) instance.alerts = [];
      });
  }
  
  /**
   * Pushes a success-type component into the notifications array.
   * @param text
   */
  static success(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Notify.instances()) instance.alerts.push({ text: text, type: 'success' });
    });
  }
  
  /**
   * Pushes a info-type component into the notifications array.
   * @param text
   */
  static info(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Notify.instances()) instance.alerts.push({ text: text, type: 'info' });
    });
  }
  
  /**
   * Pushes a warning-type component into the notifications array.
   * @param text
   */
  static warning(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Notify.instances()) instance.alerts.push({ text: text, type: 'warning' });
    });
  }
  
  
  /**
   * Pushes a danger-type component into the notifications array.
   * @param text
   */
  static danger(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Notify.instances()) instance.alerts.push({ text: text, type: 'danger' });
    });
  }
}
export default Notify;
