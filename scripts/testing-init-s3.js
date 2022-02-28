const {
  getAccountID,
  getS3Objects,
  getUserDataSources,
  copyS3Objects,
} = require("./testing-utils");

async function main() {
  //const userID = "4ffab59558a21401b6c1e9e560da28e3fd4a";
  //const testUserID = "x4ffab59558a21401b6c1e9e560da28e3fd4a";
  const userID = process.env.userID;
  const testUserID = process.env.testUserID;

  //const integrations = ["oura"];
  try {
    const accountData = await getAccountID();

    const accountID = accountData.Account;

    const userBucket = `prifina-user-${accountID}-${process.env.AWS_DEFAULT_REGION}`;
    let dsKeys = [];
    //let dsFolders = [];
    const data = await getUserDataSources(userID);
    const integrations = data.Items;
    const maxKeys = 200;
    for (let i = 0; i < integrations.length; i++) {
      let promises = [];

      if (integrations[i].dataSource === "oura") {
        ["activity", "readiness", "sleep"].forEach(f => {
          const dKey = [
            "datasources",
            integrations[i].dataSource,
            userID,
            f,
          ].join("/");
          promises.push(getS3Objects(userBucket, dKey, maxKeys));
        });
        //dsFolders.push(dKey);
      }
      const res = await Promise.all(promises);
      //console.log("RES ", res);
      for (let r = 0; r < res.length; r++) {
        dsKeys = dsKeys.concat(res[r]);
      }
    }

    //console.log(dsKeys);
    let copyKeys = [];
    dsKeys.forEach(d => {
      copyKeys.push({
        Bucket: userBucket,
        CopySource: [userBucket, d].join("/"),
        Key: d.replace(userID, testUserID),
      });
    });

    //console.log(copyKeys);
    const res = await copyS3Objects(copyKeys);
    console.log(res);

    // console.log(dsFolders);
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
