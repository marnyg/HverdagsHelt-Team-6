// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import StatService from '../services/StatsService';

class Statistics extends Component {
  data = {};
  data1 = {};
  openedNat = [];
  openedRegional = [];
  closedRegional = [];
  closedNat = [];
  catStatNat = []
  catStatReg = []
  natData = [];
  regData = [];

  options = null;

  statServ = new StatService();
  render() {
    return (
      <div className="container">
        <div className="row">
          <div ref="statPage" className="col" style={{ maxWidth: '210mm', minWidth: '210mm' }}>
            <div className="row">
              <h2 className="row">National statistik</h2>
              <div className="row">
                <div className="col" style={{ maxWidth: "150mm", minWidth: '150mm' }} >
                  <Bar data={this.data} />
                </div>
                <p className="col" >
                  Ad consequat sit esse elit minim sint ad minim exercitation magna deserunt ipsum ad deserunt. Sunt ut do
                  anim nulla elit dolor do Lorem tempor magna sit non deserunt exercitation.
            </p>
              </div>
            </div>

            <div className="row">
              <h2 className="row">Regional statistik</h2>
              <div className="row">
                <div className="col" style={{ maxWidth: "150mm", minWidth: '150mm' }} >
                  <Bar data={this.data1} />
                </div>
                <p className="col" >
                  Ad consequat sit esse elit minim sint ad minim exercitation magna deserunt ipsum ad deserunt. Sunt ut do
                  anim nulla elit dolor do Lorem tempor magna sit non deserunt exercitation.
            </p>
              </div>
            </div>
            {/* <div >
                  <Pie className="col" data={this.data} />
                  <Pie className="col" data={this.data} />

                {/* </div> */}
            {/* </div> */}

          </div>
          <div className="col">
            <h3>toolbar</h3>
            <p>Eiusmod minim amet eiusmod adipisicing aliqua occaecat adipisicing reprehenderit voluptate sit occaecat laboris nostrud adipisicing. Id mollit reprehenderit ad magna incididunt minim irure et deserunt esse nisi. Minim occaecat est aliqua in magna sunt nostrud.</p>
            <button className="btn btn-primary" onClick={this.generatePdf}>
              Last ned som PDF
            </button>
            <button
              className="btn btn-primary"
              onClick={() =>
                console.log(this.refs.bar, this.catStatNat, this.catStatReg)
              }
            >
            </button>
          </div>
        </div>
      </div >
    );
  }
  mounted() {
    this.getalldata();
  }
  getalldata() {
    this.statServ
      .getNatCasesOpenedInYear(2019)
      .then(e => (this.openedNat = e))
      .then(() => this.statServ.getNatCasesClosedInYear(2019).then(e => (this.closedNat = e)))
      .then(() => this.statServ.getCasesClosedInYearInRegion(2019, 44).then(e => (this.closedRegional = e)))
      .then(() => this.statServ.getCasesOpenedInYearInRegion(2019, 44).then(e => (this.openedRegional = e)))
      .then(() => this.statServ.getStatsCatYearNational(2019).then(e => (this.catStatNat = e)))
      .then(() => this.statServ.getStatsCatYearInRegion(2019, 44).then(e => (this.catStatReg = e)))
      .then(() => {
        this.regData = this.joinData(this.openedRegional, this.closedRegional);
        this.natData = this.joinData(this.openedNat, this.closedNat);
      })
      .then(() => {
        this.data = this.formatBarData(this.natData);
        this.data1 = this.formatBarData(this.regData);
      });
  }
  joinData(opened, closed) {
    let newt = [];
    opened = JSON.parse(JSON.stringify(opened));
    closed = JSON.parse(JSON.stringify(closed));
    for (let i = 1; i < 13; i++) {
      let closedNum = 0;
      let openedNum = 0;
      let tmp = opened.find(e => e.month === i);
      if (tmp) {
        openedNum = tmp.opened_cases;
      }
      tmp = closed.find(e => e.month === i);
      if (tmp) {
        closedNum = tmp.closed_cases;
      }
      newt.push({ closed_cases: closedNum, opened_cases: openedNum, month: i });
    }
    return newt;
  }

  formatBarData(data) {
    return {
      label: 'Nasjonalt',
      labels: ['January', 'February', 'March', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'],
      datasets: [
        {
          label: 'Saker opprettet',
          borderWidth: 1,
          backgroundColor: '#36A2EB',
          // hoverBackgroundColor: ['#36A2EB'],
          data: data.map(e => e.opened_cases)
        },
        {
          label: 'Saker lukket ',
          borderWidth: 1,
          backgroundColor: '#FFCE56',
          // hoverBackgroundColor: ['#FFCE56',
          data: data.map(e => e.closed_cases)
        }
      ]
    };
  }

  generatePdf() {
    let input = this.refs.statPage;
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save('download.pdf');
    });
  }
}

export default Statistics;
