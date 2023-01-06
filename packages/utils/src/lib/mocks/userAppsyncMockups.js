
import { systemNotifications, } from "./coreModels";

export const userMockups = {
  query: {
    listNotificationsByDate: (variables, Options) => {
      // systemNotifications is wrong.... ????
      return { data: { listNotificationsByDate: { items: systemNotifications, nextToken: null } } }
    },

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