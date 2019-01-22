// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import StatService from '../services/StatsService';
import UserService from "../services/UserService"

class Statistics extends Component {
  nationalBar = {};
  regionalBar = {};
  openedNat = [];
  openedRegional = [];
  closedRegional = [];
  closedNat = [];
  catStatNat = []
  catStatReg = []
  natDataBar = [];
  regDataBar = [];
  nationalPie = []
  regionalPie = []
  year = 2019

  options = null;

  statServ = new StatService();
  user = JSON.parse(localStorage.getItem("user"))
  region_id = this.user.region_id


  render() {
    return (
      <div className="container">
        <div className="row ">
          <div ref="statPage" className="col border p-5" style={{ maxHeight: '297mm', maxWidth: '210mm', minWidth: '210mm' }}>
            <div className="row">
              <h4 >National statistik</h4>
              <div className="row">
                <div className="col" style={{ maxWidth: "150mm", minWidth: '150mm' }} >
                  <Bar ref="bar1" data={this.nationalBar} />
                </div>
                <p className="col" >
                  Ad consequat sit esse elit minim sint ad minim exercitation magna deserunt ipsum ad deserunt. Sunt ut do
                  anim nulla elit dolor do Lorem tempor magna sit non deserunt exercitation.
            </p>
              </div>
            </div>

            <div className="row">
              <h4 >Regional statistik</h4>
              <div className="row">
                <div className="col" style={{ maxWidth: "150mm", minWidth: '150mm' }} >
                  <Bar data={this.regionalBar} />
                </div>
                <p className="col" >
                  Ad consequat sit esse elit minim sint ad minim exercitation magna deserunt ipsum ad deserunt. Sunt ut do
                  anim nulla elit dolor do Lorem tempor magna sit non deserunt exercitation.
            </p>
              </div>
            </div>

            <div className="row">
              <div className="row">
                <div className="col" style={{ maxWidth: "100mm", minWidth: '100mm' }} >
                  <h4 >National statistik</h4>
                  <Pie data={this.nationalPie} />
                </div>
                <div className="col" style={{ maxWidth: "100mm", minWidth: '100mm' }} >
                  <h4 >Regional statistik</h4>
                  <Pie data={this.regionalPie} />
                </div>
                <p className="col" >
                  Ad consequat sit esse elit minim sint ad minim exercitation magna deserunt ipsum ad deserunt. Sunt ut do
                  anim nulla elit dolor do Lorem tempor magna sit non deserunt exercitation.
            </p>
              </div>
            </div>

          </div>
          <div className="col">
            <h3>toolbar</h3>
            <select ref="year" onChange={this.changeYear}>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
            </select>
            <button className="btn btn-primary" onClick={this.generatePdf}>
              Last ned som PDF
            </button>
            <button
              className="btn btn-primary"
              onClick={() =>
                console.log(this.nationalBar, this.refs.bar1)
              } > log </button>
          </div>
        </div>
      </div >
    );
  }
  mounted() {
    this.getalldata();

  }
  changeYear() {
    this.year = this.refs.year.options[this.refs.year.selectedIndex].value

    this.getalldata()
    console.log(this.refs.bar1)
    console.log(this.nationalBar)
    console.log(this.regionalBar)
    // this.refs.bar1.update()

  }
  getalldata() {
    this.statServ
      .getNatCasesOpenedInYear(this.year)
      .then(e => (this.openedNat = e))
      .then(() => this.statServ.getNatCasesClosedInYear(this.year).then(e => (this.closedNat = e)))
      .then(() => this.statServ.getCasesClosedInYearInRegion(this.year, this.region_id).then(e => (this.closedRegional = e)))
      .then(() => this.statServ.getCasesOpenedInYearInRegion(this.year, this.region_id).then(e => (this.openedRegional = e)))
      .then(() => this.statServ.getStatsCatYearNational(this.year).then(e => (this.catStatNat = e)))
      .then(() => this.statServ.getStatsCatYearInRegion(this.year, this.region_id).then(e => (this.catStatReg = e)))
      .then(() => {
        this.regDataBar = this.joinData(this.openedRegional, this.closedRegional);
        this.natDataBar = this.joinData(this.openedNat, this.closedNat);
      })
      .then(() => {
        this.nationalBar = this.formatBarData(this.natDataBar);
        this.regionalBar = this.formatBarData(this.regDataBar);
        this.nationalPie = this.formatPieData(this.catStatNat)
        this.regionalPie = this.formatPieData(this.catStatReg)
      })
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

  formatPieData(data) {

    return {
      labels: data.map(e => e.category),
      datasets: [
        {
          borderWidth: 1,
          backgroundColor: ['#36A2EB', '#FFCE56', '#5bc0de', '#5cb85c', '#428bca'],
          // hoverBackgroundColor: ['#36A2EB'],
          data: data.map(e => e.count)
        }
      ]
    };
  }
  formatBarData(data) {
    let ds = {
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
    return ds
  }

  generatePdf() {
    let input = this.refs.statPage;

    html2canvas(input, { scale: 1 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF(1, "mm", "a4")
      pdf.addImage(imgData, 'PNG', 1, 0);
      pdf.save('download.pdf');
    });
  }
}

export default Statistics;
