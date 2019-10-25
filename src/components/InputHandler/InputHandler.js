import React, { Component } from 'react';
import './InputHandler.css';
let placeholder = 'Type here...';

let currentWordColor = 'black';
let completedWordColor = 'darkgray';
let remainingTextColor = 'black';
let incorrectSpellingColor = 'lightcoral';
let inputBoxInCorrectSpellingColor = 'pink';
let inputBoxColor = 'rgba(255,255,255,0.8)';

let emitter = 0;
let emitInterval = 1000;

export class InputHandler extends Component {
	state = {
		wordIndex: 0,
		spelling: true,
		words: this.props.text.split(' '),
		inputText: '',
		completedText: [],
		remainingText: this.props.text.split(' '),
		startTime: null,
		endTime: null,
		progress: 0,
		overflow: '',
		lastCorrectString: ''
	};

	componentDidMount() {
		this.tick();
		this.resetRemainingTextOverflow();
		this.mounted = true;
		this.finalSend = false;
	}

	resetRemainingTextOverflow = () => {
		if (this.props.text) {
			let remainingTextOverflow = this.props.text.split(' ');
			let rto = [];
			//This foreach might be buggy. Map was used before, but generated warnings.
			remainingTextOverflow.forEach((w, i) => {
				if (i < remainingTextOverflow.length - 1) w = w + ' ';
				rto.push(w);
			});
			this.setState({ remainingTextOverflow: rto });
		}
	};

	componentDidUpdate(prevProps) {
		if (this.props.text !== prevProps.text) {
			this.setState({
				words: this.props.text.split(' '),
				remainingText: this.props.text.split(' ')
			});
		}
	}
	componentWillUnmount() {
		placeholder = 'Type here...';
		this.props.setComplete();
		this.mounted = false;
		clearInterval(emitter);
	}

	tick = () => {
		emitter = setInterval(() => {
			this.emitProgress();
		}, emitInterval);
	};

	emitProgress = () => {
		if (this.mounted) {
			this.setWPM();
			const { progress } = this.state;
			const { wpm, emit, time } = this.props;
			let data = { progress: progress, wpm: wpm, time: time };
			if (
				// !this.finalSend &&
				this.props.startTime &&
				this.props.startTime > Date.now() - 90 * 1000 &&
				this.props.startTime < Date.now() + 90 * 1000
			) {
				this.finalSend = this.props.complete;
				emit(data);
			}
		}
	};

	setWPM = () => {
		let completedCharacters = this.state.completedText.slice().join('').length;
		let time = (Date.now() - this.props.startTime) / 1000;
		if (this.state.endTime)
			time = (this.state.endTime - this.props.startTime) / 1000;
		let wpm = 0;
		if (time > 0) wpm = (completedCharacters / 5 / time) * 60;
		this.props.setWPM(wpm, time);
	};

	handleInput = input => {
		if (this.props.startTime && Date.now() > this.props.startTime) {
			this.setState({ inputText: input, overflow: '' });
			let currentWord = this.state.words[this.state.wordIndex];
			let correctString = currentWord.substring(0, input.length);
			let restString = currentWord.substring(input.length, currentWord.length);
			let onLastWord = this.state.wordIndex === this.state.words.length - 1;

			if (
				(input === currentWord && onLastWord) ||
				(input === currentWord + ' ' && !onLastWord)
			) {
				this.setState({
					inputText: '',
					wordIndex: this.state.wordIndex + 1,
					lastCorrectString: ''
				});
				this.setTextWord(input, onLastWord);
				if (onLastWord) {
					this.setState({ endTime: Date.now() });
					this.props.setComplete();
				}
			} else if (correctString === input) {
				this.resetRemainingTextOverflow();
				this.setState({
					spelling: true,
					lastCorrectString: correctString
				});
				this.setTextLetter(input, restString);
			} else {
				let overflow = this.setOverFlowText(
					input.length - this.state.lastCorrectString.length
				);
				this.setRemainingText(overflow.length);
				this.setState({
					spelling: false,
					overflow: overflow
				});
			}
			this.setProgress();
		}
	};

	setOverFlowText = length => {
		let overflow = this.getRemainingTextAsString();
		let sub = overflow.substring(0, length);
		return sub;
	};

	setRemainingText = overflow => {
		let remainingTextOverflow = this.getRemainingTextAsString();
		this.setState({
			remainingTextOverflow: remainingTextOverflow.substring(
				overflow,
				remainingTextOverflow.length
			)
		});
	};

