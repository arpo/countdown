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

	var onready = function () {

		MOS.countdown.add({
			name: 'My vacation starts',
			date: [2017, 6, 17, 17, 0],
			onEvent: function (eventObj) {
				console.log(eventObj.name + ' is here!');
			}
		});

		MOS.countdown.add({
			name: 'Weekend',
			date: MOS.countdown.tgif(),
			onEvent: function (eventObj) {
				console.log(eventObj.name + ' is here!');
			}
		});

		MOS.countdown.start();

	};

	MOS.countdown.setup({
		target: {
			'evName': '#evName',
			'days': '#days',
			'hours': '#hours',
			'minutes': '#minutes',
			'seconds': '#seconds'
		},
		zone: 'Europe/Stockholm', //https://github.com/davidayalas/current-time
		onready: onready
	});