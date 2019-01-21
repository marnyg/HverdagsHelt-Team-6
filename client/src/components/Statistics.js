// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import StatService from "../services/StatsService"

class Statistics extends Component {
  data = {};
  data1 = {}
  openedNat = []
  openedRegional = []
  closedRegional = []
  closedNat = []
  natData = []
  regData = []

  statServ = new StatService()
  render() {
    return (
      <div ref="statPage" className="container" style={{ maxWidth: '210mm' }}>
        <div className="row">
          <div className={'col-md'}>
            <Bar data={this.data1} />
            <Doughnut data={this.data} />
            <Pie data={this.data} />
            <Line data={this.data} />
          </div>
          <div className={'col-md'}>
            <p>
              Ad consequat sit esse elit minim sint ad minim exercitation magna deserunt ipsum ad deserunt. Sunt ut do
              anim nulla elit dolor do Lorem tempor magna sit non deserunt exercitation. Mollit fugiat amet qui quis
              sint commodo qui. Ex irure ex eiusmod officia irure. Amet nisi laborum culpa cupidatat excepteur sit magna
              exercitation. Exercitation nostrud tempor duis ut id et nisi aute veniam.
            </p>
            <p>
              Id cillum duis irure consectetur est culpa nostrud voluptate consequat dolor nulla duis Lorem. Cillum
              aliqua minim ullamco officia sint fugiat eiusmod labore ut aute veniam consectetur incididunt. Elit
              voluptate velit non esse magna eu et veniam deserunt eu. Lorem dolor in minim sint Lorem est in veniam ex.
              Esse ipsum sunt pariatur sint sit aliqua laborum commodo minim ut Lorem nulla.
            </p>
            <button className="btn btn-primary" onClick={this.generatePdf}>
              Last ned som PDF
            </button>
            <button className="btn btn-primary" onClick={

              () => console.log(this.openedNat, this.openedRegional, this.closedRegional, this.closedNat)
            } >
              log
            </button>

          </div>
        </div>
      </div >
    );
  }
  mounted() {
    // this.changeData();
    setInterval(this.formatData, 3000);

    this.getalldata()

  }
  getalldata() {
    this.statServ.getNatCasesOpenedInYear(2019)
      .then(e => this.openedNat = e)

      .then(() => this.statServ.getNatCasesClosedInYear(2019)
        .then(e => this.closedNat = e))

      .then(() => this.statServ.getCasesClosedInYearInRegion(2019, 44)
        .then(e => this.closedRegional = e))

      .then(() => this.statServ.getCasesOpenedInYearInRegion(2019, 44)
        .then(e => this.openedRegional = e))
      .then(() => {
        this.regData = this.joinData(this.openedRegional, this.closedRegional)
        this.natData = this.joinData(this.openedNat, this.closedNat)
      }).then(() => this.formatData())
  }
  joinData(opened, closed) {
    let newt = []

    opened = JSON.parse(JSON.stringify(opened))
    closed = JSON.parse(JSON.stringify(closed))
    for (let i = 1; i < 13; i++) {
      let closedNum = 0
      let openedNum = 0
      let tmp = opened.find(e => e.month === i)

      if (tmp) {
        openedNum = tmp.opened_cases
      }

      tmp = closed.find(e => e.month === i)
      if (tmp) {
        closedNum = tmp.closed_cases
      }

      newt.push({ closed_cases: closedNum, opened_cases: openedNum, month: i })


    }
    return newt


  }


  formatData() {
    console.log(this.natData);

    this.data1 = {

      labels: ['January', 'February', 'March', "a", "a", "a", "a", "a", "a", "a", "a", "a"],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          data: this.natData.map(e => {

            return { lables: ["asd", "as"], data: [e.opened_cases, e.closed_cases] }
          })

        }
      ]
    }
    console.log(JSON.parse(JSON.stringify(this.data1)));

  }
  // changeData() {
  //   this.data = {
  //     labels: ['January', 'February', 'March'],
  //     datasets: [
  //       {
  //         label: 'My First dataset',
  //         backgroundColor: 'rgba(255,99,132,0.2)',
  //         borderColor: 'rgba(255,99,132,1)',
  //         borderWidth: 1,
  //         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
  //         hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
  //         data: [this.getRandomInt(50, 200), this.getRandomInt(100, 150), this.getRandomInt(150, 250)]
  //       }
  //     ]
  //   };
  //   console.log(this.data.datasets[0].data);
  // }

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

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default Statistics;
