const {
  cognitoRemoveUserToGroup,
  cognitoListUsersInGroup,
} = require("./testing-utils");

async function main() {
  //const userID = "4ffab59558a21401b6c1e9e560da28e3fd4a";
  //const testUserID = "x4ffab59558a21401b6c1e9e560da28e3fd4a";
  const userID = process.env.userID;
  const testUserID = process.env.testUserID;
  //const testUserID = "6145b3af07fa22f66456e20eca49e98bfe35";
  const userPoolID = "us-east-1_L9Jzzwr2V";
  try {
    const userData = { group: "DEV", pool_id: userPoolID };
    const data = await cognitoListUsersInGroup(userData);

    const foundUsers = data.Users.filter(user => {
      const found = user.Attributes.filter(a => {
        //console.log(a);
        if (a.Name === "custom:prifina" && a.Value === testUserID) {
          //console.log("OK");
          return true;
        }
      });
      //console.log("FOUND ", found);
      return found.length > 0;
    });
    //console.log(foundUsers[0].Username);
    for (let i = 0; i < foundUsers.length; i++) {
      const groupData = {
        user_id: foundUsers[i].Username,
        group: "DEV",
        pool_id: userPoolID,
      };
      console.log(groupData);
      await cognitoRemoveUserToGroup(groupData);
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
