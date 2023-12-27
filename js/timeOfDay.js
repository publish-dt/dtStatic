function getTimeOfDay( a1, a2 ) {
	var StopAction = false;
	var StopActionMessage = "";
	var begin = 6;					// конец "ночь", начало "день"
	var end = 0;					// конец "день", начало "ночь"
	var count_of_days = -1;
	if (a2 > 23) {
		StopAction = true;
		StopActionMessage += "Час: не может быть более 23 и менее 0 ! \n";
	}

	ReHour = /\d{2}|\d{1}/;
	ReMinutes = /[0-5][0-9]$/;
	var t1h = ReHour.exec(a1);
	var t1m = ReMinutes.exec(a1);

	if (t1h < 0 || t1h > 23) {
		StopAction = true;
		StopActionMessage += "Длительность не может превышать сутки ! \n";
	}
	if (t1m > 59 || t1m < 0) {
		StopAction = true;
		StopActionMessage += "Минута: не может быть более 59 и менее 0 ! \n";
	}

	t2h = (parseInt(t1h) + parseInt(a2));

	while (t2h >= 24) {
		t2h = (parseInt(t2h)-parseInt(24));
		count_of_days++;
	}

	if (!StopAction) {

//////////////////////////////////////////////////////////////////////////////
///  вычисляем начало - день это или ночь ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

		if ( t1h >= end && t1h < begin )	time_int1 = 1;						// "ночью";
						else	time_int1 = 0;									// "днём";

//////////////////////////////////////////////////////////////////////////////
///  вычисляем конец - день это или ночь /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


		if ( t2h >= end && t2h < begin )	time_int2 = 1;						// "ночью";
						else	time_int2 = 0;									// "днём";

//////////////////////////////////////////////////////////////////////////////
///  вычисляем по условию ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

		if ( time_int1 == 1 && time_int2 == 1 ) {								// если ночь и ночь
			return 1;
		}
		else if	( time_int1 == 0 && time_int2 == 0 ) {							// если день и день

			if ( ( t1h >= begin && t1h <= 24 && t1h > t2h ) && ( t2h >= begin && t2h <= 24 && t2h < t1h ) ) {
				return 1;
			} else {
				return 0;
			}

		}
		else if ( time_int1 == 1 && time_int2 == 0 ) {
			return 1;
		}
		else if ( time_int1 == 0 && time_int2 == 1 ) {
			return 1;
		}
	} else {
		alert(StopActionMessage);
	}
}
