import { observable, action, computed } from 'mobx';
import { v4 as uuid } from 'uuid';

export enum FrameResult {
  Incomplete,
  Open,
  Spare,
  Strike,
  Complete, // used for frame
}

export class Frame {
  isLastFrame = false;

  @observable roll1: number | null = null;

  @observable roll2: number | null = null;

  @observable roll3: number | null = null;

  @observable score: number | null = null;

  @computed get result(): FrameResult {
    if (!this.roll1) return FrameResult.Incomplete;

    if (!this.isLastFrame) {
      if (this.roll1 === 10) return FrameResult.Strike;
      if (this.roll2 === null) return FrameResult.Incomplete;
      if (this.roll1 + this.roll2 === 10) return FrameResult.Spare;
      return FrameResult.Open;
    } else {
      if (this.roll2 === null) return FrameResult.Incomplete;

      console.log(this);

      // if our first roll of round 10 is a strike or our second roll is a spare
      if (this.roll1 === 10 || this.roll1 + this.roll2 === 10) {
        if (this.roll3 === null) return FrameResult.Incomplete;
        return FrameResult.Complete;
      }

      return FrameResult.Complete;
    }
  }

  @action setRoll1(value: number) {
    if (isNaN(value)) {
      this.roll1 = null;
    } else if (value > 10) {
      this.roll1 = 10;
    } else if (value < 0) {
      this.roll1 = 0;
    } else {
      this.roll1 = value;
    }
    this.roll2 = null;
    this.roll3 = null;
  }

  @action setRoll2(value: number) {
    if (this.roll1 === null) return;
    if (isNaN(value)) {
      this.roll2 = null;
    } else {
      if (!this.isLastFrame) {
        if (this.roll1 + value > 10) {
          this.roll2 = 10 - this.roll1;
        } else {
          this.roll2 = value;
        }
      } else {
        if (this.roll1 === 10) {
          if (value > 10) this.roll2 = 10;
          if (value < 0) this.roll2 = 0;
          this.roll2 = value;
        } else {
          if (this.roll1 + value > 10) {
            this.roll2 = 10 - this.roll1;
          } else {
            this.roll2 = value;
          }
        }
      }
    }
  }

  @action setRoll3(value: number) {
    if (this.roll1 === null) return;
    if (this.roll2 === null) return;
    if (this.roll1 !== 10 && this.roll1 + this.roll2 !== 10) return;
    if (isNaN(value)) {
      this.roll3 = null;
    } else {
      if (value > 10) this.roll3 = 10;
      if (value < 0) this.roll3 = 0;
      this.roll3 = value;
    }
  }

  @action clear() {
    this.roll1 = null;
    this.roll2 = null;
    this.roll3 = null;
    this.score = null;
  }
}

export class Bowler {
  id = uuid();

  @observable name = 'Player Name';

  @observable frames = new Array<Frame>();

  constructor(name: string) {
    this.name = name;
    for (var i = 0; i < 10; i++) {
      let frame = new Frame();
      frame.isLastFrame = i === 9;
      this.frames.push(frame);
    }
  }

  @action updateScore() {
    let total = 0;

    for (var i = 0; i < 10; i++) {
      switch (this.frames[i].result) {
        case FrameResult.Incomplete:
          return;
        case FrameResult.Open:
          total += (this.frames[i].roll1 || 0) + (this.frames[i].roll2 || 0);
          this.frames[i].score = total;
          break;
        case FrameResult.Spare:
          if (this.frames[i + 1].result === FrameResult.Incomplete) return;
          total += 10 + (this.frames[i + 1].roll1 || 0);
          this.frames[i].score = total;
          break;
        case FrameResult.Strike:
          const nextFrame = this.frames[i + 1];
          switch (nextFrame.result) {
            case FrameResult.Incomplete:
              return;
            case FrameResult.Open:
            case FrameResult.Spare:
              total += 10 + (nextFrame.roll1 || 0) + (nextFrame.roll2 || 0);
              this.frames[i].score = total;
              break;
            case FrameResult.Strike:
              const nextNextFrame = this.frames[i + 2];
              if (nextNextFrame.roll1 === null) return;
              total += 20 + (nextNextFrame.roll1 || 0);
              this.frames[i].score = total;
              break;
            case FrameResult.Complete:
              // at this point we know the next frame is frame 10
              console.log('frame complete');
              if (nextFrame.roll1 === null) return;
              if (nextFrame.roll2 === null) return;
              total += 10 + nextFrame.roll1 + nextFrame.roll2;
              this.frames[i].score = total;
              break;
          }
          break;
        case FrameResult.Complete:
          total +=
            (this.frames[i].roll1 || 0) +
            (this.frames[i].roll2 || 0) +
            (this.frames[i].roll3 || 0);
          this.frames[i].score = total;
          break;
      }
    }

    this.frames.forEach((frame, idx) => {});
  }

  @action clearFrames() {
    this.frames.forEach((frame) => {
      frame.clear();
    });
  }
}

export default class GameStore {
  @observable bowlers = new Array<Bowler>();

  constructor() {
    this.addBowler('Jon Spaeth');
  }

  @action addBowler(name: string) {
    this.bowlers.push(new Bowler(name));
    console.log(`added bowler ${this.bowlers[this.bowlers.length - 1].id}`);
  }

  @action removeBowler(id: string) {
    this.bowlers = this.bowlers.filter((b) => b.id !== id);
  }

  @action clearBowlers() {
    this.bowlers = new Array<Bowler>();
  }
}
