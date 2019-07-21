import React, { Component } from "react";
import "./VideoPlayer.css";

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.videoPlayer = React.createRef();
    this.videoRef = React.createRef();
    this.progressBar = React.createRef();
    this.progress = React.createRef();
  }
  state = {
    currentTimeInSeconds: 0,
    duration: 0,
    currentDuration: { hours: "00", minutes: "00", seconds: "00" },
    completeDuration: { hours: "00", minutes: "00", seconds: "00" },
    isPlaying: false,
    progressPercentage: 0
  };

  componentDidMount() {
    // console.log(this.videoRef);
  }

  updateCompleteDuration = () => {
    let tempDur = this.videoRef.current.duration;
    this.setState({
      duration: tempDur,
      completeDuration: calculateDuration(tempDur)
    });
  };

  updateCurrentDuration = () => {
    let tempCurrentTime = this.videoRef.current.currentTime;
    let tempDur = this.state.duration;
    this.setState({
      currentTimeInSeconds: tempCurrentTime,
      currentDuration: calculateDuration(tempCurrentTime),
      progressPercentage: getPercentage(
        tempCurrentTime.toFixed(2),
        tempDur.toFixed(2)
      )
    });
  };

  updateEnded = () => {
    this.setState({ isPlaying: false });
  };

  handlePlay = () => {
    this.videoRef.current.play();
    this.setState({ isPlaying: true });
  };
  handlePause = () => {
    this.videoRef.current.pause();
    this.setState({ isPlaying: false });
  };
  handleProgress = e => {
    let progressPosition =
      e.pageX - this.videoPlayer.current.offsetLeft; /*calculates the position*/
    let progressValue =
      (progressPosition / this.videoPlayer.current.clientWidth) *
      100; /*gives the percentage*/
    console.log(this.state.duration);
  };

  render() {
    let progressStyle = {
      width: this.state.progressPercentage + "%"
    };
    return (
      <div>
        <div className="videoPlayer" ref={this.videoPlayer}>
          <video
            src={this.props.src}
            ref={this.videoRef}
            onTimeUpdate={this.updateCurrentDuration}
            onLoadedData={this.updateCompleteDuration}
            onEnded={this.updateEnded}
          />
          <div className="video-info">
            <div
              className="progress-bar"
              ref={this.progressBar}
              onClick={e => this.handleProgress(e)}
            >
              <span
                className="progress"
                style={progressStyle}
                ref={this.progress}
              />
            </div>
            <div className="video-controls">
              <div className="start-time time">
                {this.state.currentDuration.hours}:
                {this.state.currentDuration.minutes}:
                {this.state.currentDuration.seconds}
              </div>
              <div className="controls">
                {this.state.isPlaying ? (
                  <button className="control-btn" onClick={this.handlePause}>
                    <i className="material-icons">pause_circle_outline</i>
                  </button>
                ) : (
                  <button className="control-btn" onClick={this.handlePlay}>
                    <i className="material-icons">play_circle_outline</i>
                  </button>
                )}
              </div>
              <div className="end-time time">
                {this.state.completeDuration.hours}:
                {this.state.completeDuration.minutes}:
                {this.state.completeDuration.seconds}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoPlayer;

const calculateDuration = function(duration) {
  var seconds = parseInt(duration % 60);
  var minutes = parseInt((duration % 3600) / 60);
  var hours = parseInt(duration / 3600);

  return {
    hours: pad(hours),
    minutes: pad(minutes.toFixed()),
    seconds: pad(seconds.toFixed())
  };
};

const pad = function(number) {
  if (number > -10 && number < 10) {
    return "0" + number;
  } else {
    return number.toString();
  }
};

const getPercentage = function(presentTime, totalTime) {
  var calcPercentage = (presentTime / totalTime) * 100;
  return Math.round(calcPercentage);
};
