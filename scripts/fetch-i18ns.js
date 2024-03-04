const fs = require("fs");
const path = require("path");
const axios = require("axios");
const rimraf = require("rimraf");
const consola = require("consola");

(async () => {
  const langs = ["en", "zh", "es", "zh_cn", "ja", "ko"];
  const dist = path.resolve(__dirname, "../web/i18ns");

  const { data } = await axios("schema://your translate domain /api");

  await new Promise((resolve, reject) => rimraf(dist, error => error ? reject(error) : resolve()));
  fs.mkdirSync(dist);

  const develData = data[Object.keys(data).find(item => /devel/.test(item))];

  langs.forEach(key => {
    if (data[key]) {
      try {
        const fileName = key + ".json";
        handleDefault(data[key], develData);
        deleteEmpty(data[key]);
        fs.writeFileSync(path.resolve(dist, fileName), JSON.stringify(data[key]));
        consola.success(`Has been written to ${fileName}.`);
      } catch (e) {
        consola.error(e);
        process.exit(1);
      }
    } else {
      consola.error(`The ${key} data does not exist.`);
    }
  });
})();

function deleteEmpty(lang) {
  Object.entries({ ...lang }).forEach(([key, val]) => {
    if (typeof val === "object") {
      deleteEmpty(val);
    } else if (val === "" || typeof val === "undefined" || val === null) {
      delete lang[key];
    }
  });
}

function handleDefault(target, source) {
  Object.keys(target).forEach(key => {
    if (typeof target[key] === "string") {
      if (!target[key]) {
        target[key] = source[key];
      }
    } else {
      if (target[key] && !source[key]) {
        source[key] = target[key].constructor === Array ? [] : {};
      }
      handleDefault(target[key], source[key]);
    }
  });
}
