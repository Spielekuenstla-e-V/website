module.exports = function (environment) {
  let myGlobal = environment === 'production' ? process.env.MY_GLOBAL : 'testing';

  return {
    buildSandboxGlobals(defaultGlobals) {
      return Object.assign({}, defaultGlobals, {
        myGlobal,
        AbortController,
        fetch: fetch,
      });
    },
  };
};