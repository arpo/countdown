# Countdown
Countdown to a given date and time


Create and handle countdown to a specific time and date. Can handle multiple events. Requires jQuery.

HTML looks like this:

	<div id="cdCont">
		<div id="evName"></div>
		<div class="CDRow">
			<span>
				<div id="days"></div>
				<div>Days</div>
			</span>
			<span>
				<div id="hours"></div>
				<div>Hours</div>
			</span>
		</div>
		<div class="CDRow">
			<span>
				<div id="minutes"></div>
				<div>Minutes</div>
			</span>
			<span>
				<div id="seconds"></div>
				<div>Seconds</div>
			</span>
		</div>
	</div>

And the JavaScript can look like this:

	NIBS.countdown.setup({
		target: {
			'evName': '#evName',
			'days': '#days',
			'hours': '#hours',
			'minutes': '#minutes',
			'seconds': '#seconds'
		}
	});

	NIBS.countdown.add({
		name: 'Julafton',
		date: [2013, 12, 24, 0, 10],
		onEvent: function (eventObj) {
			log(eventObj.name + ' is here!');
		}
	});