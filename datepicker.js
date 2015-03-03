/**
 * options:
 *   value Date или объект {year,month,day}} -- дата, для которой показывать календарь
 *     если в объекте указаны только {year,month}, то день не выбран
 */
function DatePicker(options) {
	var self = this;

	var template = _.template(options.template);

	var year, month, day;
	var showYear, showMonth, nextYear, nextMonth;
	var elem, calLeft, calRight;

	self.getElement = function() {
		if (!elem) render()

		return elem;
	}

	self.setValue = function(newValue, quiet) {
		parseValue(newValue);

		if (!quiet) {
			$(self).triggerHandler({
				type: "select",
				value: new Date(year, month, day)
			});
		};
	}

	self.setValue(options.value, true);

	function render() {
		if (!elem) {
			elem = $(template()).on("click", ".header .prev", onPrevClick)
				.on("click", ".header .next", onNextClick)
				.on("selectstart mousedown", ".header", false);

			showYear = year;
			showMonth = month;

			var nextDate = new Date(showYear, showMonth + 1);
			nextYear = nextDate.getFullYear();
			nextMonth = nextDate.getMonth();

			calLeft = new Calendar({
				value: {
					year: showYear,
					month: showMonth,
					day: day,
				}
			});
			$(calLeft).on("select", onDateSelect);

			calRight = new Calendar({
				value: {
					year: nextYear,
					month: nextMonth,
				}
			});
			$(calRight).on("select", onDateSelect);

			var calLeftHolder = elem.find(".calendar-left");
			var calRightHolder = elem.find(".calendar-right");
			calLeftHolder.append(calLeft.getElement());
			calRightHolder.append(calRight.getElement());
		} else {
			var nextDate = new Date(showYear, showMonth + 1);
			nextYear = nextDate.getFullYear();
			nextMonth = nextDate.getMonth();

			if (showYear == year && showMonth == month) {
				calLeft.setValue({
					year: year,
					month: month,
					day: day,
				}, true);
			} else {
				calLeft.setValue({
					year: showYear,
					month: showMonth,
				}, true);
			};

			if (nextYear == year && nextMonth == month) {
				calRight.setValue({
					year: year,
					month: month,
					day: day,
				}, true);
			} else {
				calRight.setValue({
					year: nextYear,
					month: nextMonth,
				}, true);
			};

		};
	}

	function parseValue(value) {
		if (value instanceof Date) {
			year = value.getFullYear();
			month = value.getMonth();
			day = value.getDate();
		} else {
			year = value.year;
			month = value.month;
			day = value.day;
		}
	}

	function isShowing() {
		return (year == showYear && month == showMonth) || (year == nextYear && month == nextMonth);
	}

	function showPrevMonth() {
		var prevDate = new Date(showYear, showMonth - 1);
		var prevYear = prevDate.getFullYear();
		var prevMonth = prevDate.getMonth();

		showYear = prevYear;
		showMonth = prevMonth;
		render();
	}

	function showNextMonth() {
		showYear = nextYear;
		showMonth = nextMonth;
		render();
	}

	function onDateSelect(e) {
		self.setValue(e.value);
	}

	function onPrevClick() {
		showPrevMonth();
	}

	function onNextClick() {
		showNextMonth();
	}
}