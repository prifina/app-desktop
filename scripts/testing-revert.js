const {
  getDataSourceUsers,
  deleteUserDataSourceStatus,
  getUserNotifications,
  deleteUserNotifications,
  timeout,
  sliceIntoChunks,
  deleteUser,
  deletePrifinaUser,
  getUserDataSources,
  getAccountID,
  getUserApps,
  getS3Objects,
  deleteS3Objects,
  deleteS3Object,
  deleteUserApp,
} = require("./testing-utils");

async function main() {
  //const userID = "x4ffab59558a21401b6c1e9e560da28e3fd4a";

  const testUserID = process.env.testUserID;
  // const data = await getDataSourceUsers("oura");
  // console.log("DATA ", data);
  const dataSources = ["oura", "fitbit", "garmin"];

  let integrations = [];
  try {
    const accountData = await getAccountID();

    const accountID = accountData.Account;
    //console.log("ACC ", accountID);
    const apps = await getUserApps(testUserID);
    console.log("APPS ", apps);
    const appBucket = `prifina-apps-${accountID}-${process.env.AWS_DEFAULT_REGION}`;
    let appKeys = [];
    let appFolders = [];
    for (let app = 0; app < apps.Items.length; app++) {
      appKeys = await getS3Objects(appBucket, apps.Items[app].id);
      appFolders.push(apps.Items[app].id);
      /*
      {
        Key: 'xx1u3f465t4cNSWYiyKFVwBG/0.0.1/main.bundle.js',
        LastModified: 2022-02-22T04:16:23.000Z,
        ETag: '"2f02b8182fea0a739f87b9ad176aada1"',
        Size: 46944,
        StorageClass: 'STANDARD',
        Owner: undefined
      },
      */
    }
    console.log("APP KEYS ", appKeys, appFolders);
    if (appKeys.length > 0) {
      await deleteS3Objects(appBucket, appKeys);
    }
    if (appFolders.length > 0) {
      for (let a = 0; a < appFolders.length; a++) {
        await deleteS3Object(appBucket, appFolders[a] + "/");
        await deleteUserApp(appFolders[a]);
      }
    }
    //await deleteAppObject(appBucket, "xx1u3f465t4cNSWYiyKFVwBG/");
    const data = await getUserDataSources(testUserID);
    integrations = data.Items;
    console.log("INTEGRATIONS ", integrations);
    const coreBucket = `prifina-core-${accountID}-${process.env.AWS_DEFAULT_REGION}`;
    let integrationKeys = [];
    let integrationFolders = [];

    for (let i = 0; i < integrations.length; i++) {
      const dKey = [
        "integrations",
        integrations[i].dataSource,
        testUserID,
      ].join("/");
      integrationKeys = await getS3Objects(coreBucket, dKey);
      integrationFolders.push(dKey);
    }
    console.log("KEYS ", integrationKeys);
    if (integrationKeys.length > 0) {
      await deleteS3Objects(coreBucket, integrationKeys);
    }

    if (integrationFolders.length > 0) {
      for (let a = 0; a < integrationFolders.length; a++) {
        await deleteS3Object(coreBucket, integrationFolders[a] + "/");
      }
    }

    const userBucket = `prifina-user-${accountID}-${process.env.AWS_DEFAULT_REGION}`;
    let dsKeys = [];
    let dsFolders = [];

    for (let i = 0; i < integrations.length; i++) {
      const dKey = ["datasources", integrations[i].dataSource, testUserID].join(
        "/",
      );
      dsKeys = await getS3Objects(userBucket, dKey);
      dsFolders.push(dKey);
    }
    console.log("KEYS ", dsKeys);
    if (dsKeys.length > 0) {
      if (dsKeys.length > 999) {
        const chunks = sliceIntoChunks(dsKeys, 999);
        //console.log("CHUNKS ", chunks);
        for (let n = 0; n < chunks.length; n++) {
          await timeout(3000);
          await deleteS3Objects(userBucket, chunks[n]);
        }
      } else {
        await deleteS3Objects(userBucket, dsKeys);
      }
    }

    if (dsFolders.length > 0) {
      for (let a = 0; a < dsFolders.length; a++) {
        await deleteS3Object(userBucket, dsFolders[a] + "/");
      }
    }

    let dmKeys = [];
    let dmFolders = [];
    //s3://prifina-user-352681697435-eu-west-1/datamodels/oura/activity/summary/user=id_4ffab59558a21401b6c1e9e560da28e3fd4a/
    //s3://prifina-user-352681697435-eu-west-1/datamodels/oura/readiness/summary/user=id_x4ffab59558a21401b6c1e9e560da28e3fd4a/
    //s3://prifina-user-352681697435-eu-west-1/datamodels/oura/sleep/data/user=id_x4ffab59558a21401b6c1e9e560da28e3fd4a/
    //s3://prifina-user-352681697435-eu-west-1/datamodels/oura/sleep/summary/user=id_x4ffab59558a21401b6c1e9e560da28e3fd4a/
    for (let i = 0; i < integrations.length; i++) {
      const dKey = [
        "datamodels",
        integrations[i].dataSource,
        "activity",
        "summary",
        "user=id_" + testUserID,
      ].join("/");
      dmKeys = dmKeys.concat(await getS3Objects(userBucket, dKey));
      dmFolders.push(dKey);

      const dKey1 = [
        "datamodels",
        integrations[i].dataSource,
        "readiness",
        "summary",
        "user=id_" + testUserID,
      ].join("/");
      dmKeys = dmKeys.concat(await getS3Objects(userBucket, dKey1));
      dmFolders.push(dKey1);
      const dKey2 = [
        "datamodels",
        integrations[i].dataSource,
        "sleep",
        "summary",
        "user=id_" + testUserID,
      ].join("/");
      dmKeys = dmKeys.concat(await getS3Objects(userBucket, dKey2));
      dmFolders.push(dKey2);
      const dKey3 = [
        "datamodels",
        integrations[i].dataSource,
        "sleep",
        "data",
        "user=id_" + testUserID,
      ].join("/");
      dmKeys = dmKeys.concat(await getS3Objects(userBucket, dKey3));
      dmFolders.push(dKey3);
    }
    console.log("KEYS ", dmKeys.length, dmKeys[0]);

    if (dmKeys.length > 0) {
      if (dmKeys.length > 999) {
        const chunks = sliceIntoChunks(dmKeys, 999);
        //console.log("CHUNKS ", chunks);
        for (let n = 0; n < chunks.length; n++) {
          await timeout(3000);
          await deleteS3Objects(userBucket, chunks[n]);
        }
      } else {
        await deleteS3Objects(userBucket, dmKeys);
      }
    }

    if (dmFolders.length > 0) {
      for (let a = 0; a < dmFolders.length; a++) {
        await deleteS3Object(userBucket, dmFolders[a] + "/");
      }
    }

    for (let i = 0; i < integrations.length; i++) {
      /*
      const data = await deleteUserDataSourceStatus(
        userID,
        integrations[i].dataSource,
      );
      */
      // with test user is not possible to use real dataSource status keys, because scheduled events will create new tokens
      const data2 = await deleteUserDataSourceStatus(
        testUserID,
        integrations[i].dataSource + "x",
      );

      //console.log("DATA ", data);
    }

    /*
    for (let i = 0; i < dataSources.length; i++) {
      const data = await deleteUserDataSourceStatus(userID, dataSources[i]);
      console.log("DATA ", data);
    }
    */

    // scan is not recursive....
    const notifications = await getUserNotifications(testUserID);
    //console.log("DATA ", notifications);
    if (notifications.Items.length > 25) {
      const chunks = sliceIntoChunks(notifications.Items, 25);
      //console.log("CHUNKS ", chunks);
      for (let n = 0; n < chunks.length; n++) {
        await timeout(3000);
        await deleteUserNotifications(chunks[n]);
      }
    } else if (notifications.Items.length > 0) {
      await deleteUserNotifications(notifications.Items);
    }

    await deleteUser(testUserID);
    await deletePrifinaUser(testUserID);
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

//4ffab59558a21401b6c1e9e560da28e3fd4a
