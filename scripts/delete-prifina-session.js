const { getUserSessions, deletePrifinaSession } = require("./testing-utils");

async function main() {
  const userID = process.env.testUserID;

  try {
    const sessionData = await getUserSessions();
    let trackers = [];
    sessionData.Items.forEach(session => {
      //console.log(Object.keys(session.tokens));
      Object.keys(session.tokens).forEach(t => {
        if (t.endsWith(".userData")) {
          //console.log(t, typeof session.tokens[t]);
          const userData = JSON.parse(session.tokens[t]);
          //console.log(userData.UserAttributes);
          userData.UserAttributes.forEach(u => {
            if (u.Name === "custom:prifina" && u.Value === userID) {
              console.log("TRACKER ", session.tracker);
              trackers.push(session.tracker);
            }
          });
        }
      });
    });

    for (let i = 0; i < trackers.length; i++) {
      await deletePrifinaSession(trackers[i]);
    }
    //console.log(sessionData);
  } catch (e) {
    console.log("ERR ", e);
  }

  return Promise.resolve(true);
}
console.log(
  "MAIN ",
  main().then(res => {
    console.log(res);
  }),
);