	getRemainingTextAsString = () => {
		let remainingText = [...this.state.remainingText];
		for (var i = 0; i < remainingText.length - 1; i++) {
			remainingText[i] += ' ';
		}
		remainingText = remainingText.join('');
		return remainingText;
	};

	/**
	 * Adds to the completed typed text and removes that text from the remaining text to type.
	 * This so the completed text and the remaining text can be displayed differently.
	 */
	setTextLetter(input, restString) {
		this.state.completedText.pop();
		this.state.completedText.push(input);
		this.state.remainingText.shift();
		this.state.remainingText.unshift(restString);
	}

	/**
	 * Works similarly to 'setTextLetter' but a little different as a word is completed.
	 */
	setTextWord(input, onLastWord) {
		this.state.completedText.pop();
		this.state.completedText.push(input);
		if (!onLastWord) this.state.completedText.push('');
		this.state.remainingText.shift();
	}

	setProgress = () => {
		let prog = (this.state.completedText.length - 1) / this.state.words.length;
		if (
			this.state.completedText[this.state.wordIndex] ===
				this.state.words[this.state.words.length - 1] &&
			this.state.wordIndex === this.state.words.length - 1
		) {
			prog = 1;
		}
		this.setState({ progress: prog }); //TODO works?
		this.props.setProgress(prog);
	};

	setCurrentWordStyle = () => {
		return this.state.spelling
			? {
					color: currentWordColor,
					textDecoration: 'underline'
			  }
			: {
					color: currentWordColor,
					textDecoration: 'underline'
			  };
	};

	setInputStyle = () => {
		return this.state.spelling === true
			? { background: inputBoxColor }
			: {
					background: inputBoxInCorrectSpellingColor
			  };
	};

	setCompletedTextStyle = () => {
		return { color: completedWordColor };
	};

	setRemainingTextStyle = () => {
		return { color: remainingTextColor };
	};
	setOverFlowStyle = () => {
		return {
			color: incorrectSpellingColor,
			textDecoration: 'underline',
			textDecorationColor: incorrectSpellingColor
		};
	};

	renderStartTime = () => {
		let startTime = '';
		let hide;

		if (this.props.startTime && Date.now() - this.props.startTime < 0) {
			startTime = Math.round(-((Date.now() - this.props.startTime) / 1000));
			if (startTime === 0) startTime = 1;
		} else if (this.props.startTime) {
			placeholder = '';
			hide = { display: 'none' };
			if (this.textInput && this.props.startTime) this.textInput.focus();
		}

		return (
			<div className="startTime" style={hide}>
				{startTime}
			</div>
		);
	};

	renderTextbox = () => {
		let completedText;
		let currentWord;
		if (!this.props.complete) {
			completedText = [...this.state.completedText];
			completedText.pop();
			currentWord = this.state.completedText[
				this.state.completedText.length - 1
			];
		} else {
			completedText = this.state.completedText;
			currentWord = '';
		}
		let currentWordStyle = this.setCurrentWordStyle();
		let completedTextStyle = this.setCompletedTextStyle();
		let overflowStyle = this.setOverFlowStyle();
		let remainingTextStyle = this.setRemainingTextStyle();
		return (
			<div className="text">
				<span style={completedTextStyle}>{completedText}</span>
				<span style={currentWordStyle}>{currentWord}</span>
				<span style={overflowStyle}>{this.state.overflow}</span>
				{this.state.spelling ? (
					<span style={remainingTextStyle}>
						{this.state.remainingText.map(word => word + ' ')}
					</span>
				) : (
					<span style={remainingTextStyle}>
						{this.state.remainingTextOverflow}
					</span>
				)}
			</div>
		);
	};

	renderInputfield = () => {
		let inputStyle = this.setInputStyle();
		return (
			<input
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				spellCheck="false"
				placeholder={placeholder}
				value={this.state.inputText}
				type="text"
				ref={input => {
					this.textInput = input;
				}}
				className="inputfield"
				style={inputStyle}
				onChange={evt => {
					if (!this.props.complete) {
						this.handleInput(evt.target.value);
					}
				}}
			/>
		);
	};

	render() {
		return (
			<div>
				<div className="container">
					{this.renderStartTime()}
					{this.renderTextbox()}
					{this.renderInputfield()}
				</div>
			</div>
		);
	}
}

export default InputHandler;
