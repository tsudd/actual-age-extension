import { storage } from "../../common";

export const updateThemePostMessage = () => {
  storage.get("theme", (theme) => {
    browser.runtime.sendMessage(
      {
        type: "UPDATE_THEME",
        payload: {
          theme,
        },
      },
      () => {}
    );
  });
};
