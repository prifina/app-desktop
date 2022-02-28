const {
  getAccountID,
  getUserNotifications,
  getUserDataSources,
  getItem,
  newTestUser,
  addUserNotifications,
  sliceIntoChunks,
  timeout,
  newUserDataSource,
} = require("./testing-utils");

async function main() {
  //const userID = "4ffab59558a21401b6c1e9e560da28e3fd4a";
  //const testUserID = "x4ffab59558a21401b6c1e9e560da28e3fd4a";
  const userID = process.env.userID;
  const testUserID = process.env.testUserID;

  try {
    //const accountData = await getAccountID();
    //const accountID = accountData.Account;
    let params = {
      TableName: "PrifinaUser",
      Key: {
        id: userID,
      },
    };

    console.log("PARAMS", params);

    const user = await getItem(params);

    //console.log(user);
    await newTestUser(testUserID, user.Item);

    const notifications = await getUserNotifications(userID, true);
    //console.log(notifications.Items);
    let newNotifications = [];
    notifications.Items.forEach((n, i) => {
      n.owner = testUserID;
      n.notificationId = n.notificationId + "-" + i;
      newNotifications.push(n);
    });
    if (newNotifications.length > 25) {
      const maxNotifications = Math.min(60, newNotifications.length);

      const chunks = sliceIntoChunks(
        newNotifications.slice(0, maxNotifications),
        25,
      );

      for (let n = 0; n < chunks.length; n++) {
        await timeout(3000);

        await addUserNotifications(chunks[n]);
      }
    } else {
      await addUserNotifications(newNotifications);
    }

    const dataSources = await getUserDataSources(userID, true);

    for (let i = 0; i < dataSources.Items.length; i++) {
      let newDataSource = dataSources.Items[i];
      newDataSource.id = testUserID;
      newDataSource.dataSource = newDataSource.dataSource + "x";
      await newUserDataSource(newDataSource);
    }
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
