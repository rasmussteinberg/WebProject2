const tellDateET = function(){
	let timeNow = new Date();
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const tellWeekDayET = function(){
	let timeNow = new Date();
	const weekdayNamesEt = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
	return weekdayNamesEt[timeNow.getDay()];
}

const tellTimeET = function(){
	let timeNow = new Date();
	return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
}

const partOfDay = function(){
	let hour = new Date().getHours();
	if(hour < 6) return "öö";
	if(hour < 12) return "hommik";
	if(hour < 18) return "pärastlõuna";
	return "õhtu";
}
module.exports = {fullDate: tellDateET, longDate: tellDateET, weekDay: tellWeekDayET, time: tellTimeET, fullTime: tellTimeET, partOfDay: partOfDay};