
import { systemNotifications, } from "./coreModels";

export const userMockups = {
  query: {
    listNotificationsByDate: (variables, Options) => {
      // systemNotifications is wrong.... ????
      return { data: { listNotificationsByDate: { items: systemNotifications, nextToken: null } } }
    },
    addressBook: (variables, Options) => {
      /*
         address.... {
           name: user.name,
           endpoint: user.endpoint,
           region: user.region,
         };
         */

      return { data: { getUserAddressBook: { items: [], nextToken: null } } }
    },


    /*
    export const getAddressBook = `query addressBook($id: String!) {
      getUserAddressBook(id: $id) {
        id
        addressBook
      }
    }`;
    */
  },
  mutation: {
    updateUserActivity: (variables, Options) => ({ data: { updateActivity: true } }),
  }
}

//updateActivity(activeApp: String!, id: String!): Boolean
/*
export const updateActivity = `mutation updateUserActivity($id: String!,$activeApp: String!) {
 
  updateActivity( id: $id,activeApp: $activeApp)
}`;
*/