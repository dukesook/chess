
// Constants
const defaultTime = 1000 * 60 * 10; // 10 Minutes

export default class Timer {
  timems = 0;      // The time in milliseconds
  interval = null; // The interval returned by setInterval
  period = 10;     // The period of the timer in milliseconds
   

  constructor(startTime = defaultTime) {
    this.timems = startTime;
    
    // Bind method to the instance
    this.decrementTime = this.decrementTime.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    
    // Note:
      // When a function is passed into setInterval, `this` no longer
      // refers to the Timer class. This can be resolved by using an 
      // arrow function (which I don't like), or calling .bind(this).
  }

  start() {
    this.interval = setInterval(this.decrementTime, this.period);
  }


  decrementTime() {
    this.timems -= this.period;
    if (this.timems <= 0) {
      this.reset();
      console.log('Time is up!');
    }
    
  }

  pause() {
    clearInterval(this.interval);
  }

  reset() {
    this.timems = defaultTime;
    clearInterval(this.interval);
  }

  get_time() {
    const time = this.timems;
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / 1000 / 60 / 60) % 24);
    const milliseconds = time % 1000;
    return {hours, minutes, seconds, milliseconds};
  }

  to_string() {
    let { hours, minutes, seconds, milliseconds } = this.get_time();
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    let hundrethseconds = (milliseconds / 10).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}:${hundrethseconds}`;
  }
}