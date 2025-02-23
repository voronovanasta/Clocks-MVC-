const GMTNY = -5;
const GMTLONDON = 0;
const GMTBERLIN = 1;
class Clock {
    modelView
    constructor(gmtValue, color){
        this.radius = 120;
        this.angleforCircles = 0;
        this.date = null;
        this.gmt = gmtValue;
        this.id = null;
        this.state = 0;
        this.color = color;
    }

    init(view) {
        this.modelView = view;
        this.modelView.drawRedCircle(this.color);
        this.calcGreenCircle()
        this.modelView.showHourLine();
        this.modelView.showMinLine();
        this.modelView.showSecLine();     
    }

    calcGreenCircle () {
        for(let i = 0; i <= 11; i++){
            this.modelView.drawGreenCircle(i)
            this.angleforCircles += 30;
        }
    }

    updateState(){
      let date = new Date()
      console.log(date)

      let utc = new Date(date)
      
      console.log(utc);
      utc.setUTCHours(utc.getUTCHours() - 3 + this.gmt);
      this.date = utc;
      console.log(utc)

        if(this.state === 1){
          console.log('1')
           this.calcSec()
           this.calcMin()
           this. calcHours()
           this.id= setTimeout(()=>{
            this.updateState();
           }, 1000)
        }
        else{
          console.log('-1')
          console.log('stop')
            clearTimeout(this.id)
        }
    }

    calcSec(){
        const seconds = this.date.getSeconds();
        let secAngle = 360/60 * seconds;
        this.modelView.updateSecLine(secAngle);

    }

    calcMin(){
        const minutes = this.date.getMinutes();
        let minAngle = 360/60 * minutes;
        this.modelView.updateMinLine(minAngle);        
    }

    calcHours(){
        const hours = this.date.getHours();
        const minutes = this.date.getMinutes();
        let hourAngle = 360/12 * hours + 30/60 * minutes;
        this.modelView.updateHourLine(hourAngle);       
    }
}

class Controller {
    clock = null
    container = null
    constructor(model) {
        this.stopBtn = null;
        this.startBtn = null;
        this.clock = model;
    }

    init (container){        
      this.container = container;
      this.eventHandler();

    }

    eventHandler(){
        this.stopBtn = this.container.querySelector('.stop');
        this.startBtn = this.container.querySelector('.start');
        this.stopBtn.addEventListener('click', ()=>{
          this.stop();
        });
        this.startBtn.addEventListener('click', ()=>{
          this.start();
        })
    }

    stop(){
      console.log('stop')
      this.clock.state = 0;
      this.clock.updateState();
    }

    start(){
      this.clock.state = 1;
      this.clock.updateState();
    }
}


class DomView {
  container = null;
  clock = null;
  constructor() {
    this.redCenterX = 0;
    this.redCenterY = 0;
    this.secLine = null;
    this.minLine = null;
    this.hourLine = null;
    this.clockCircle = null;
  }

  init(model, container) {
    this.clock = model;
    this.container = container;
    console.log(this.container)
  }

  drawRedCircle(color) {
    this.clockCircle = document.createElement("div");
    this.clockCircle.className = `circle-clock circle-${color}`;
    this.container.append(this.clockCircle);
  }

  drawGreenCircle(number) {
    this.clockCircle = this.container.querySelector('.circle-clock');
    this.redCenterX = this.clockCircle.offsetWidth/2;
    this.redCenterY = this.clockCircle.offsetHeight/2;

    let green = document.createElement("div");
    green.className = "circle circle-green";
    green.id = "green-circle";
    green.textContent = number === 0 ? 12 : number;
    this.clockCircle.append(green);

    let angleRadians = (parseFloat(this.clock.angleforCircles) / 180) * Math.PI;
    let greenCenterX =
      this.redCenterX + this.clock.radius * Math.sin(angleRadians);
    let greenCenterY =
      this.redCenterY - this.clock.radius * Math.cos(angleRadians);
    green.style.left = Math.round(greenCenterX - green.offsetWidth / 2) + "px";
    green.style.top = Math.round(greenCenterY - green.offsetHeight / 2) + "px";
  }

  showSecLine() {
    this.secLine = document.createElement("div");
    this.secLine.className = "line sec-line";
    this.clockCircle.append(this.secLine);
    this.secLine.style.left = Math.round(this.redCenterY) + "px";
    this.secLine.style.top = Math.round(this.redCenterX) + "px";
  }

  updateSecLine(secAngle) {
    this.secLine.style.transform = "rotate(" + (secAngle - 90) + "deg)";
  }

  showMinLine() {
    this.minLine = document.createElement("div");
    this.minLine.className = "line min-line";
    this.clockCircle.append(this.minLine);
    this.minLine.style.left = Math.round(this.redCenterY) + "px";
    this.minLine.style.top = Math.round(this.redCenterX) + "px";
  }

  updateMinLine(minAngle) {
    this.minLine.style.transform = "rotate(" + (minAngle - 90) + "deg)";
  }

  showHourLine() {
    this.hourLine = document.createElement("div");
    this.hourLine.className = "line hr-line";
    this.clockCircle.append(this.hourLine);
    this.hourLine.style.left = Math.round(this.redCenterY) + "px";
    this.hourLine.style.top = Math.round(this.redCenterX) + "px";
  }

  updateHourLine(hourAngle) {
    this.hourLine.style.transform = "rotate(" + (hourAngle - 90) + "deg)";
  }
}

const container = document.querySelector('.container-ny');
const clock = new Clock(GMTNY, "red");
const view = new DomView();
const controller = new Controller(clock);

view.init(clock, container);
clock.init(view);
controller.init(container)

const container2 = document.querySelector('.container-london');
const clock2 = new Clock(GMTLONDON, "orange");
const view2 = new DomView();
const controller2 = new Controller(clock2);

view2.init(clock2, container2);
clock2.init(view2);
controller2.init(container2);

const container3 = document.querySelector('.container-berlin');
const clock3 = new Clock(GMTBERLIN, "yellow");
const view3 = new DomView();
const controller3 = new Controller(clock3);

view3.init(clock3, container3);
clock3.init(view3);
controller3.init(container3)