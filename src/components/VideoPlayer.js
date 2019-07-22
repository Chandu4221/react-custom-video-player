import React, { Component } from "react";
import "./VideoPlayer.css";

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.videoPlayer = React.createRef(); //reference for the entire videoPlayer
    this.videoRef = React.createRef(); // reference for the video element
    this.progressBar = React.createRef(); // reference for the progressbar
    this.progress = React.createRef(); // reference for the progress inside the progressbar
  }
  /*
  state contains
  currentTimeInSeconds - current time while the video is playing
  completeDurationInSeconds - complete duration of the video
  currentDuration - show the currentTimeInSeconds as {hours,minutes,seconds}
  completeDuration - show the completeDurationInSeconds as {hours,minutes,seconds}
  isPlaying - determines the play state of the video
  progressPercentage - percentage value of the progress
  */
  state = {
    currentTimeInSeconds: 0,
    completeDurationInSeconds: 0,
    currentDuration: { hours: "00", minutes: "00", seconds: "00" },
    completeDuration: { hours: "00", minutes: "00", seconds: "00" },
    isPlaying: false,
    progressPercentage: 0
  };

  /**
   *onLoadedData - we need to update the completeDurationInSeconds and completeDuration
   */
  updateCompleteDuration = () => {
    let tempDur = this.videoRef.current.duration;
    this.setState({
      completeDurationInSeconds: tempDur,
      completeDuration: calculateDuration(tempDur)
    });
  };

  /**
   * onTimeUpdate - while the video is playing update the currentTimeInSeconds, currentDuration {hours,minutes,seconds} and the progressPercentage
   * toFixed(2) - used to fix the duration values to atmost 2 digits after precision
   */
  updateCurrentDuration = () => {
    let tempCurrentTime = this.videoRef.current.currentTime;
    let tempDur = this.state.completeDurationInSeconds;
    this.setState({
      currentTimeInSeconds: tempCurrentTime,
      currentDuration: calculateDuration(tempCurrentTime),
      progressPercentage: getPercentage(
        tempCurrentTime.toFixed(2),
        tempDur.toFixed(2)
      )
    });
  };

  /**
   *onEnded - once the video is ended set the isPlaying state to false
   */
  updateEnded = () => {
    this.setState({ isPlaying: false });
  };

  /*
    handles the play button click and set the isPlaying to TRUE
  */
  handlePlay = () => {
    this.videoRef.current.play();
    this.setState({ isPlaying: true });
  };

  /**
   * handles the pause state and set the isPlaying to FALSE
   */

  handlePause = () => {
    this.videoRef.current.pause();
    this.setState({ isPlaying: false });
  };

  /**
   * handles the clikc on the progressbar
   *
   * How to Calculate the ProgressPosition
   *  ==> Get the x-coordinate value of the pointer clicked using e.pageX (gives the x position)
   *  ==> get the position of the videoPlayer from left
   *  ==> set the progressPosition = e.pageX - this.videoPlayer.current.offsetLeft (gives the click position on the video player)
   *  ==> we need to calculate the progress bar percentage based on the click - ( click Position / video player width) * 100 --> percentage
   *
   * Setting the current time
   *  ==> currentTime = (click position * video complete duration in seconds) / progressbar width
   */
  handleProgress = e => {
    let progressPosition = e.pageX - this.videoPlayer.current.offsetLeft;
    let progressValue =
      (progressPosition / this.videoPlayer.current.clientWidth) * 100;

    this.setState({
      progressPercentage: progressValue
    });
    this.videoRef.current.currentTime =
      (progressPosition * this.state.completeDurationInSeconds) /
      this.progressBar.current.clientWidth;
  };

  render() {
    /**
     * setting the width of the progress inside progressbar
     */
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

/**
 *  function that takes in the complete duration and returns the duration in format {hours:00,minutes:00,seconds:00}
 */
const calculateDuration = function(duration) {
  let seconds = parseInt(duration % 60);
  let minutes = parseInt((duration % 3600) / 60);
  let hours = parseInt(duration / 3600);

  return {
    hours: pad(hours),
    minutes: pad(minutes.toFixed()),
    seconds: pad(seconds.toFixed())
  };
};

/* used to prepend the single digit value with a Leading 0 and returns in string format*/
const pad = function(number) {
  if (number > -10 && number < 10) {
    return "0" + number;
  } else {
    return number.toString();
  }
};

/**
 * presentTime - currentTime of the vide
 * totalTime - complete Time of the video
 *
 * basic percentage formula which is rounded
 */
const getPercentage = function(presentTime, totalTime) {
  let calcPercentage = (presentTime / totalTime) * 100;
  return Math.round(calcPercentage);
};
