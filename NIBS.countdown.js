var log = function (m) {
	if(console) console.log(m);
};
var NIBS = window.NIBS || {};

/**
 * Create and handle countdown to a specific time and date. Can handle multiple events. Requires jQuery.

 * HTML looks like this:

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

	* And the JavaScript can look like this:

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
 *
 * @version 1.0
 * @class NIBS.countdown
 * @author Mattias Johansson
 * @requires jQuery
 **/

NIBS.countdown = (function () {

	///////////////////////////////////////////////////////////////////////
	// Private methods & properties
	///////////////////////////////////////////////////////////////////////

	var $days,
		$hours,
		$minutes,
		$seconds,
		$evName,
		_currentEvents,
		_lastcurrentEvents = {
			time: ''
		},
		_events = [],
		_timer;

	/**
	 * Private function:
	 * Return date and time of next friday 5 pm.
	 * @method _tgif
	 * @returns {Array} Array of info for next friday in this order: 0:Year 1:month 2:date 3:hour 4:minutes.
	 **/

	function _tgif() {
		var tmpEv = new Date(),
			rv = [];
		tmpEv.setDate(tmpEv.getDate() + (7 + 5 - tmpEv.getDay()) % 7);
		tmpEv.setHours(17);
		tmpEv.setMinutes(0);
		tmpEv.setSeconds(60 - (new Date()).getSeconds());

		rv.push(tmpEv.getFullYear());
		rv.push(tmpEv.getMonth() + 1);
		rv.push(tmpEv.getDate());
		rv.push(tmpEv.getHours());
		rv.push(tmpEv.getMinutes());
		return rv;
	}

	/**
	 * Private function:
	 * Sort an array with objects by date which is stored in property 'time'.
	 * @method _sortByDate
	 * @param toSort {Array} Array of objects to sort.
	 * @returns {Array} Array of sorted objects.
	 **/

	function _sortByDate(toSort) {
		toSort.sort(function (a, b) {
			a = new Date(a.time);
			b = new Date(b.time);
			return a < b ? -1 : a > b ? 1 : 0;
		});
		return toSort;
	}

	/**
	 * Private function:
	 * Start the countdown.
	 * @method _start
	 **/

	function _start() {
		if(_events.length === 0) {
			log('No events found');
			return;
		}
		_currentEvents = _events[0];
		$evName.html(_currentEvents.name);
		_currentEvents.onCountdownStart(_currentEvents);
		_actions();
		_timer = setInterval(_actions, 1000);
	}

	/**
	 * Private function:
	 * Stop the countdown.
	 * @method _stop
	 **/

	function _stop() {
		clearInterval(_timer);
		_timer = null;
	}

	/**
	 * Private function:
	 * Setup countdown environment.
	 * @method _setup
	 * @param initObj {Object} Object with strings with jQuery selctors to elements to display countdown info on. 

			days: jQuery selctors to elements to display days left in
			hours: jQuery selctors to elements to display hours left in
			minutes: jQuery selctors to elements to display minutes left in
			seconds: jQuery selctors to elements to display seconds left in
			evName: jQuery selctors to elements to display name of event in
	 * @example
		NIBS.countdown.setup({
			target: {
				'evName': '#evName',
				'days': '#days',
				'hours': '#hours',
				'minutes': '#minutes',
				'seconds': '#seconds'
			}
		});
	 **/

	function _setup(initObj) {
		$days = $(initObj.target.days);
		$hours = $(initObj.target.hours);
		$minutes = $(initObj.target.minutes);
		$seconds = $(initObj.target.seconds);
		$evName = $(initObj.target.evName);
	}


	/**
	 * Private function:
	 * Adds an event.
	 * @method _add
	 * @param event {Object} An object describing the event.
	 * @example
		NIBS.countdown.add({
			name: 'Julafton',
			date: [2017, 12, 24, 0, 10],
			onEvent: function (eventObj) {
				log(eventObj.name + ' is here!');
			}
		});
	 **/

	function _add(event) {
		var tmpEv = new Date(),
			nowDate = new Date(),
			doAdd = true,
			oldEventsName;
		tmpEv.setYear(event.date[0]);
		tmpEv.setMonth(event.date[1] - 1);
		tmpEv.setDate(event.date[2]);
		tmpEv.setHours(event.date[3]);
		tmpEv.setMinutes(event.date[4]);
		tmpEv.setSeconds(0);
		event.time = tmpEv;

		if(!event.onCountdownStart) {
			event.onCountdownStart = function () {};
		}

		var len = _events.length,
			i;
		for(i = 0; i < len; i += 1) {

			if(_events[i].time.toString() === event.time.toString()) {
				doAdd = false;
				oldEventsName = _events[i].name;
				_events[i].name = event.name;
				_events[i].onEvent = event.onEvent;
				_events[i].onCountdownStart = event.onCountdownStart;
			}
		}

		if(doAdd) {
			if(tmpEv > nowDate) { //Only add events that hasen't occur
				_events.push(event);
				_events = _sortByDate(_events);
				if(_timer) { //Count down is running
					_currentEvents = _events[0];
					$evName.html(_currentEvents.name);
					_actions();
				}

			} else {
				log('\'' + event.name + '\' not added. Date has already occurred.');
			}
		} else {
			log('Doublet found. \'' + oldEventsName + '\' replaced wirh \'' + event.name + '\'.');
		}
	}

	/**
	 * Private function:
	 * Remove all added events.
	 * @method _clear
	 **/
	_clear = function () {
		_events = [];
	}

	/**
	 * Private function:
	 * Get remaining time for current event.
	 * @method _getRemainingTime
	 * @param event {Object} An object describing the event.
	 * @returns {Object} An object with remaining time.
	 **/

	function _getRemainingTime(event) {

		var seconds,
			minutes,
			hours,
			days,
			nowDate;

		nowDate = new Date();
		timestamp = Math.floor((event.time.getTime() - nowDate.getTime()) / 1000);
		timestamp = Number(timestamp);
		seconds = timestamp % 60;
		minutes = ((timestamp - seconds) / 60) % 60;
		hours = ((timestamp - minutes * 60 - seconds) / 3600) % 24;
		days = (timestamp - hours * 3600 - minutes * 60 - seconds) / 86400;

		return {
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds,
			'sum': days + hours + minutes + seconds
		};
	}

	/**
	 * Private function:
	 * Function being called every second to update the display of current event.
	 * @method _actions
	 **/

	function _actions() {

		if(_lastcurrentEvents.time.toString() !== _currentEvents.time.toString()) {
			$evName.html(_currentEvents.name);
			_currentEvents.onCountdownStart(_currentEvents);
		}

		_lastcurrentEvents = _currentEvents;

		var remainingTime = _getRemainingTime(_currentEvents);

		if(remainingTime.sum === 0) { //Event occur
			$seconds.html(0);
			_currentEvents.onEvent(_currentEvents);
		} else if(remainingTime.sum > 0) { //Still counting down
			if($days) {
				$days.html(remainingTime.days);
			}
			if($hours) {
				$hours.html(remainingTime.hours);
			}
			if($minutes) {
				$minutes.html(remainingTime.minutes);
			}
			if($seconds) {
				$seconds.html(remainingTime.seconds);
			}
		} else { //Event has happened
			_events.shift();
			_stop();
			_start();
		}
	}

	/**
	 * Private function:
	 * List all events. Run it from the consol.
	 * @method _list
	 * @example
		NIBS.countdown.list();
	 **/

	function _list() {
		var len = _events.length,
			i, out = '';
		for(i = 0; i < len; i += 1) {
			out += _events[i].name + ' ' + _events[i].time + '\n'
		}
		log(out);
	}

	///////////////////////////////////////////////////////////////////////
	// Public methods & properties
	///////////////////////////////////////////////////////////////////////
	return {
		/**
		 * Public function:
		 * Calles the private function _setup.
		 * @method NIBS.countdown.setup
		 **/
		setup: _setup,
		/**
		 * Public function:
		 * Calles the private function _start.
		 * @method NIBS.countdown.start
		 **/
		start: _start,
		/**
		 * Public function:
		 * Calles the private function _stop.
		 * @method NIBS.countdown.stop
		 **/
		stop: _stop,
		/**
		 * Public function:
		 * Calles the private function _add.
		 * @method NIBS.countdown.add
		 **/
		add: _add,
		/**
		 * Public function:
		 * Calles the private function _clear.
		 * @method NIBS.countdown.clear
		 **/
		clear: _clear,
		/**
		 * Public function:
		 * Calles the private function _tgif.
		 * @method NIBS.countdown.tgif
		 **/
		tgif: _tgif,
		/**
		 * Public function:
		 * Calles the private function _list.
		 * @method NIBS.countdown.list
		 **/
		list: _list
	};
}());