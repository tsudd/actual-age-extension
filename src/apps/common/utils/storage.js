export const storage = {
  get: async (name, cb) => {
    const result = await browser.storage.sync.get(name);
    cb(result[name]);
  },
  set: async (name, value, cb) => {
    await browser.storage.sync.set(
      {
        [name]: value,
      },
      () => {
        if (cb) cb();
      }
    );
  },
};
