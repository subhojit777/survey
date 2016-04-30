import React from 'react';
import ReactHighcharts from 'react-highcharts';

/**
 * Question component.
 *
 * This is used to render question.
 */
class Question extends React.Component {
  render() {
    return (
      <div className="question">{this.props.question}</div>
    );
  }
}

/**
 * Question answer wrapper.
 *
 * This will render the question and it's graph.
 */
export default class QuestionAnswer extends React.Component {
  constructor(props) {
    console.log('hey');
    super(props);

    this.question = props.question;
    this.graphConfig = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Result'
      },
      xAxis: {
        categories: props.questionOptions
      },
      yAxis: {
        title: {
          text: 'Frequency'
        }
      },
      series: [{
        data: this.getAnswersFrequency(props.answers, props.questionOptions)
      }]
    };

    this.state = {
      answers: props.answers
    };
  }
  getAnswersFrequency(answers, questionOptions) {
    // Thanks to http://stackoverflow.com/a/5668029/1233922.
    var tempCount = {};
    var counts = [];

    // Create a temporary array that stores frequency of every answer.
    for(var i = 0; i < answers.length; i++) {
      var answer = answers[i].answer;
      tempCount[answer] = tempCount[answer] ? tempCount[answer] + 1 : 1;
    }

    // Create a data structure suitable for graph rendering.
    for (var i = 0; i < questionOptions.length; i++) {
      // If answer is present for an option, then assign it's frequency.
      // Otherwise, assign 0.
      if (tempCount[questionOptions[i]]) {
        counts.push(tempCount[questionOptions[i]]);
      }
      else {
        counts.push(0);
      }
    }

    return counts;
  }
  componentDidMount() {
    let self = this;

    dpd.answer.on('create', function(answer) {
      // Only update state if answer submitted for the same question that we are
      // currently viewing.
      if (answer.questionId == self.props.questionId) {
        self.setState({
          answers: self.state.answers.concat(answer)
        });
      }
    });
  }
  componentWillUpdate(nextProps, nextState) {
    this.graphConfig.series = [{
      data: this.getAnswersFrequency(nextState.answers, this.props.questionOptions)
    }];
  }
  render() {
    return (
      <div className="question-answer-wrapper">
        <Question question={this.question} />
        <ReactHighcharts config={this.graphConfig}></ReactHighcharts>
      </div>
    );
  }
}
