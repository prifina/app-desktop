function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

Object.flatten = function (data) {
  var result = {};
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0)
        result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        //recurse(cur[p], prop ? prop + "." + p : p);
        recurse(cur[p], prop ? prop + capitalizeFirstLetter(p) : p);
      }
      if (isEmpty && prop)
        result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

const s = { "deep": { "count": 14, "minutes": 129, "thirtyDayAvgMinutes": 136 }, "light": { "count": 8, "minutes": 214, "thirtyDayAvgMinutes": 210 }, "rem": { "count": 15, "minutes": 154, "thirtyDayAvgMinutes": 162 }, "wake": { "count": 9, "minutes": 83, "thirtyDayAvgMinutes": 83 }, "startTimeTS": 1680484779807, "endTimeTS": 1680520959807, "startTime": "2023-04-03T01:19:39.807Z", "endTime": "2023-04-03T11:22:39.807Z", "minutesAfterWakeup": 1, "minutesAsleep": 497, "minutesAwake": 83, "minutesToFallAsleep": 22, "timeInBed": 603 };

//const sStr = JSON.stringify(s).replace(/:{/g, ":\n{").replace(/,/g, ",\n");
sStr = Object.flatten(s);
console.log(sStr);

