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

export const createObjSummary = (obj, opt) => {
  const prompt = [];
  //const sStr = JSON.stringify(Object.flatten(obj)).replace(/,/g, "\n").replace(/{/g, "").replace(/}/g, "");
  const sStr = JSON.stringify(Object.flatten(obj));
  console.log("FLATTEN JSON ,", sStr);
  //const sStr = JSON.stringify(obj).replace(/:{/g, ":\n{").replace(/,/g, ",\n");
  //const sStr = JSON.stringify(obj);
  //prompt.push(sStr);
  //prompt.push("");
  //prompt.push("Create summary of my above data. Limit summary max 700 characters.");
  prompt.push("Below is data about  my sleep. Create summary emphasising relevant attributes.");
  prompt.push("");
  prompt.push(sStr);
  prompt.push("");

  if (opt?.localizeTime !== undefined && opt.localizeTime.format == "24h") {
    prompt.push("Do not use terms am or pm with dates and times.");
  }
  /*
  prompt.push("When minutes is over 60, convert all minutes to hours and minutes, using following examples.");
  prompt.push("Example: 345 minutes.");
  prompt.push("Convert: 5 hours and 45 minutes.");
*/

  return prompt.join("\n")
}


export const answerParser = (obj, examples) => {
  console.log("PARSER HELPER ", obj, examples);
  const prompt = [];
  //const sStr = JSON.stringify(obj).replace(/:{/g, ":\n{").replace(/,/g, ",\n");
  const sStr = JSON.stringify(Object.flatten(obj));
  //const sStr = JSON.stringify(obj);

  prompt.push("This data object is to be used in following question:");
  prompt.push("");
  prompt.push(sStr);
  prompt.push("");

  prompt.push("The following is a list of questions and answer they fall into:");
  prompt.push("");
  examples.forEach(w => {
    prompt.push(w.Q);
    prompt.push(w.A);
    prompt.push("");
  })
  /*
  prompt.push("Q: how long I slept deep sleep?");
  prompt.push("A: 127 minutes");
  prompt.push("");

  prompt.push("Q: how long I had rem sleep?");
  prompt.push("A: 78 minutes");
  prompt.push("");

  prompt.push("Q: how many light sleep periods I had?");
  prompt.push("A: 20 times");
  prompt.push("");
  */

  prompt.push("Answer questions in following format, if anser is not found");
  prompt.push("A: NOT-FOUND");
  prompt.push("");

  return prompt.join("\n")
}


const dateCurrentDate = (d) => {
  const date_today = d || new Date();
  return date_today.toISOString().split("T")[0];
}
const dateYesterdayDate = (d) => {
  const date_today = d || new Date();
  return new Date(date_today.setDate(date_today.getDate() - 1)).toISOString().split("T")[0];
}
const dateTomorrowDate = (d) => {
  const date_today = d || new Date();
  return new Date(date_today.setDate(date_today.getDate() + 1)).toISOString().split("T")[0];
}
const dateWeekEnd = (d) => {
  const date_today = d || new Date();
  const first_day_of_the_week = new Date(date_today.setDate(date_today.getDate() - date_today.getDay())); // week begins on sunday... this is the last day of previous week
  return first_day_of_the_week.toISOString().split("T")[0];
}
const dateWeekStart = (d) => {

  const date_today = d || new Date();
  const first_day_of_the_last_week = new Date(date_today.setDate(date_today.getDate() - date_today.getDay() - 6))
  return first_day_of_the_last_week.toISOString().split("T")[0];
}

const getTimePeriodDate = (timePeriod, opt) => {

  let date = "";
  switch (timePeriod) {
    case 'today':
      date = dateCurrentDate();
      break;
    case 'yesterday':
      date = dateYesterdayDate();
      break;
    case 'tomorrow':
      date = dateTomorrowDate();
      break;
    case 'past week':
      date = dateWeekStart() + "," + dateWeekEnd();
      break;
    case 'last night':
      if (opt) {
        date = dateCurrentDate();
      } else {
        date = dateYesterdayDate();
      }
      break;
    default:
      date = "";
  }
  return date;
}

function toHoursAndMinutes(totalMinutes, opt = false) {
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  if (opt) {
    return `${hours} hours and ${minutes} minutes`;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export const buildFilter = (filter, timePeriodDate) => {

  const properFilter = { "s3::date": { [filter]: timePeriodDate } };

  return JSON.stringify(properFilter);
}

export const dateParser = (cDate) => {
  const currentDate = dateCurrentDate(cDate);
  const yesterdayDate = dateYesterdayDate(cDate);

  const weekEnd = dateWeekEnd(cDate);
  const weekStart = dateWeekStart(cDate);

  const prompt = [`Current date is ${currentDate}.`];
  prompt.push("");
  prompt.push("First day of the week is monday and last day of the week is sunday. The following is a list of time periods found in questions and the sql where condition they fall into:");
  prompt.push("");
  prompt.push("today, yesterday, tomorrow, last night, past week, before, since");
  prompt.push("");
  prompt.push("How many steps I had last night?");
  prompt.push(`timePeriod=${yesterdayDate}`);
  prompt.push("");
  prompt.push("How many times I visited helsinki yesterday?");
  prompt.push(`timePeriod=${yesterdayDate}`);
  prompt.push("");
  prompt.push("Did I visited tampere last week?");
  prompt.push(`timePeriod between ${weekStart} and ${weekEnd}`);
  prompt.push("");
  prompt.push("How many times I have been in tampere before 2022?");
  prompt.push("timePeriod<2022-01-01");
  prompt.push("");
  prompt.push("How many times I have been in helsinki since 2021?");
  prompt.push("timePeriod>2021-12-31");
  prompt.push("");
  prompt.push("Answer questions in following format, when time period is found use current date and answer using sql where condition.");
  prompt.push("timePeriod=2023-03-17");
  prompt.push("");
  prompt.push("Answer questions in following format, when time period is not found.");
  prompt.push("timePeriod=NOT-FOUND");
  prompt.push("");

  return prompt.join("\n")
}