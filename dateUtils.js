const daysInWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

//Generira tjedan u trenutnoj godini
Date.prototype.getWeek = function () {
  let date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  var week1 = new Date(date.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

//Generira range na temelju broja tjedna
function getDateRangeOfWeek(weekNo) {
  let currentDate, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
  currentDate = new Date();
  numOfdaysPastSinceLastMonday = currentDate.getDay() - 1;
  currentDate.setDate(currentDate.getDate() - numOfdaysPastSinceLastMonday);
  currentDate.setDate(
    currentDate.getDate() + 7 * (weekNo - currentDate.getWeek())
  );
  rangeIsFrom =
    currentDate.getMonth() +
    1 +
    "." +
    currentDate.getDate() +
    "." +
    currentDate.getFullYear();
  currentDate.setDate(currentDate.getDate() + 6);
  rangeIsTo =
    currentDate.getMonth() +
    1 +
    "." +
    currentDate.getDate() +
    "." +
    currentDate.getFullYear();
  return {
    from: rangeIsFrom,
    to: rangeIsTo,
  };
}

function getListOfDateRange(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 2);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const firstWeekInMonth = firstDayOfMonth.getWeek();
  const lastWeekInMonth = lastDayOfMonth.getWeek();

  let listOfDateRange = [];
  for (let i = firstWeekInMonth; i < lastWeekInMonth; i++) {
    let dateRangeFinder = getDateRangeOfWeek(i);
    listOfDateRange.push({
      firstDay: dateRangeFinder.from,
      lastDay: dateRangeFinder.to,
    });
  }
  return listOfDateRange;
}

const removeTime = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
};

module.exports = {
  daysInWeek,
  Date,
  getDateRangeOfWeek,
  getListOfDateRange,
  removeTime,
  isValidDate,
};
