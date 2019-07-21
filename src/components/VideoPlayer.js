import React, { Component } from "react";
import "./VideoPlayer.css";

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }
  state = {
    currentDuration: { hours: "00", minutes: "00", seconds: "00" },
    completeDuration: { hours: "00", minutes: "00", seconds: "00" },
    isPlaying: false,
    progressPercentage: 0
  };

  componentDidMount() {
    console.log(this.videoRef);
  }

  updateCompleteDuration = () => {
    let duration = this.videoRef.current.duration;
    this.setState({
      completeDuration: calculateDuration(duration)
    });
  };

  updateCurrentDuration = () => {
    let currentTime = this.videoRef.current.currentTime;
    let duration = this.videoRef.current.duration;
    this.setState({
      currentDuration: calculateDuration(currentTime),
      progressPercentage: getPercentage(
        currentTime.toFixed(2),
        duration.toFixed(2)
      )
    });
    console.log(this.state.progressPercentage);
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

  render() {
    let progressStyle = {
      width: this.state.progressPercentage + "%"
    };
    return (
      <div>
        <div className="videoPlayer">
          <video
            src={this.props.src}
            ref={this.videoRef}
            onTimeUpdate={this.updateCurrentDuration}
            onLoadedData={this.updateCompleteDuration}
            onEnded={this.updateEnded}
            onProgress={() => {
              console.log("progress");
            }}
          />
          <div className="video-info">
            <div className="progress-bar">
              <span className="progress" style={progressStyle} />
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
