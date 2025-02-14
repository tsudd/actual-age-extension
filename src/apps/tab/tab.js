import * as moment from "moment";

import { config } from "./config";

import { changeTheme, storage } from "../common";

import "./styles";
import "../common/styles";

export const setupTab = () => {
  const age = document.getElementById("age");
  const ageMain = document.getElementById("age__main");

  const ageExtra = document.getElementById("age__extra");

  storage.get("theme", (theme) => {
    changeTheme(theme);
  });

  const getMain = (birthday) => {
    const date = moment(birthday);
    return moment().diff(date, "years");
  };

  const formatExtra = (extra) => extra.toFixed(config.FIXED_POINT).slice(1);

  const getExtra = (birthday) => {
    const main = getMain(birthday);
    const seconds = moment(birthday)
      .add(main + 1, "years")
      .diff(moment(birthday).add(main, "years"), "seconds");

    const diff = moment(birthday)
      .add(main + 1, "years")
      .diff(moment(), "seconds");

    return formatExtra(1 - diff / seconds);
  };

  let isStarted = false;
  let interval;

  const setup = (birthday) => {
    isStarted = true;
    age.style.display = "flex";

    if (!birthday) {
      ageMain.innerText = "Choose";
      ageExtra.innerText = "You Birth Date & Time";
      return;
    }

    if (
      !moment(birthday).isValid() ||
      new Date(birthday).getTime() > Date.now()
    ) {
      ageMain.innerText = "Choose";
      ageExtra.innerText = "Correct Birth Date Please :P";
      return;
    }

    if (interval) clearInterval(interval);

    let lastExtra;
    let smoothExtra;

    interval = setInterval(() => {
      const extra = getExtra(birthday);
      const main = getMain(birthday);
      if (!lastExtra) {
        lastExtra = extra;
        ageExtra.innerText = getExtra(birthday);
      } else {
        if (extra !== lastExtra) {
          ageExtra.innerText = extra;
          smoothExtra = undefined;
          lastExtra = extra;
        } else {
          if (!smoothExtra) smoothExtra = parseFloat(lastExtra);
          smoothExtra += config.MINIMAL_EXTRA_VALUE;
          ageExtra.innerText = formatExtra(smoothExtra);
        }
      }
      if (extra === formatExtra(0.0)) ageMain.innerText = main + 1;
      else ageMain.innerText = main;
    }, config.POLLING_TIMEOUT);
  };

  browser.runtime.onMessage.addListener(({ type, payload }) => {
    switch (type) {
      case "UPDATE_BIRTHDAY": {
        setup(payload.birthday);
        break;
      }
      case "UPDATE_THEME": {
        changeTheme(payload.theme);
        break;
      }
    }
  });

  storage.get("birthday", (birthday) => {
    if (!isStarted) setup(birthday);
  });
};

setupTab();
