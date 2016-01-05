(function() {
  var loadPlugin, loadPlugins, loadStylesheet, promise;

  window._version = "v-1451995127167";

  window.taigaConfig = {
    "api": "http://localhost:8000/api/v1/",
    "eventsUrl": null,
    "eventsMaxMissedHeartbeats": 5,
    "eventsHeartbeatIntervalTime": 60000,
    "debug": true,
    "defaultLanguage": "en",
    "themes": ["taiga", "material-design", "high-contrast"],
    "defaultTheme": "taiga",
    "publicRegisterEnabled": true,
    "feedbackEnabled": true,
    "privacyPolicyUrl": null,
    "termsOfServiceUrl": null,
    "maxUploadFileSize": null,
    "contribPlugins": []
  };

  window.taigaContribPlugins = [];

  window._decorators = [];

  window.addDecorator = function(provider, decorator) {
    return window._decorators.push({
      provider: provider,
      decorator: decorator
    });
  };

  window.getDecorators = function() {
    return window._decorators;
  };

  loadStylesheet = function(path) {
    return $('head').append('<link rel="stylesheet" href="' + path + '" type="stylesheet" />');
  };

  loadPlugin = function(pluginPath) {
    return new Promise(function(resolve, reject) {
      return $.getJSON(pluginPath).then(function(plugin) {
        window.taigaContribPlugins.push(plugin);
        if (plugin.css) {
          loadStylesheet(plugin.css);
        }
        if (plugin.js) {
          return ljs.load(plugin.js, resolve);
        } else {
          return resolve();
        }
      });
    });
  };

  loadPlugins = function(plugins) {
    var promises;
    promises = [];
    _.map(plugins, function(pluginPath) {
      return promises.push(loadPlugin(pluginPath));
    });
    return Promise.all(promises);
  };

  promise = $.getJSON("/conf.json");

  promise.done(function(data) {
    return window.taigaConfig = _.extend({}, window.taigaConfig, data);
  });

  promise.always(function() {
    if (window.taigaConfig.contribPlugins.length > 0) {
      return loadPlugins(window.taigaConfig.contribPlugins).then(function() {
        return ljs.load("/" + window._version + "/js/app.js", function() {
          return angular.bootstrap(document, ['taiga']);
        });
      });
    } else {
      return ljs.load("/" + window._version + "/js/app.js", function() {
        return angular.bootstrap(document, ['taiga']);
      });
    }
  });

}).call(this);
