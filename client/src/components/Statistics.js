// @flow
//
import * as React from 'react';
import { Component } from 'react-simplified';
import User from '../classes/User';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

class Statistics extends Component {
  data = {};
  render() {
    return (
      <div ref="statPage" className="container" style={{ maxWidth: '210mm' }}>
        <div className="row">
          <div className={'col-md'}>
            <Bar data={this.data} />
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
          </div>
        </div>
      </div>
    );
  }
  mounted() {
    this.changeData();
    setInterval(this.changeData, 3000);
  }
  changeData() {
    this.data = {
      labels: ['January', 'February', 'March'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          data: [this.getRandomInt(50, 200), this.getRandomInt(100, 150), this.getRandomInt(150, 250)]
        }
      ]
    };
    console.log(this.data.datasets[0].data);
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

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default Statistics;
