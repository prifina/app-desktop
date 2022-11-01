import { Provider, } from "../stores/PrifinaStore";

import create from 'zustand'

export const MockStore = ({ checkEmail, checkUser, checkPhone, verifyResult = true, children }) => {
  console.log("MOCK STORE ", checkEmail, checkUser, checkPhone);
  const emailCheckResult = checkEmail || false;
  const userCheckResult = checkUser || false;
  const phoneCheckResult = checkPhone || false;
  return <Provider createStore={() =>
    create((set, get) => ({
      activeIndex: -1,
      setActiveIndex: (newIndex) => {
        set({ activeIndex: newIndex });
      },
      signUp: async (newUser) => {
        return Promise.resolve({ user: newUser });
      },
      getCountryCodeQuery: async () => {
        return Promise.resolve("FI");
      },
      checkCognitoAttributeQuery: async (attrName, attrValue) => {
        /*
        API,
        "email",
        email,
        config.cognito.USER_POOL_ID,
        */
        if (attrName === "email") return Promise.resolve(emailCheckResult);
        if (attrName === "username") return Promise.resolve(userCheckResult);
        if (attrName === "phone_number") return Promise.resolve(phoneCheckResult);
      },
      resendCode: async (target) => {
        return Promise.resolve(true);
        /*
      try {
        await sendVerificationMutation(
          API,
          "email",
          JSON.stringify({
            userId: currentUser.username,
            clientId: currentUser.client,
            email: currentUser.email,
            given_name: currentUser.given_name,
          }),
        );
        alerts.info(i18n.__("emailVerificatioSent"), {});
      } catch (e) {
        console.log("ERR", e);
      }
      */
      },
      verifyCode: async (code) => {
        return Promise.resolve(verifyResult);
        /*
          try {
            const userCode = [
              currentUser.username,
              currentUser.client,
              "email",
              verificationFields.verificationCode,
            ].join("#");
      
            const result = await getVerificationQuery(API, userCode);
      
            if (result.data.getVerification === null) {
              alerts.error(i18n.__("invalidCode"), {});
              setInputError({ status: true });
            }
            console.log("VERIFY ", result);
            nextStepAction(3);
          } catch (e) {
            console.log("ERR", e);
            alerts.error(i18n.__("invalidCode"), {});
            setInputError({ status: true });
            nextStepAction(2);
          }
          */
      }


    }))
  }>
    {children}
  </Provider>
}
